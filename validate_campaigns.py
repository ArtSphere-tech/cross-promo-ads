import json
from pathlib import Path
from urllib.parse import unquote, urlsplit

root = Path(__file__).resolve().parent
feed = json.loads((root / "campaigns.json").read_text(encoding="utf-8-sig"))
errors = []
ids = set()
campaigns = feed.get("campaigns")
if not isinstance(campaigns, list):
    raise SystemExit("campaigns.json must contain a campaigns array.")
for campaign in campaigns:
    if not isinstance(campaign, dict):
        errors.append("Campaign entries must be objects.")
        continue
    campaign_id = campaign.get("id")
    if not isinstance(campaign_id, str) or not campaign_id or campaign_id in ids:
        errors.append(f"Missing, invalid or duplicate campaign ID: {campaign_id!r}")
    else:
        ids.add(campaign_id)
    if not isinstance(campaign.get("is_active"), bool):
        errors.append(f"{campaign_id}: is_active must be true or false.")
    for key, value in campaign.items():
        if not (key.startswith("target_url") or key.startswith("creative_") and key.endswith("_url")) or not value:
            continue
        if not isinstance(value, str):
            errors.append(f"{campaign_id}: {key} must be a URL or path string.")
            continue
        url = urlsplit(value)
        if url.scheme:
            if url.scheme not in ("http", "https") or not url.netloc:
                errors.append(f"{campaign_id}: invalid URL in {key}.")
        elif key.startswith("target_url") or url.netloc:
            errors.append(f"{campaign_id}: expected an HTTP(S) URL in {key}.")
        else:
            path = (root / unquote(url.path)).resolve()
            if not path.is_relative_to(root / "creatives") or not path.is_file():
                errors.append(f"{campaign_id}: missing creative in {key}: {value}")
if errors:
    raise SystemExit("\n".join(errors))
print(f"Validated {len(campaigns)} campaigns.")
