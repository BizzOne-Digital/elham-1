import { NextRequest } from "next/server";
import { Service } from "@/models";
import { serviceSchema, serviceDetailSchema } from "@/lib/admin/schemas";
import {
  requireAdminSession,
  jsonOk,
  jsonError,
  serialize,
} from "@/lib/admin/api-helpers";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/lib/constants";

type RouteParams = { params: Promise<{ serviceId: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { serviceId } = await params;
  const service = await Service.findById(serviceId).lean();
  if (!service) return jsonError("Service not found", 404);

  return jsonOk(serialize(service));
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { serviceId } = await params;
  const body = await request.json();

  const overviewParsed = serviceSchema.partial().safeParse(body);
  const detailParsed = serviceDetailSchema.partial().safeParse(body);

  if (!overviewParsed.success && !detailParsed.success) {
    return jsonError("Invalid data");
  }

  const service = await Service.findById(serviceId);
  if (!service) return jsonError("Service not found", 404);

  if (overviewParsed.success && overviewParsed.data) {
    if (overviewParsed.data.slug && overviewParsed.data.slug !== service.slug) {
      const existing = await Service.findOne({ slug: overviewParsed.data.slug });
      if (existing) return jsonError("Slug already in use", 409);
    }
    Object.assign(service, overviewParsed.data);
  }

  if (detailParsed.success && detailParsed.data?.detailPage) {
    service.detailPage = {
      ...service.detailPage,
      ...detailParsed.data.detailPage,
    };
  }

  await service.save();

  if (service.status === "published") {
    revalidatePath(ROUTES.services);
    revalidatePath(`${ROUTES.services}/${service.slug}`);
  }

  return jsonOk(serialize(service.toObject()));
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { serviceId } = await params;
  const service = await Service.findByIdAndDelete(serviceId);
  if (!service) return jsonError("Service not found", 404);

  revalidatePath(ROUTES.services);
  return jsonOk({ deleted: true });
}
