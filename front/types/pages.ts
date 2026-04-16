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
  program_title?: string;
  program_weeks?: IProgramWeek[];
  reasons_title?: string;
  reasons?: IFeatureCard[];
  guarantee_title?: string;
  guarantees?: IListItem[];
  price_title?: string;
  price_value?: string;
  price_note?: string;
  price_button_text?: string;
}

export interface IMainBenefit {
  id: string;
  text: string;
}

export interface IListItem {
  id?: string;
  icon?: string;
  text: string;
}

export interface IProgramWeek {
  id?: string;
  title: string;
  items?: IListItem[];
}

export interface IFeatureCard {
  id?: string;
  icon?: string;
  title: string;
  subtitle?: string;
}

export interface IStory {
  id: string;
  name: string;
  age?: number | null;
  city?: string | null;
  short_description?: string | null;
  article?: {
    id: string;
    code: string;
    header?: string | null;
  } | null;
}
