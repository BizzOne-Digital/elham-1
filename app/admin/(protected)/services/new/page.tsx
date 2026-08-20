import { ServiceForm } from "@/components/admin/forms/ServiceForm";
import { PageHeader } from "@/components/admin/PageHeader";

export const metadata = { title: "New Service | Admin" };

export default function NewServicePage() {
  return (
    <div>
      <PageHeader title="New Service" description="Create a new service." />
      <ServiceForm />
    </div>
  );
}
