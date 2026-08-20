import { Schema, type Types } from "mongoose";

export type PublishStatus = "draft" | "published" | "archived";
export type AdminRole = "super_admin" | "editor";
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost"
  | "archived";
export type LeadPriority = "low" | "medium" | "high" | "urgent";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export interface MediaReference {
  assetId?: Types.ObjectId;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface Button {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  openInNewTab?: boolean;
}

export interface SEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: MediaReference;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  openInNewTab?: boolean;
  children?: NavItem[];
}

export interface SocialLink {
  platform:
    | "facebook"
    | "instagram"
    | "twitter"
    | "linkedin"
    | "youtube"
    | "tiktok"
    | "pinterest"
    | "other";
  url: string;
  label?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  mapEmbedUrl?: string;
}

export interface Section {
  id: string;
  type: string;
  label?: string;
  order: number;
  enabled: boolean;
  data: Record<string, unknown>;
}

export const mediaReferenceSchema = new Schema<MediaReference>(
  {
    assetId: { type: Schema.Types.ObjectId, ref: "MediaAsset" },
    url: { type: String, required: true, trim: true },
    alt: { type: String, trim: true },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
  },
  { _id: false },
);

export const buttonSchema = new Schema<Button>(
  {
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    variant: {
      type: String,
      enum: ["primary", "secondary", "outline", "ghost", "link"],
      default: "primary",
    },
    openInNewTab: { type: Boolean, default: false },
  },
  { _id: false },
);

export const seoSchema = new Schema<SEO>(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    keywords: [{ type: String, trim: true }],
    ogImage: { type: mediaReferenceSchema },
    canonicalUrl: { type: String, trim: true },
    noIndex: { type: Boolean, default: false },
  },
  { _id: false },
);

export const navItemSchema = new Schema<NavItem>(
  {
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    openInNewTab: { type: Boolean, default: false },
  },
  { _id: false },
);

navItemSchema.add({
  children: [navItemSchema],
});

export const socialLinkSchema = new Schema<SocialLink>(
  {
    platform: {
      type: String,
      enum: [
        "facebook",
        "instagram",
        "twitter",
        "linkedin",
        "youtube",
        "tiktok",
        "pinterest",
        "other",
      ],
      required: true,
    },
    url: { type: String, required: true, trim: true },
    label: { type: String, trim: true },
  },
  { _id: false },
);

export const contactInfoSchema = new Schema<ContactInfo>(
  {
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    addressLine1: { type: String, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, trim: true },
    region: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true },
    mapEmbedUrl: { type: String, trim: true },
  },
  { _id: false },
);

export const sectionSchema = new Schema<Section>(
  {
    id: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    label: { type: String, trim: true },
    order: { type: Number, required: true, default: 0 },
    enabled: { type: Boolean, default: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false },
);

export const publishStatusEnum = ["draft", "published", "archived"] as const;
