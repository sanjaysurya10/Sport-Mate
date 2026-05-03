This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deployment

This project is deployed via Maynooth University GitLab CI/CD.

### Prerequisites
- Account on `gitlab.cs.nuim.ie`
- Docker Desktop installed locally
- `CI_API_PORT` variable set in GitLab → Settings → CI/CD → Variables (get the port number from your supervisor Michael)

### Local Docker test
```bash
docker build -t sport-mate .
docker run --rm -p 3000:3000 sport-mate
```
Open http://localhost:3000 to confirm it works before pushing.

### Deploy
1. Push to `main` branch — the build stage runs automatically
2. Once build passes, go to Build → Pipelines → click ▶ on the deploy stage
3. Live URL: `http://sanjaysurya10-sport-mate.msc.cs.nuim.ie`

> Always use `http://` not `https://` — SSL is not configured on this subdomain.

### Common errors
| Error | Fix |
|---|---|
| 502 Bad Gateway | App not binding to 0.0.0.0 — check `ENV HOSTNAME="0.0.0.0"` in Dockerfile |
| port is already allocated | Wrong CI_API_PORT — confirm your assigned port with Michael |
| Job stuck as Pending | Missing `tags` in `.gitlab-ci.yml` |
| Build fails on .next/standalone | Missing `output: "standalone"` in next.config.js |
