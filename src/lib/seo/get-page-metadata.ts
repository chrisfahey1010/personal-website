export interface PageMetadataInput {
  title: string;
  description: string;
  canonicalPath: string;
  openGraphType?: 'website' | 'article';
  imagePath?: string;
  imageAlt?: string;
}

export interface DiscoverabilityInput {
  seoTitle: string;
  seoDescription: string;
  canonicalPath: string;
  openGraphType?: 'website' | 'article';
  imagePath?: string;
  imageAlt?: string;
}

export interface PageMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  openGraphType: 'website' | 'article';
  imagePath: string;
  imageAlt: string;
}

export const DEFAULT_SOCIAL_IMAGE_PATH = '/images/share/site-preview.svg';
export const DEFAULT_SOCIAL_IMAGE_ALT = 'Editorial preview card for Chris Fahey portfolio site';

export const createPageMetadata = ({
  title,
  description,
  canonicalPath,
  openGraphType = 'website',
  imagePath = DEFAULT_SOCIAL_IMAGE_PATH,
  imageAlt = DEFAULT_SOCIAL_IMAGE_ALT,
}: PageMetadataInput): PageMetadata => ({
  title,
  description,
  canonicalPath,
  openGraphType,
  imagePath,
  imageAlt,
});

export const createMetadataFromDiscoverability = ({
  seoTitle,
  seoDescription,
  canonicalPath,
  openGraphType,
  imagePath,
  imageAlt,
}: DiscoverabilityInput): PageMetadata =>
  createPageMetadata({
    title: seoTitle,
    description: seoDescription,
    canonicalPath,
    openGraphType,
    imagePath,
    imageAlt,
  });
