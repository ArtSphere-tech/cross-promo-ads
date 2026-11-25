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
