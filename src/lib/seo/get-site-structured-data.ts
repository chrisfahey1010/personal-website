interface StructuredDataNode {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

export const getSiteStructuredData = (site: URL | string): StructuredDataNode[] => {
  const siteUrl = new URL('/', site).toString();
  const contactUrl = new URL('/contact/', site).toString();

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Chris Fahey',
      url: siteUrl,
      description: 'Portfolio site for Chris Fahey, a product-minded software engineer.',
      inLanguage: 'en',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Chris Fahey',
      url: siteUrl,
      jobTitle: 'Product-minded software engineer',
      knowsAbout: ['Product engineering', 'Frontend architecture', 'Content systems', 'Accessible web experiences'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'professional inquiries',
        url: contactUrl,
      },
    },
  ];
};
