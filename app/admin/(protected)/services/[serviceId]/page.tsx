import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Service } from "@/models";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";
import { PageHeader } from "@/components/admin/PageHeader";

type Props = { params: Promise<{ serviceId: string }> };

export default async function EditServicePage({ params }: Props) {
  const { serviceId } = await params;
  await connectDB();
  const service = await Service.findById(serviceId).lean();
  if (!service) notFound();

  const data = JSON.parse(JSON.stringify(service));

  return (
    <div>
      <PageHeader title={data.title} description={`Editing service /${data.slug}`} />
      <ServiceForm serviceId={serviceId} initial={data} />
    </div>
  );
}
