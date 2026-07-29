import { Card, CardContent } from "./Card";
import { Skeleton } from "./Skeleton";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  loading?: boolean;
  trend?: { value: number; label: string };
}

export default function StatsCard({ label, value, icon, loading, trend }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-4 pb-4">
        <div className="w-12 h-12 bg-[var(--secondary)] rounded-xl flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          {loading ? (
            <>
              <Skeleton className="h-7 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-[var(--foreground)]">{value}</div>
              <div className="text-xs text-[var(--muted)] truncate">{label}</div>
              {trend && (
                <div className={`text-xs mt-0.5 font-medium ${trend.value >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
