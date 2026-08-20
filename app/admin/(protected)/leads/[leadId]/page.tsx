import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Lead } from "@/models";
import { PageHeader } from "@/components/admin/PageHeader";
import { LeadDetailForm } from "@/components/admin/forms/LeadDetailForm";

type Props = { params: Promise<{ leadId: string }> };

export default async function LeadDetailPage({ params }: Props) {
  const { leadId } = await params;
  await connectDB();
  const lead = await Lead.findById(leadId).lean();
  if (!lead) notFound();
  const data = JSON.parse(JSON.stringify(lead));

  return (
    <div>
      <PageHeader title={data.name} description={`Lead from ${data.email}`} />
      <LeadDetailForm lead={data} />
    </div>
  );
}
