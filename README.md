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

## Resume Generation

To generate a PDF version of the resume:

1.  Ensure the development server is running (`npm run dev`).
2.  Run the generation script:

```bash
npm run generate-resume
```

This will render `http://localhost:3000/resume-view` and save the output to `public/resume_yuhangang.pdf` for download.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

## Image Upload Pipeline (Cloudflare R2)

This project includes an automated pipeline to sync images from `public/Terengganu/` to Cloudflare R2 under the `Terengganu/` prefix in the bucket.

### 1. Automated Upload (GitHub Actions)
The images are automatically synced to R2 whenever changes are pushed to the `main` branch and `public/Terengganu/` changes. Updates to the workflow or sync script also trigger the job so you can validate pipeline edits on push. To enable this, add the following secrets to your GitHub repository:

- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_ACCOUNT_ID`
- `R2_BUCKET_NAME`

### 2. Manual Upload (Local Script)
You can also sync images manually using the provided script:

```bash
chmod +x scripts/sync-images.sh
./scripts/sync-images.sh
```

**Note:** The local script requires `aws-cli` and reads `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_BUCKET_NAME` from your shell or `.env`.
