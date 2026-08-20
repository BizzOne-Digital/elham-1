import { connectDB } from "@/lib/db/connect";
import { Testimonial } from "@/models";
import { PageHeader } from "@/components/admin/PageHeader";
import { TestimonialManager } from "@/components/admin/forms/TestimonialManager";

export const metadata = { title: "Testimonials | Admin" };

export default async function AdminTestimonialsPage() {
  await connectDB();
  const items = JSON.parse(JSON.stringify(await Testimonial.find().sort({ sortOrder: 1 }).lean()));

  return (
    <div>
      <PageHeader title="Testimonials" description="Manage client testimonials." />
      <TestimonialManager items={items} />
    </div>
  );
}
