import { Badge } from "@/components/ui/badge";

export const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  accepted: {
    label: "Accepted",
    className: "bg-blue-100 text-blue-800 border-blue-300",
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-800 border-green-300",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border-red-300",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-200 text-gray-800 border-gray-400",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config =
    statusConfig[status?.toLowerCase()] || {
      label: status || "Unknown",
      className: "bg-gray-100 text-gray-700 border-gray-300",
    };

  return (
    <Badge
      variant="outline"
      className={`font-medium capitalize ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}