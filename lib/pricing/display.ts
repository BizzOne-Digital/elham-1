/** Client-safe pricing display helpers (no database imports). */

export interface PricingCardHeader {
  label: string;
  tagline: string;
  featured?: boolean;
}

export interface PricingItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  billingPeriod: string;
  features: string[];
  isPopular?: boolean;
  sortOrder: number;
  cta?: { label: string; href: string };
}

export function formatPrice(item: PricingItem): string {
  if (item.billingPeriod === "custom" || item.price === 0) {
    return "Custom quote";
  }
  if (item.billingPeriod === "one_time") {
    const amount = item.price > 0 && item.price <= 100 ? 99.99 : item.price;
    return `From $${amount.toFixed(2)}`;
  }
  const formatted = item.price.toLocaleString("en-US", {
    minimumFractionDigits: item.price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `$${formatted}/${item.billingPeriod.replace("_", " ")}`;
}
