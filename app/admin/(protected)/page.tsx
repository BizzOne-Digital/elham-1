import { connectDB } from "@/lib/db/connect";
import {
  Page,
  Service,
  BlogPost,
  Lead,
  Booking,
  GalleryProject,
  Testimonial,
  FAQ,
} from "@/models";
import { PageHeader } from "@/components/admin/PageHeader";
import { BRAND } from "@/lib/constants";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  BookOpen,
  Users,
  Calendar,
  Images,
} from "lucide-react";

export const metadata = {
  title: `Dashboard | ${BRAND.name} Admin`,
};

async function getStats() {
  await connectDB();

  const [
    pages,
    publishedPages,
    services,
    blogPosts,
    newLeads,
    upcomingBookings,
    galleryProjects,
    testimonials,
    faqs,
  ] = await Promise.all([
    Page.countDocuments(),
    Page.countDocuments({ status: "published" }),
    Service.countDocuments({ status: "published" }),
    BlogPost.countDocuments({ status: "published" }),
    Lead.countDocuments({ status: "new" }),
    Booking.countDocuments({
      status: { $in: ["pending", "confirmed"] },
      startUtc: { $gte: new Date() },
    }),
    GalleryProject.countDocuments({ status: "published" }),
    Testimonial.countDocuments({ status: "published" }),
    FAQ.countDocuments({ status: "published" }),
  ]);

  const recentLeads = await Lead.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return {
    pages,
    publishedPages,
    services,
    blogPosts,
    newLeads,
    upcomingBookings,
    galleryProjects,
    testimonials,
    faqs,
    recentLeads: JSON.parse(JSON.stringify(recentLeads)),
  };
}

const statCards = [
  { key: "newLeads", label: "New Leads", href: "/admin/leads", icon: Users, color: "text-blue-600 bg-blue-50" },
  { key: "upcomingBookings", label: "Upcoming Bookings", href: "/admin/bookings", icon: Calendar, color: "text-purple-600 bg-purple-50" },
  { key: "publishedPages", label: "Published Pages", href: "/admin/pages", icon: FileText, color: "text-emerald-600 bg-emerald-50" },
  { key: "services", label: "Services", href: "/admin/services", icon: Briefcase, color: "text-amber-600 bg-amber-50" },
  { key: "blogPosts", label: "Blog Posts", href: "/admin/blog", icon: BookOpen, color: "text-indigo-600 bg-indigo-50" },
  { key: "galleryProjects", label: "Gallery Projects", href: "/admin/gallery", icon: Images, color: "text-pink-600 bg-pink-50" },
] as const;

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Welcome to the ${BRAND.name} admin portal.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ key, label, href, icon: Icon, color }) => (
          <Link
            key={key}
            href={href}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats[key as keyof typeof stats] as number}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Content Overview</h2>
          <dl className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <dt className="text-slate-500">Total pages</dt>
              <dd className="font-medium">{stats.pages}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-slate-500">Testimonials</dt>
              <dd className="font-medium">{stats.testimonials}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-slate-500">FAQs</dt>
              <dd className="font-medium">{stats.faqs}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Leads</h2>
            <Link href="/admin/leads" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          {stats.recentLeads.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No leads yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {stats.recentLeads.map((lead: { _id: string; name: string; email: string; status: string; createdAt: string }) => (
                <li key={lead._id} className="py-3">
                  <Link href={`/admin/leads/${lead._id}`} className="block hover:text-blue-600">
                    <p className="text-sm font-medium">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.email} · {lead.status}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
