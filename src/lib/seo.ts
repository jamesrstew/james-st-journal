import type { Article } from "./articles";
import { brand } from "./brand";

export function publicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: brand.name,
    alternateName: brand.shortName,
    url: brand.baseUrl,
    logo: `${brand.baseUrl}/opengraph-image`,
    publishingPrinciples: `${brand.baseUrl}/about`,
    ethicsPolicy: `${brand.baseUrl}/about`,
    parentOrganization: {
      "@type": "Organization",
      name: brand.publisher,
    },
    sameAs: ["https://github.com/jamesrstew/james-st-journal"],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name,
    url: brand.baseUrl,
    publisher: {
      "@type": "Organization",
      name: brand.publisher,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${brand.baseUrl}/archive`,
      },
    },
  };
}

export function articleJsonLd(article: Article) {
  const url = `${brand.baseUrl.replace(/\/$/, "")}${article.href}`;
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: article.headline,
    description: article.dek,
    url,
    datePublished: article.published_at,
    dateModified: article.published_at,
    articleSection: article.category,
    wordCount: article.word_count,
    inLanguage: "en-US",
    author: [
      {
        "@type": "Person",
        name: article.byline,
      },
      {
        "@type": "SoftwareApplication",
        name: article.model ?? "claude-opus-4-6",
        applicationCategory: "AI language model",
      },
    ],
    publisher: {
      "@type": "NewsMediaOrganization",
      name: brand.name,
      url: brand.baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${brand.baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
      },
    },
    image: [`${url}/opengraph-image`],
    isBasedOn: article.sources.map((s) => ({
      "@type": "CreativeWork",
      name: s.title,
      url: s.url,
      publisher: { "@type": "Organization", name: s.source },
    })),
    isAccessibleForFree: true,
  };
}
