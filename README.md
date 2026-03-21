# Latent Capital

AI-focused newsletter and media platform built with Next.js and Ghost CMS.

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, Framer Motion
- **CMS**: Ghost 5 (headless, Content API)
- **Database**: MySQL 8.0 (for Ghost)
- **Deployment**: Docker / Railway
- **Language**: TypeScript

## Prerequisites

- Node.js 20+
- Docker and Docker Compose
- npm

## Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/latent-capital.de.git
   cd latent-capital.de
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Start Ghost and MySQL with Docker**

   ```bash
   docker-compose up mysql ghost
   ```

   Wait for both services to be healthy.

5. **Set up Ghost admin**

   Open [http://localhost:2368/ghost](http://localhost:2368/ghost) and create your admin account.

6. **Create a Content API key**

   In Ghost Admin, go to **Settings > Integrations > Add custom integration**. Copy the Content API Key.

7. **Update `.env.local`**

   Paste your Content API key into `GHOST_CONTENT_API_KEY` in `.env.local`.

8. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Docker (Full Stack)

To run everything in Docker:

```bash
docker-compose up --build
```

- Next.js frontend: [http://localhost:3000](http://localhost:3000)
- Ghost CMS admin: [http://localhost:2368/ghost](http://localhost:2368/ghost)

## Railway Deployment

1. **Create a new Railway project** at [railway.app](https://railway.app).

2. **Add a MySQL service** from the Railway template library. Note the connection credentials.

3. **Add a Ghost service** using the `ghost:5-alpine` Docker image. Set environment variables:
   - `database__client` = `mysql`
   - `database__connection__host` = (MySQL internal host)
   - `database__connection__port` = `3306`
   - `database__connection__user` = (MySQL user)
   - `database__connection__password` = (MySQL password)
   - `database__connection__database` = `ghost`
   - `url` = your Ghost public URL

4. **Add the Next.js service** from this repository. Railway will detect the Dockerfile. Set environment variables:
   - `GHOST_URL` = the internal Railway URL for the Ghost service
   - `GHOST_CONTENT_API_KEY` = your Ghost Content API key
   - `NEXT_PUBLIC_SITE_URL` = `https://latent-capital.de`

5. **Configure custom domain** in Railway settings for the Next.js service, pointing `latent-capital.de` to the deployment.

## Ghost CMS Setup

### Tag Naming Conventions

- Use lowercase slugs for tags (e.g., `ai-safety`, `machine-learning`).
- Prefix internal tags with `#` (e.g., `#newsletter`, `#featured`).
- The `#featured` internal tag is used to highlight posts on the homepage.

### Content Structure

- **Posts**: Standard articles and newsletter editions.
- **Pages**: Static pages (About, Contact, etc.).
- Tags control routing and filtering on the frontend.

## Project Structure

```
latent-capital.de/
├── src/
│   ├── app/          # Next.js App Router pages and layouts
│   ├── components/   # Reusable React components
│   └── lib/          # Ghost API client, utilities
├── public/           # Static assets (fonts, images, manifest)
├── ghost/            # Ghost CMS configuration
├── Dockerfile        # Multi-stage Next.js production build
├── docker-compose.yml
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## Environment Variables

| Variable                 | Description                          | Required |
| ------------------------ | ------------------------------------ | -------- |
| `GHOST_URL`              | Ghost CMS URL                        | Yes      |
| `GHOST_CONTENT_API_KEY`  | Ghost Content API key                | Yes      |
| `GHOST_ADMIN_API_KEY`    | Ghost Admin API key (for webhooks)   | No       |
| `NEXT_PUBLIC_SITE_URL`   | Public site URL                      | Yes      |
| `REVALIDATE_SECRET`      | Secret for on-demand revalidation    | No       |
| `MYSQL_ROOT_PASSWORD`    | MySQL root password (Docker only)    | Docker   |

## License

Private. All rights reserved.
