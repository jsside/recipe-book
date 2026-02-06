export interface ImageGalleryProps {
  images: string[];
}

export interface LightboxProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  title?: string;
}

export interface ReferencesSectionProps {
  links: Array<{ url: string; title?: string }>;
  images: Array<{ url: string; title?: string }>;
}
