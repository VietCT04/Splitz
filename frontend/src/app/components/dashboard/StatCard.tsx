type StatCardProps = {
  title: string;
  value: string;
  variant?: "neutral" | "success" | "danger";
};

const variants = {
  neutral: "text-gray-900",
  success: "text-emerald-600",
  danger: "text-rose-600",
} as const;

export default function StatCard({
  title,
  value,
  variant = "neutral",
}: StatCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-600">{title}</p>
      <p className={`mt-2 text-2xl font-semibold ${variants[variant]}`}>
        {value}
      </p>
    </div>
  );
}
