'use client'
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Mail, Calendar, MessageSquare, AlertCircle, Loader2, Filter } from "lucide-react";

interface Appointment {
    _id: string;
    student: { name: string; email: string };
    date: string;
    status: string;
    message: string;
    teacherNote?: string;
}

// Axios-style API wrapper
const api = {
    get: async (url: string) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return { data };
    },
    patch: async (url: string, payload: any) => {
        const response = await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return { data };
    },
};

export default function AppointmentManagementPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>("all");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get("/api/teachers/appointments");
            setAppointments(response.data);
        } catch (err) {
            setError("Failed to load appointments. Please try again.");
            console.error("Error fetching appointments:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            setActionLoading(id);
            await api.patch("/api/teachers/appointments", {
                appointmentId: id,
                status,
            });
            await fetchAppointments();
        } catch (err) {
            setError(`Failed to ${status} appointment. Please try again.`);
            console.error("Error updating appointment:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusConfig = (status: string) => {
        const configs: Record<string, any> = {
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

    const filteredAppointments = appointments.filter(apt =>
        filter === "all" ? true : apt.status === filter
    );

    const stats = {
        pending: appointments.filter(a => a.status === "pending").length,
        approved: appointments.filter(a => a.status === "approved").length,
        completed: appointments.filter(a => a.status === "completed").length,
        cancelled: appointments.filter(a => a.status === "cancelled").length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                            Appointment Requests
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Manage and review student appointment requests
                        </p>
                    </div>
                    <button
                        onClick={fetchAppointments}
                        disabled={loading}
                        className="self-start sm:self-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Refresh</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Pending</p>
                                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-1">{stats.pending}</p>
                            </div>
                            <Clock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-700 dark:text-green-300">Approved</p>
                                <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1">{stats.approved}</p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Completed</p>
                                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">{stats.completed}</p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-700 dark:text-red-300">Cancelled</p>
                                <p className="text-3xl font-bold text-red-900 dark:text-red-100 mt-1">{stats.cancelled}</p>
                            </div>
                            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
                    <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2" />
                    {["all", "pending", "approved", "completed", "cancelled"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${filter === status
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            {status !== "all" && (
                                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                    {appointments.filter(a => a.status === status).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
                            <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Appointments List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Loading appointments...</p>
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            No appointments found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {filter === "all"
                                ? "You don't have any appointments yet."
                                : `No ${filter} appointments at the moment.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredAppointments.map((apt) => {
                            const config = getStatusConfig(apt.status);
                            const StatusIcon = config.icon;
                            const isProcessing = actionLoading === apt._id;

                            return (
                                <div
                                    key={apt._id}
                                    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg border-2 ${config.borderColor} transition-all duration-300 overflow-hidden`}
                                >
                                    {/* Card Header */}
                                    <div className={`${config.bgColor} p-6 border-b-2 ${config.borderColor}`}>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                    {apt.student?.name?.charAt(0) || "?"}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                                        {apt.student?.name || "Unknown Student"}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                        <Mail className="w-4 h-4" />
                                                        <span>{apt.student?.email || "No email"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.badgeColor} font-medium text-sm self-start sm:self-auto`}>
                                                <StatusIcon className="w-4 h-4" />
                                                <span className="capitalize">{apt.status}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            <span className="font-medium">
                                                {new Date(apt.date).toLocaleDateString("en-US", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </span>
                                            <span className="text-gray-500">at</span>
                                            <span className="font-medium">
                                                {new Date(apt.date).toLocaleTimeString("en-US", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                                            <div className="flex items-start gap-2">
                                                <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Student Message:
                                                    </p>
                                                    <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                                                        {apt.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer - Actions */}
                                    <div className="px-6 pb-6 flex gap-3 justify-end">
                                        {apt.status === "pending" && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(apt._id, "approved")}
                                                    disabled={isProcessing}
                                                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                                                >
                                                    {isProcessing ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="w-4 h-4" />
                                                    )}
                                                    <span>Approve</span>
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(apt._id, "cancelled")}
                                                    disabled={isProcessing}
                                                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                                                >
                                                    {isProcessing ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4" />
                                                    )}
                                                    <span>Reject</span>
                                                </button>
                                            </>
                                        )}
                                        {apt.status === "approved" && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(apt._id, "completed")}
                                                    disabled={isProcessing}
                                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                                                >
                                                    {isProcessing ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="w-4 h-4" />
                                                    )}
                                                    <span>Mark as Complete</span>
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(apt._id, "cancelled")}
                                                    disabled={isProcessing}
                                                    className="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                                                >
                                                    {isProcessing ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4" />
                                                    )}
                                                    <span>Cancel Appointment</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}