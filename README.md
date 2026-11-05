# PhilGuard Frontend — HTML/CSS/JavaScript

A responsive, premium cybersecurity SaaS frontend for PhilGuard.

## Structure
- `index.html` — public landing page
- `login.html` — authentication
- `register.html` — registration
- `dashboard.html` — customer dashboard
- `pricing.html` — plans
- `docs.html` — developer documentation
- `about.html`
- `contact.html`
- `css/style.css`
- `js/app.js`

## Backend connection
By default the JavaScript client uses:
`http://localhost:4000/v1`

Change it in the browser console with:
`localStorage.setItem('pg_api_url', 'https://YOUR-BACKEND/v1')`

For a production deployment, configure the backend URL through your deployment process rather than hard-coding secrets into the frontend.

## Important
This frontend contains no server-side secrets. Never put database passwords, JWT signing secrets, encryption master keys, M-Pesa credentials, or API private keys in these files.

The payment destination displayed by the site is the supplied Pochi La Biashara number: 0119344804. Automatic payment activation must only be enabled after the backend has a verified authorised payment integration.
