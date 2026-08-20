import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";
import {
  buttonSchema,
  contactInfoSchema,
  navItemSchema,
  seoSchema,
  socialLinkSchema,
} from "./shared";

const brandSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true },
    logo: { type: String, trim: true },
    logoAlt: { type: String, trim: true },
    favicon: { type: String, trim: true },
    primaryColor: { type: String, trim: true },
    secondaryColor: { type: String, trim: true },
  },
  { _id: false },
);

const footerColumnSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    links: [{ type: navItemSchema }],
  },
  { _id: false },
);

const footerSchema = new Schema(
  {
    copyrightText: { type: String, trim: true },
    tagline: { type: String, trim: true },
    columns: [footerColumnSchema],
    legalLinks: [{ type: navItemSchema }],
    showSocialLinks: { type: Boolean, default: true },
  },
  { _id: false },
);

const bookingPolicySchema = new Schema(
  {
    minNoticeHours: { type: Number, default: 24, min: 0 },
    maxAdvanceDays: { type: Number, default: 60, min: 1 },
    cancellationHours: { type: Number, default: 24, min: 0 },
    rescheduleHours: { type: Number, default: 12, min: 0 },
    confirmationMessage: { type: String, trim: true },
    cancellationPolicy: { type: String, trim: true },
    requirePhone: { type: Boolean, default: false },
    autoConfirm: { type: Boolean, default: false },
  },
  { _id: false },
);

const featureFlagsSchema = new Schema(
  {
    enableBlog: { type: Boolean, default: true },
    enableGallery: { type: Boolean, default: true },
    enableBooking: { type: Boolean, default: true },
    enableTestimonials: { type: Boolean, default: true },
    enableFAQ: { type: Boolean, default: true },
    enableLeadCapture: { type: Boolean, default: true },
    enablePricing: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
  },
  { _id: false },
);

const legalSchema = new Schema(
  {
    privacyPolicyUrl: { type: String, trim: true },
    termsOfServiceUrl: { type: String, trim: true },
    cookiePolicyUrl: { type: String, trim: true },
    privacyPolicyContent: { type: String },
    termsOfServiceContent: { type: String },
    cookiePolicyContent: { type: String },
  },
  { _id: false },
);

const siteSettingsSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "global",
      immutable: true,
    },
    brand: { type: brandSchema, required: true },
    contact: { type: contactInfoSchema, default: () => ({}) },
    social: { type: [socialLinkSchema], default: [] },
    nav: {
      main: { type: [navItemSchema], default: [] },
      footer: { type: [navItemSchema], default: [] },
      cta: { type: buttonSchema },
    },
    footer: { type: footerSchema, default: () => ({}) },
    seo: { type: seoSchema, default: () => ({}) },
    currency: { type: String, default: "CAD", trim: true, uppercase: true },
    timezone: { type: String, default: "America/Toronto", trim: true },
    bookingPolicy: { type: bookingPolicySchema, default: () => ({}) },
    featureFlags: { type: featureFlagsSchema, default: () => ({}) },
    legal: { type: legalSchema, default: () => ({}) },
  },
  { timestamps: true },
);

export type ISiteSettings = InferSchemaType<typeof siteSettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type SiteSettingsDocument = HydratedDocument<ISiteSettings>;

export const SiteSettings =
  models.SiteSettings ??
  model<ISiteSettings>("SiteSettings", siteSettingsSchema);

export { siteSettingsSchema };
