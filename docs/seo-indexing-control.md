# SEO Indexing Control

This feature allows you to control search engine indexing behavior using environment variables. It's particularly useful for preventing staging or development environments from being indexed by search engines.

## How It Works

The system implements a multi-layer approach to SEO control:

1. **Meta Robots Tags**: Conditionally adds `noindex, nofollow` meta tags to HTML pages
2. **Dynamic robots.txt**: Generates robots.txt file that either allows or disallows all crawlers
3. **Environment-based**: Uses `NEXT_PUBLIC_ALLOW_INDEXING` environment variable

## Environment Variables

### `NEXT_PUBLIC_ALLOW_INDEXING`
- **Type**: String (`'true'` or `'false'`)
- **Default**: `'true'`
- **Description**: Controls whether search engines can index the site

### `NEXT_PUBLIC_SITE_URL`
- **Type**: String (URL)
- **Default**: `'https://help.vtex.com'`
- **Description**: The canonical URL for sitemap reference in robots.txt

## Configuration Examples

### Development Environment (`.env.local`)
```bash
NEXT_PUBLIC_ALLOW_INDEXING=false
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Staging Environment
```bash
NEXT_PUBLIC_ALLOW_INDEXING=false
NEXT_PUBLIC_SITE_URL=https://staging.help.vtex.com
```

### Production Environment
```bash
NEXT_PUBLIC_ALLOW_INDEXING=true
NEXT_PUBLIC_SITE_URL=https://help.vtex.com
```

## Components

### `SEOControl` Component
- Located: `src/components/seo-control.tsx`
- Purpose: Adds robots meta tags when indexing is disabled
- Usage: Automatically included in `_app.tsx`

### Dynamic `robots.txt`
- Located: `src/pages/robots.txt.tsx`
- Purpose: Generates robots.txt based on environment settings
- URL: `/robots.txt`

## Behavior

### When `NEXT_PUBLIC_ALLOW_INDEXING=false`:
- Adds `<meta name="robots" content="noindex, nofollow">` to all pages
- Adds `<meta name="googlebot" content="noindex, nofollow">` for Google-specific control
- Generates robots.txt that disallows all crawlers
- Includes `nosnippet` directive to prevent AI Overview usage

### When `NEXT_PUBLIC_ALLOW_INDEXING=true`:
- No restrictive meta tags are added
- Generates robots.txt that allows crawling with sensible disallows for admin/API routes
- Includes sitemap reference in robots.txt

## Testing

### Local Testing
1. Set `NEXT_PUBLIC_ALLOW_INDEXING=false` in `.env.local`
2. Run `npm run dev`
3. Visit `http://localhost:3000` and check page source for robots meta tags
4. Visit `http://localhost:3000/robots.txt` to verify robots.txt content

### Production Testing
1. Deploy with `NEXT_PUBLIC_ALLOW_INDEXING=true`
2. Check that no noindex meta tags are present
3. Verify robots.txt allows crawling and includes sitemap

## Best Practices

1. **Always disable indexing for non-production environments**
2. **Enable indexing only for the main production domain**
3. **Use staging environments to test SEO changes before production**
4. **Monitor robots.txt accessibility after deployment**

## Troubleshooting

### Meta tags not appearing
- Check that `NEXT_PUBLIC_ALLOW_INDEXING` is properly set
- Verify the environment variable is prefixed with `NEXT_PUBLIC_`
- Restart the development server after changing environment variables

### robots.txt not working
- Ensure the route `/robots.txt` is accessible
- Check server logs for any errors in the robots.txt.tsx file
- Verify environment variables are available at build time

## SEO Impact

This implementation follows current best practices:
- **Meta robots tags are directives** (always respected by search engines)
- **Compatible with AI Mode** and Google's AI Overviews
- **Covers multiple crawlers** including Googlebot and others
- **Provides redundancy** with both meta tags and robots.txt
