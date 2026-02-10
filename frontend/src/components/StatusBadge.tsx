import { Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  type: "verified" | "pending" | "rejected" | "low" | "medium" | "high";
  className?: string;
}

const config = {
  verified: { label: "Verified", icon: CheckCircle, className: "bg-success/10 text-success border-success/20" },
  pending: { label: "Pending", icon: AlertTriangle, className: "bg-warning/10 text-warning border-warning/20" },
  rejected: { label: "Rejected", icon: AlertTriangle, className: "bg-destructive/10 text-destructive border-destructive/20" },
  low: { label: "Low Risk", icon: Shield, className: "bg-success/10 text-success border-success/20" },
  medium: { label: "Medium Risk", icon: AlertTriangle, className: "bg-warning/10 text-warning border-warning/20" },
  high: { label: "High Risk", icon: AlertTriangle, className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const StatusBadge = ({ type, className }: StatusBadgeProps) => {
  const { label, icon: Icon, className: badgeClass } = config[type];

  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border", badgeClass, className)}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};

export default StatusBadge;
