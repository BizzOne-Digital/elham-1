import { connectDB } from "@/lib/db/connect";
import { Booking } from "@/models";
import { PageHeader } from "@/components/admin/PageHeader";
import { BookingsManager } from "@/components/admin/forms/BookingsManager";

export const metadata = { title: "Bookings | Admin" };

export default async function AdminBookingsPage() {
  await connectDB();
  const items = JSON.parse(
    JSON.stringify(
      await Booking.find()
        .populate("meetingType", "name durationMinutes")
        .sort({ startUtc: -1 })
        .lean(),
    ),
  );

  return (
    <div>
      <PageHeader title="Bookings" description="Manage customer bookings and appointments." />
      <BookingsManager items={items} />
    </div>
  );
}
