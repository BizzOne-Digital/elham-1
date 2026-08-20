interface AdminHeaderBarProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: AdminHeaderBarProps) {
  return (
    <div className="mb-6 border-b border-slate-200 pb-4">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}
