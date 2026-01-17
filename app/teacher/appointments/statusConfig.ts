import { CheckCircle, XCircle, Clock, LucideIcon } from "lucide-react";

export interface StatusConfig {
    color: string;
    bgColor: string;
    borderColor: string;
    badgeColor: string;
    icon: LucideIcon;
}

export const getStatusConfig = (status: string): StatusConfig => {
    const configs: Record<string, StatusConfig> = {
        pending: {
            color: "text-amber-700 dark:text-amber-300",
            bgColor: "bg-amber-50 dark:bg-amber-900/20",
            borderColor: "border-amber-200 dark:border-amber-700",
            badgeColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
            icon: Clock,
        },
        approved: {
            color: "text-green-700 dark:text-green-300",
            bgColor: "bg-green-50 dark:bg-green-900/20",
            borderColor: "border-green-200 dark:border-green-700",
            badgeColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
            icon: CheckCircle,
        },
        completed: {
            color: "text-blue-700 dark:text-blue-300",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            borderColor: "border-blue-200 dark:border-blue-700",
            badgeColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
            icon: CheckCircle,
        },
        cancelled: {
            color: "text-red-700 dark:text-red-300",
            bgColor: "bg-red-50 dark:bg-red-900/20",
            borderColor: "border-red-200 dark:border-red-700",
            badgeColor: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
            icon: XCircle,
        },
    };
    return configs[status] || configs.pending;
};
