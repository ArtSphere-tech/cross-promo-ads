# ArtSphere AdMatrix

GitHub Pages serves the dashboard, creatives, and game campaign feed. Existing Unity builds use the same feed URL and JSON fields.

- [Dashboard](https://artsphere-tech.github.io/cross-promo-ads/)
- [Published campaign feed](https://artsphere-tech.github.io/cross-promo-ads/campaigns.json)

## Publish a campaign

1. Sign in to the dashboard with a fine-grained GitHub token scoped to this repository with **Contents: Read and write**. Use a trusted tab and sign out when finished.
2. Upload artwork under new filenames. Use a square icon and check the portrait and landscape dimensions before assigning interstitial artwork.
3. Create the campaign as paused. Set the Android link and add iOS or web destinations where applicable.
4. Test the paused campaign in the simulator. Select **Active** only when the public creative URLs are reachable.
5. Verify the published campaign feed after GitHub Pages deploys. Check a shipped game for changes that affect ad delivery. Device caches and refresh intervals depend on the game build.

Keep existing creative paths, campaign IDs, and feed fields stable. If you remove a creative from use, update its campaigns first and allow time for games with cached feeds before deleting the file.

## Publish from a checkout

Run `python3 validate_campaigns.py` to check campaign IDs, activation flags, HTTPS or HTTP destinations, and local creative paths. Use `bash publish_to_github.sh` from a current `main` checkout to validate and publish campaign data and creatives. The script requires an authenticated `origin` and stages the feed and creative directory.

When reverting a dashboard-only update, revert the dashboard commit. When reverting a campaign change, restore the affected record or creative without overwriting later campaign edits.

## Player analytics

AdMatrix reads impressions and clicks from a separate HTTPS collector. GitHub Pages continues serving `campaigns.json` and the existing creatives. The legacy counters in the feed are not used for the dashboard charts.

- Run the collector with Node.js 24 using `node analytics/server.mjs`. Set a strong `ANALYTICS_READ_TOKEN`, a persistent `ANALYTICS_DATABASE` path, and `PORT` as required. The collector binds to localhost by default. Set `HOST` only when the host requires an external listener.
- Serve it behind an HTTPS reverse proxy. Restrict event ingress with rate limits and monitoring. The game event endpoint is public, so events are client reports and should not be treated as audited billing or fraud-resistant data. Back up the SQLite database.
- Set `analyticsServerUrl` in the Unity `CrossPromoSettings` resource to the HTTPS collector origin. Preserve `serverUrl` for ad delivery. Release the updated game builds after verifying a real impression and click from a test build.
- In AdMatrix, open **Performance & CTR**, enter the collector URL and its analytics read token, choose a range, and load analytics. This read token is separate from your GitHub token. Keep it out of Unity builds and version control.

The collector stores the campaign ID, event type, random event ID, and server receipt time. It does not store player or device IDs. Analytics starts when updated game builds begin reporting. Counts from earlier GitHub Pages builds cannot be reconstructed from the feed.
