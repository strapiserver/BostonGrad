import { IImage } from "./selector";

export interface IArticle {
  code: string;
  id: string;
  time_to_read?: number;
  updatedAt?: string;
  header: string;
  subheader: string;
  seo_title: string;
  seo_description: string;
  stats: { [key: string]: number };
  chapters: {
    title: string;
    text: string;
  }[];

  preview?: IImage;
  wallpaper?: IImage;
  text?: string;
}

export interface ILink {
  id: string;
  text: string;
  href: string;
  isExternal: boolean;
  isBlank: boolean;
}

export interface IDisclaimer {
  id: string;
  title: string;
  text: string;
  color: "green" | "yellow" | "red";
}

export interface IMainText {
  id: string;
  title?: string;
  description?: string;
  image?: IImage;
  link: ILink;
}

export interface ICard {
  id: string;
  header?: string;
  subheader?: string;
  slug: string;
  image?: IImage;
}

export interface IMainSingle {
  id: string;
  title?: string;
  subtitle?: string;
  seo_title?: string;
  seo_subtitle?: string;
  image?: IImage;
  benefit?: IMainBenefit[];
}

export interface IMainBenefit {
  id: string;
  text: string;
}
