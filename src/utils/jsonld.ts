export interface JsonLdBreadcrumbItem {
  label: string;
  href?: string;
}

export interface PersonLikeRecord {
  name: string;
  url?: string;
  sameAs?: string[];
  type?: 'Person' | 'Organization';
}

export type PersonLike = string | PersonLikeRecord;

export interface JsonLdEntryData {
  title: string;
  description: string;
  publishedAt?: string;
  updatedAt?: string;
  category?: string;
  area?: string;
  keyword?: string;
  keywords?: string[];
  services?: string[];
  author?: PersonLike;
  authors?: PersonLike[];
  supervisor?: PersonLike;
  reviewedBy?: PersonLike;
  expert?: PersonLike;
}

export interface JsonLdEntry {
  id: string;
  collection?: string;
  body?: string;
  data: JsonLdEntryData;
}

export interface SiteConfig {
  siteUrl: string;
  siteName: string;
  publisherName: string;
  publisherLogoUrl: string;
  defaultAuthorName: string;
  authorPagePath?: string;
  locale?: string;
  defaultServiceType?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

type SchemaRecord = Record<string, unknown>;

const FAQ_HEADING_PATTERN = /^(よくある質問(?:[（(]faq[)）])?|faq|よくある疑問)$/i;

function stripMarkdown(text: string): string {
  return text
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`{1,3}([^`]+)`{1,3}/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/<[^>]+>/g, ' ');
}

function cleanText(text: string): string {
  return stripMarkdown(text)
    .replace(/\s+/g, ' ')
    .replace(/[ \t]+([。、！？])/g, '$1')
    .trim();
}

function normalizeQuestion(question: string): string {
  const stripped = cleanText(question.replace(/^Q(?:\d+)?[.．:：]?\s*/i, ''));
  return stripped || cleanText(question);
}

function normalizeAnswer(answer: string): string {
  const stripped = cleanText(answer.replace(/^A(?:\d+)?[.．:：]?\s*/i, ''));
  return stripped || cleanText(answer);
}

function extractFaqQuestion(line: string): string | null {
  if (/^#{3,6}\s+/.test(line)) {
    return line.replace(/^#{3,6}\s+/, '');
  }

  const normalizedLine = line.replace(/^[-*]\s+/, '').trim();
  const boldMatch = normalizedLine.match(/^\*\*(.+?)\*\*$/);
  const candidate = boldMatch ? boldMatch[1] : normalizedLine;

  if (/^Q(?:\d+)?[.．:：]?\s*\S+/i.test(candidate)) {
    return candidate;
  }

  return null;
}

function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined || value === '') {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>).length === 0;
  }

  return false;
}

function pruneEmpty<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => pruneEmpty(item))
      .filter((item) => !isEmptyValue(item)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .map(([key, nestedValue]) => [key, pruneEmpty(nestedValue)])
        .filter(([, nestedValue]) => !isEmptyValue(nestedValue)),
    ) as T;
  }

  return value;
}

function uniqueKeywords(entry: JsonLdEntry): string[] {
  const rawKeywords = [
    ...(entry.data.keywords ?? []),
    entry.data.keyword ?? '',
  ]
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return Array.from(new Set(rawKeywords));
}

function inferServiceType(entry: JsonLdEntry, siteConfig: SiteConfig): string {
  const haystack = [
    entry.data.title,
    entry.data.description,
    entry.data.keyword ?? '',
    ...(entry.data.keywords ?? []),
    ...(entry.data.services ?? []),
  ].join(' ');

  const defaultServiceType = siteConfig.defaultServiceType ?? '墓石・お墓';
  const servicePatterns: Array<[string, RegExp]> = [
    ['永代供養', /永代供養/],
    ['納骨堂', /納骨堂/],
    ['樹木葬', /樹木葬/],
    ['墓じまい', /墓じまい|改葬/],
    ['散骨', /散骨|海洋散骨/],
    ['霊園', /霊園|墓地/],
    [defaultServiceType, /墓石|お墓/],
  ];

  for (const [serviceType, pattern] of servicePatterns) {
    if (pattern.test(haystack)) {
      return serviceType;
    }
  }

  return defaultServiceType;
}

function inferAreaName(entry: JsonLdEntry): string | undefined {
  if (entry.data.area) {
    return entry.data.area;
  }

  const candidates = [entry.data.title, entry.data.keyword ?? ''];

  for (const candidate of candidates) {
    const match = candidate.match(/([^\s【】|]+?(?:都|道|府|県|市|区|町|村))/);
    if (match) {
      return match[1];
    }
  }

  return undefined;
}

function inferPersonType(name: string): 'Person' | 'Organization' {
  return /(編集部|事務局|チーム|委員会|協会|法人|クリニック|会社)/.test(name)
    ? 'Organization'
    : 'Person';
}

function normalizePersonLike(person: PersonLike): SchemaRecord {
  if (typeof person === 'string') {
    return {
      '@type': inferPersonType(person),
      name: person,
    };
  }

  return pruneEmpty({
    '@type': person.type ?? inferPersonType(person.name),
    name: person.name,
    url: person.url,
    sameAs: person.sameAs,
  });
}

function buildAuthorSchema(entry: JsonLdEntry, siteConfig: SiteConfig): SchemaRecord | SchemaRecord[] {
  const explicitAuthors = (entry.data.authors ?? []).map((person) => normalizePersonLike(person));

  if (explicitAuthors.length > 1) {
    return explicitAuthors;
  }

  if (explicitAuthors.length === 1) {
    return explicitAuthors[0];
  }

  const primaryAuthor = entry.data.author ?? entry.data.supervisor ?? entry.data.reviewedBy ?? entry.data.expert;
  if (primaryAuthor) {
    return normalizePersonLike(primaryAuthor);
  }

  return {
    '@type': 'Organization',
    name: siteConfig.defaultAuthorName,
    url: new URL(siteConfig.authorPagePath ?? '/', siteConfig.siteUrl).href,
  };
}

export function extractFaqItemsFromMarkdown(markdown?: string): FaqItem[] {
  if (!markdown) {
    return [];
  }

  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const items: FaqItem[] = [];
  let inFaqSection = false;
  let currentQuestion = '';
  let answerLines: string[] = [];

  const flushCurrentItem = () => {
    const question = normalizeQuestion(currentQuestion);
    const answer = normalizeAnswer(answerLines.join(' ')).slice(0, 500);

    if (question && answer) {
      items.push({ question, answer });
    }

    currentQuestion = '';
    answerLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (/^##\s+/.test(line)) {
      if (inFaqSection) {
        flushCurrentItem();
      }

      const heading = cleanText(line.replace(/^##\s+/, ''));
      inFaqSection = FAQ_HEADING_PATTERN.test(heading);
      continue;
    }

    if (!inFaqSection) {
      continue;
    }

    const question = extractFaqQuestion(line);
    if (question) {
      flushCurrentItem();
      currentQuestion = question;
      continue;
    }

    if (!currentQuestion || line === '' || /^```/.test(line)) {
      continue;
    }

    if (/^<!--/.test(line) || /^</.test(line) || /^---+$/.test(line)) {
      continue;
    }

    answerLines.push(line);
  }

  if (inFaqSection) {
    flushCurrentItem();
  }

  return items;
}

