# Adhan Paper landing page

A static, responsive landing page prepared for GitHub Pages.

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Upload everything in this folder to the root of the repository.
3. In GitHub open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then save.
6. GitHub will show the public Pages URL when deployment finishes.

## Add your real links

Open `script.js` and fill in the values inside `CONFIG`:

```js
const CONFIG = {
  appStoreUrl: "https://...",
  playStoreUrl: "https://...",
  marketplaceUrl: "https://...",
  waitlistEndpoint: "https://YOUR_API_ID.execute-api.eu-west-1.amazonaws.com/waitlist",
  turnstileSiteKey: "YOUR_CLOUDFLARE_TURNSTILE_SITE_KEY"
};
```

Until the app/marketplace URLs are filled in, those buttons show a small coming-soon message. All **Shop now** buttons open the launch waitlist popup.

## Contact email

In `index.html`, replace `hello@example.com` with your real support/contact address.

## Files

- `index.html` — page structure and content
- `styles.css` — responsive visual design
- `script.js` — navigation, waitlist modal, reveal animation and configurable links
- `assets/` — logo, product, app and artwork images

No build step or framework is required.


## Secure launch waitlist popup

Every **Shop now** button opens the built-in “Launching soon” email popup.

Because GitHub Pages is static hosting, the form sends its request to the Adhan Paper AWS backend. The backend validates Cloudflare Turnstile, applies a 100-email-per-day safety limit, and sends an internal notification through Amazon SES.

1. Create a Cloudflare Turnstile widget for `adhanpaper.com` and `www.adhanpaper.com`.
2. Deploy the `adhan-backend` stack with the private `TURNSTILE_SECRET_KEY` environment variable.
3. Copy the `WaitlistEndpoint` CloudFormation output and the public Turnstile site key into `script.js`:

```js
waitlistEndpoint: "https://YOUR_API_ID.execute-api.eu-west-1.amazonaws.com/waitlist",
turnstileSiteKey: "YOUR_CLOUDFLARE_TURNSTILE_SITE_KEY"
```

Never put the private Turnstile secret key in this repository or in `script.js`. After deploying the backend, confirm the SNS alert subscription sent to `info@adhanpaper.com`.
