import { createServer } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

const secret = process.env.ANALYTICS_READ_TOKEN;
if (!secret || secret.length < 24) throw new Error("Set ANALYTICS_READ_TOKEN to at least 24 characters.");
const origin = process.env.DASHBOARD_ORIGIN || "https://artsphere-tech.github.io";
const db = new DatabaseSync(process.env.ANALYTICS_DATABASE || "analytics.sqlite");
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    campaign TEXT NOT NULL,
    kind TEXT NOT NULL,
    received_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS events_by_time ON events(received_at);
`);
const record = db.prepare("INSERT OR IGNORE INTO events VALUES (?, ?, ?, ?)");
const totals = db.prepare(`
  SELECT campaign AS campaign_id,
         SUM(kind = 'impression') AS impressions,
         SUM(kind = 'click') AS clicks
  FROM events WHERE received_at >= ? GROUP BY campaign ORDER BY campaign
`);

function send(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  response.end(JSON.stringify(data));
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  const fromDashboard = request.headers.origin === origin;
  if (url.pathname === "/api/v1/events") response.setHeader("Access-Control-Allow-Origin", "*");
  else if (fromDashboard) response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Vary", "Origin");
  if (request.method === "OPTIONS" && fromDashboard && url.pathname === "/api/v1/stats") {
    response.writeHead(204, {
      "Access-Control-Allow-Headers": "Authorization",
      "Access-Control-Allow-Methods": "GET"
    });
    return response.end();
  }
  if (request.method === "OPTIONS" && url.pathname === "/api/v1/events") {
    response.writeHead(204, { "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST" });
    return response.end();
  }
  try {
    if (request.method === "GET" && url.pathname === "/health") return send(response, 200, { ok: true });
    if (request.method === "GET" && url.pathname === "/api/v1/stats") {
      const actual = Buffer.from(request.headers.authorization || "");
      const expected = Buffer.from("Bearer " + secret);
      if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
        return send(response, 401, { error: "Invalid analytics read token." });
      }
      const days = Number(url.searchParams.get("days") || 7);
      if (![1, 7, 30, 90].includes(days)) return send(response, 400, { error: "Unsupported range." });
      return send(response, 200, { campaigns: totals.all(Date.now() - days * 86400000) });
    }
    if (request.method === "POST" && url.pathname === "/api/v1/events") {
      if (!/^application\/json(?:;|$)/i.test(request.headers["content-type"] || "")) {
        return send(response, 415, { error: "Expected JSON." });
      }
      let body = "";
      for await (const chunk of request) {
        body += chunk;
        if (Buffer.byteLength(body) > 2048) return send(response, 413, { error: "Event too large." });
      }
      let event;
      try { event = JSON.parse(body); } catch { return send(response, 400, { error: "Invalid JSON." }); }
      if (!event || typeof event.event_id !== "string" || !/^[a-f0-9]{32}$/i.test(event.event_id) ||
          typeof event.campaign_id !== "string" || !/^cmp_[a-z0-9_-]{1,90}$/i.test(event.campaign_id) ||
          !["impression", "click"].includes(event.event_type)) {
        return send(response, 400, { error: "Invalid event." });
      }
      record.run(event.event_id, event.campaign_id, event.event_type, Date.now());
      return send(response, 202, { accepted: true });
    }
    return send(response, 404, { error: "Route not found." });
  } catch (error) {
    console.error(error.message);
    return send(response, 500, { error: "Analytics temporarily unavailable." });
  }
});
server.requestTimeout = 10000;
server.listen(Number(process.env.PORT || 8787), process.env.HOST || "127.0.0.1");
