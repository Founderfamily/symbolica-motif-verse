
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface OpenGraphMetaProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  siteName?: string;
}

export const OpenGraphMeta: React.FC<OpenGraphMetaProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
  siteName = 'Cultural Heritage Symbols'
}) => {
  const currentUrl = url || window.location.href;
  const defaultImage = '/placeholder.svg';

  return (
    <Helmet>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image || defaultImage} />

      {/* Standard meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
};

export default OpenGraphMeta;