export function buildArticleSchema(
  entry: JsonLdEntry,
  canonicalUrl: string,
  siteConfig: SiteConfig,
  ogImageUrl?: string,
): SchemaRecord {
  const keywords = uniqueKeywords(entry);

  return pruneEmpty({
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: entry.data.title,
    description: entry.data.description,
    datePublished: entry.data.publishedAt,
    dateModified: entry.data.updatedAt ?? entry.data.publishedAt,
    author: buildAuthorSchema(entry, siteConfig),
    publisher: {
      '@type': 'Organization',
      name: siteConfig.publisherName,
      logo: {
        '@type': 'ImageObject',
        url: siteConfig.publisherLogoUrl,
      },
    },
    image: ogImageUrl,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    articleSection: entry.data.category,
    inLanguage: siteConfig.locale ?? 'ja-JP',
    url: canonicalUrl,
  });
}

export function buildFAQSchema(faqItems: FaqItem[]): SchemaRecord | null {
  if (faqItems.length === 0) {
    return null;
  }

  return {
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(
  breadcrumbs: JsonLdBreadcrumbItem[] | undefined,
  canonicalUrl: string,
  siteConfig: SiteConfig,
  currentTitle?: string,
): SchemaRecord | null {
  const items: JsonLdBreadcrumbItem[] = [{ label: 'トップ', href: '/' }];

  if (breadcrumbs && breadcrumbs.length > 0) {
    const normalizedBreadcrumbs = [...breadcrumbs];
    const lastBreadcrumb = normalizedBreadcrumbs[normalizedBreadcrumbs.length - 1];

    if (lastBreadcrumb && !lastBreadcrumb.href && currentTitle) {
      normalizedBreadcrumbs[normalizedBreadcrumbs.length - 1] = {
        label: currentTitle,
      };
    }

    items.push(...normalizedBreadcrumbs);
  }

  if (items.length < 2) {
    return null;
  }

  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? new URL(item.href, siteConfig.siteUrl).href : canonicalUrl,
    })),
  };
}

export function buildLocalBusinessSchema(
  entry: JsonLdEntry,
  canonicalUrl: string,
  siteConfig: SiteConfig,
  ogImageUrl?: string,
): SchemaRecord | null {
  const isAreaArticle = entry.data.category === 'area' || Boolean(entry.data.area);
  if (!isAreaArticle) {
    return null;
  }

  const areaName = inferAreaName(entry);
  const serviceType = inferServiceType(entry, siteConfig);

  return pruneEmpty({
    '@type': 'LocalBusiness',
    name: areaName ? `${areaName}の${serviceType}情報` : siteConfig.siteName,
    description: entry.data.description,
    areaServed: areaName
      ? {
          '@type': 'AdministrativeArea',
          name: areaName,
        }
      : undefined,
    url: canonicalUrl,
    image: ogImageUrl,
    serviceType,
    knowsAbout: [serviceType, entry.data.area, entry.data.keyword, ...(entry.data.keywords ?? [])],
    inLanguage: siteConfig.locale ?? 'ja-JP',
  });
}

export function combineSchemas(
  schemas: Array<SchemaRecord | null | undefined>,
): SchemaRecord | null {
  const graph = schemas.filter(Boolean);

  if (graph.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
