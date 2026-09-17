# 🌐 24/7 Cross-Promotion CDN (GitHub Pages)

This repository hosts your **free, permanent, zero-maintenance cross-promotion ad server** powered by GitHub Pages edge CDN.

### ✨ Why this is 100% permanent & reliable:
- **Zero Downtime**: Hosted on GitHub's global edge network (Microsoft / Cloudflare).
- **Works 24/7**: Operates even when your laptop or local development machine is turned off or offline.
- **Offline In-Game Caching**: When players launch your game once, ads are cached locally to device disk, ensuring ads always appear even without internet.
- **Free Forever**: No monthly hosting fees or cloud server costs.

---

## 🚀 Fast Setup (3 Minutes)

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Repository name: `cross-promo-ads` (or any name you prefer).
3. Set visibility to **Public**.
4. Click **Create repository**.

### Step 2: Push This Folder to GitHub
**Option A: Using the included script**
Open Terminal in this folder and run:
```bash
./publish_to_github.sh
```
When prompted, paste your GitHub repository URL (e.g. `https://github.com/username/cross-promo-ads.git`).

**Option B: Drag and Drop in Web Browser**
1. On your newly created GitHub repository page, click **uploading an existing file**.
2. Drag and drop `campaigns.json`, `index.html`, and the `creatives/` folder.
3. Click **Commit changes**.

### Step 3: Enable GitHub Pages
1. On your repository page, click **Settings** (top menu).
2. Click **Pages** in the left sidebar.
3. Under **Build and deployment** -> **Source**: select `Deploy from a branch`.
4. Under **Branch**: select `main` (or `master`) and folder `/(root)`.
5. Click **Save**.

Your permanent URL will be:
```text
https://<your-username>.github.io/<repo-name>
```

---

## 🎮 Connecting Your Unity Games

In your Unity project (`My Family World: City Life` or any other game), open:
`Assets/Plugins/CrossPromo/Scripts/CrossPromoInitializer.cs`

Set your `settings.serverUrl`:
```csharp
// Point directly to your GitHub Pages CDN URL:
settings.serverUrl = "https://<your-username>.github.io/<repo-name>";
```
*Tip: You can also specify the exact file: `https://<your-username>.github.io/<repo-name>/campaigns.json`.*

---

## 🎨 How to Add New Game Ads or Update Graphics

### In 30 seconds from your web browser:
1. Open this repository on GitHub.
2. Click `campaigns.json` -> Click the pencil ✏️ (**Edit this file**) icon.
3. Add or edit your game's details, Google Play store link, and creative image filename.
4. Click **Commit changes**.
5. Within 1 minute, every copy of your game running anywhere in the world will automatically fetch and display your new ads!

### Creative Images:
To add new ad artwork, simply upload your PNG/JPG image into the `creatives/` folder on GitHub and reference it in `campaigns.json` (e.g., `"creative_interstitial_url": "creatives/my_new_game.png"`).
