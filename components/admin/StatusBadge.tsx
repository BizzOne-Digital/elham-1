import type { PublishStatus } from "@/models/shared";

const statusStyles: Record<
  PublishStatus | "pending" | "confirmed" | "cancelled" | "completed" | "no_show" | "new" | "contacted" | "qualified" | "proposal" | "won" | "lost" | "archived",
  string
> = {
  draft: "bg-slate-100 text-slate-700",
  published: "bg-emerald-100 text-emerald-800",
  archived: "bg-amber-100 text-amber-800",
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-emerald-100 text-emerald-800",
  no_show: "bg-orange-100 text-orange-800",
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-indigo-100 text-indigo-800",
  qualified: "bg-purple-100 text-purple-800",
  proposal: "bg-violet-100 text-violet-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-red-100 text-red-800",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const style = statusStyles[status as keyof typeof statusStyles] ?? "bg-slate-100 text-slate-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style} ${className}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
