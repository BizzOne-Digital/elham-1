import { NextRequest } from "next/server";
import { SiteSettings } from "@/models";
import {
  requireAdminSession,
  jsonOk,
  jsonError,
  serialize,
} from "@/lib/admin/api-helpers";
import { revalidateCmsTag, CACHE_TAGS } from "@/lib/cms/revalidate";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/lib/constants";

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne({ key: "global" });
  if (!settings) {
    settings = await SiteSettings.create({
      key: "global",
      brand: { name: "Netbrandit" },
    });
  }
  return settings;
}

export async function GET() {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const settings = await getOrCreateSettings();
  return jsonOk(serialize(settings.toObject()));
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const body = await request.json();
  const { section, data } = body as { section?: string; data?: Record<string, unknown> };

  if (!section || !data) {
    return jsonError("Section and data are required");
  }

  const settings = await getOrCreateSettings();

  switch (section) {
    case "brand":
      settings.brand = data as typeof settings.brand;
      break;
    case "contact":
      settings.contact = data as typeof settings.contact;
      break;
    case "social":
      settings.social = data as typeof settings.social;
      break;
    case "nav":
      settings.nav = data as typeof settings.nav;
      break;
    case "footer":
      settings.footer = data as typeof settings.footer;
      break;
    case "seo":
      settings.seo = data as typeof settings.seo;
      break;
    case "currency":
      settings.currency = data.currency as string;
      break;
    case "timezone":
      settings.timezone = data.timezone as string;
      break;
    case "bookingPolicy":
      settings.bookingPolicy = data as typeof settings.bookingPolicy;
      break;
    case "featureFlags":
      settings.featureFlags = data as typeof settings.featureFlags;
      break;
    case "legal":
      settings.legal = data as typeof settings.legal;
      break;
    default:
      return jsonError("Invalid section");
  }

  settings.markModified(section);
  await settings.save();

  revalidateCmsTag(CACHE_TAGS.settings);
  revalidatePath(ROUTES.home);

  return jsonOk(serialize(settings.toObject()));
}
