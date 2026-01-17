'use client'
import { useEffect, useState } from "react";
import { Clock, CheckCircle, AlertCircle, Calendar, TrendingUp, Users, Loader2 } from "lucide-react";
import axios from "axios";
import Link from "next/link";

interface TeacherProfile {
    user: {
        name: string;
        email: string;
    };
    department: string;
    subject: string;
    bio?: string;
}

interface Appointment {
    _id: string;
    student: {
        _id: string;
        name: string;
        email: string;
    };
    teacher: string;
    date: string;
    status: "pending" | "approved" | "cancelled" | "completed";
    message?: string;
    teacherNote?: string;
}

interface Stats {
    pending: number;
    upcoming: number;
    completed: number;
}

export default function TeacherDashboard() {
    const [profile, setProfile] = useState<TeacherProfile | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [stats, setStats] = useState<Stats>({
        pending: 0,
        upcoming: 0,
        completed: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch profile and appointments in parallel
            const [profileRes, appointmentsRes] = await Promise.all([
                axios.get("/api/teachers/profile"),
                axios.get("/api/teachers/appointments"),
            ]);

            setProfile(profileRes.data);
            setAppointments(appointmentsRes.data);

            // Calculate statistics from real data
            const now = new Date();
            const appointmentsData = appointmentsRes.data as Appointment[];

            const calculatedStats = {
                pending: appointmentsData.filter(apt => apt.status === "pending").length,
                upcoming: appointmentsData.filter(apt =>
                    apt.status === "approved" && new Date(apt.date) > now
                ).length,
                completed: appointmentsData.filter(apt => apt.status === "completed").length,
            };

            setStats(calculatedStats);
        } catch (err: unknown) {
            console.error("Failed to fetch dashboard data:", err);
            const errorMessage = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed to load dashboard data";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Get recent appointments (next 3 upcoming or pending)
    const getRecentAppointments = () => {
        const now = new Date();
        return appointments
            .filter(apt => apt.status === "pending" || (apt.status === "approved" && new Date(apt.date) > now))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 3);
    };

    // Format date to readable string
    const formatAppointmentTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const timeStr = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        if (date.toDateString() === now.toDateString()) {
            return `Today, ${timeStr}`;
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return `Tomorrow, ${timeStr}`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
    };

    const statCards = [
        {
            title: "Pending Requests",
            value: stats.pending,
            icon: AlertCircle,
            color: "text-amber-600 dark:text-amber-400",
            bgColor: "bg-amber-50 dark:bg-amber-900/20",
            borderColor: "border-amber-200 dark:border-amber-800",
            trend: stats.pending > 0 ? `${stats.pending} awaiting review` : "All clear",
            trendUp: stats.pending > 0,
        },
        {
            title: "Upcoming Appointments",
            value: stats.upcoming,
            icon: Clock,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
            borderColor: "border-blue-200 dark:border-blue-800",
            trend: stats.upcoming > 0 ? "Scheduled ahead" : "No upcoming",
            trendUp: false,
        },
        {
            title: "Completed",
            value: stats.completed,
            icon: CheckCircle,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-50 dark:bg-green-900/20",
            borderColor: "border-green-200 dark:border-green-800",
            trend: "Total completed",
            trendUp: true,
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
                    <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md">
                    <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">Error Loading Dashboard</h2>
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const recentAppointments = getRecentAppointments();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                            Welcome back, {profile?.user.name || "Teacher"}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {profile?.department && profile?.subject
                                ? `${profile.subject} • ${profile.department}`
                                : "Here's what's happening with your appointments today"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border-2 ${stat.borderColor} transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                            >
                                {/* Gradient overlay */}
                                <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                                <div className="relative p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                            <Icon className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                        {stat.trendUp !== undefined && (
                                            <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendUp ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                {stat.trendUp && <TrendingUp className="w-3 h-3" />}
                                                <span>{stat.trend}</span>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                        {stat.title}
                                    </h3>

                                    <p className={`text-4xl font-bold ${stat.color} transition-transform group-hover:scale-110 inline-block`}>
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Appointments Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    Recent Appointments
                                </h2>
                            </div>
                            <Link href="/teacher/appointments" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                View All
                            </Link>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {recentAppointments.length > 0 ? (
                            recentAppointments.map((appointment) => (
                                <div
                                    key={appointment._id}
                                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                {appointment.student.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {appointment.student.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {appointment.message || "No subject specified"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 sm:flex-shrink-0">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatAppointmentTime(appointment.date)}</span>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${appointment.status === "approved"
                                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                                    : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                                                    }`}
                                            >
                                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <Calendar className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    No upcoming appointments
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    You{"'"}re all caught up! New appointment requests will appear here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/teacher/availability" className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 text-left group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Set Availability</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your office hours</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/teacher/appointments" className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all duration-200 text-left group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Review Requests</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {stats.pending > 0
                                        ? `${stats.pending} pending request${stats.pending > 1 ? 's' : ''}`
                                        : "Approve or decline appointments"}
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}