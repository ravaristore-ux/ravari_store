import { Helmet } from 'react-helmet-async';
import { SEO_CONFIG } from '../utils/seoConstants';

export const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogTitle,
  ogDescription,
  schemaMarkup
}) => {
  const siteTitle = 'RAVARI';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const siteUrl = SEO_CONFIG.site.url;
  const canonicalUrl = canonical || siteUrl;
  const defaultImage = 'https://ravari.in/og-image.jpg';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || SEO_CONFIG.site.description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description || SEO_CONFIG.site.description} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || description || SEO_CONFIG.site.description} />
      <meta name="twitter:image" content={ogImage || defaultImage} />

      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#D4AF37" />
      <meta name="author" content={siteTitle} />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="x-ua-compatible" content="IE=edge" />
      <meta name="language" content="English" />

      {/* JSON-LD Schema Markup */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default SEO;
