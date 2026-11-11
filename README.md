# onescotch.github.io

Personal academic portfolio website built with React, Vite, and Tailwind CSS.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Citation Updates

The **Update Citations** GitHub Actions workflow refreshes citation counts daily and can also be run manually. It uses Semantic Scholar's batch API. A valid `SEMANTIC_SCHOLAR_API_KEY` repository secret is optional; without one, requests use Semantic Scholar's shared public quota and may still be rate-limited during heavy use. Replace or remove a rejected key in the repository's Actions secrets.

The `SEMANTIC_SCHOLAR_DELAY_MS` repository variable controls the minimum pause between requests (default: 1500 ms), including batch requests, retries, and authentication fallback. Rate limits are retried up to five total attempts with 15, 30, 60, and 120-second backoff. Longer `Retry-After` values are respected; a requested wait beyond 120 seconds stops further requests for that run instead of retrying early. Failed lookups retain their previous counts, and the workflow fails if every lookup fails.

Run the request-handling tests with `node --test scripts/semantic_scholar.test.js`.

## Deploy to GitHub Pages

### Option 1: GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

Then enable GitHub Pages in your repository settings with "GitHub Actions" as the source.

### Option 2: Manual Deploy

1. Build the project: `npm run build`
2. Push the `dist` folder contents to the `gh-pages` branch
