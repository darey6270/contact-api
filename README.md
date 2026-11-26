# Contact API

Express + TypeScript contact form API using Nodemailer.


da43.host-ww.net:2222
webmail
https://da43.host-ww.net/roundcube/?_task=mail&_mbox=INBOX#
smazltd.com 
## Requirements
- Node.js version supported by your HostAfrica hosting plan
- SMTP mailbox credentials
- A frontend origin for CORS

## Local setup
```bash
npm install
cp .env.example .env
# Edit .env with your real SMTP credentials
npm run dev
```

## Build and run
```bash
npm run typecheck
npm run build
npm start
```

## API
- `GET /api/health`
- `POST /api/contact`

Example request:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Website enquiry",
  "message": "Hello, I would like to know more about your services.",
  "website": ""
}
```

The `website` field is a honeypot. Keep it hidden in the frontend and leave it empty for real users.

## SMTP configuration
For a HostAfrica cPanel mailbox, use the exact outgoing server settings shown in cPanel > Email Accounts > Connect Devices. Common settings are port 465 with SSL/TLS or port 587 with STARTTLS, but confirm your account's values.

For Gmail / Google Workspace, use `smtp.gmail.com`; Google generally requires an App Password when that feature is available. Do not use your normal Google account password.

## HostAfrica cPanel notes
1. Check that your plan supports Node.js applications and choose a supported Node.js version.
2. Upload the project into an application root, for example `contact-api`.
3. Configure the environment variables in cPanel's Node.js application interface. Do not upload a real `.env` file to a public repository.
4. Run `npm install` in the app environment.
5. Run `npm run build`.
6. Set the startup file to `app.js` if your Passenger setup requires a startup file.
7. Restart the application.

The exact application URL and mount path depend on the cPanel Node.js app configuration. If the app is mounted at `/api`, avoid adding another `/api` prefix in the hosting URL and Express mount configuration.

## Production notes
- Use HTTPS.
- Set `CLIENT_URL` to the exact browser origin (scheme and hostname, no path).
- `express-rate-limit` uses the in-memory store by default. For multiple app instances, use a shared store such as Redis.
- Configure Express `trust proxy` only to match the trusted proxy setup provided by your host. The sample uses one proxy hop; verify this with HostAfrica before relying on IP-based rate limits.
- Email is sent synchronously. A durable queue and database-backed delivery log are recommended if you need retries and guaranteed processing.
- SMTP `verify()` runs at startup; the app will not start if SMTP is unreachable or credentials are invalid.


<!-- mkdir contact-api
cd contact-api

npm init -y

npm install express nodemailer zod dotenv cors helmet express-rate-limit

npm install -D typescript tsx @types/node @types/express @types/nodemailer @types/cors -->
