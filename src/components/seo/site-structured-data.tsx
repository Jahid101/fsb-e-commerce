const baseUrl = "https://fsb-e-commerce.vercel.app";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "ShopHub",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: "/icon.svg",
      },
      areaServed: "Worldwide",
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: "ShopHub",
      publisher: { "@id": `${baseUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/products?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "OnlineStore",
      "@id": `${baseUrl}/#store`,
      name: "ShopHub",
      url: baseUrl,
      image: "/icon.svg",
      description:
        "Online store with 500+ products across 24 categories including electronics, beauty and fashion.",
      address: { "@type": "PostalAddress", addressCountry: "US" },
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}/products?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export function SiteStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}