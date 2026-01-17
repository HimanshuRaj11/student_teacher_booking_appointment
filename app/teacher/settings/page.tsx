"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Bell, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import axios from "axios";

export default function TeacherSettingsPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Profile settings
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        department: "",
        subject: "",
    });

    // Password change
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Notification settings
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        appointmentReminders: true,
        newBookings: true,
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get("/api/teachers/profile");
            if (res.data.profile) {
                setProfileData({
                    name: res.data.profile.user.name || "",
                    email: res.data.profile.user.email || "",
                    department: res.data.profile.department || "",
                    subject: res.data.profile.subject || "",
                });
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await axios.put("/api/teachers/settings/profile", profileData);
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed to update profile";
            setMessage({ type: "error", text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            setLoading(false);
            return;
        }

        try {
            await axios.put("/api/teachers/settings/password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setMessage({ type: "success", text: "Password changed successfully!" });
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed to change password";
            setMessage({ type: "error", text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationsUpdate = async () => {
        setLoading(true);
        setMessage(null);

        try {
            await axios.put("/api/teachers/settings/notifications", notifications);
            setMessage({ type: "success", text: "Notification preferences updated!" });
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed to update notifications";
            setMessage({ type: "error", text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
            </div>

            {message && (
                <div
                    className={`flex items-center gap-2 p-4 rounded-lg ${message.type === "success"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
                        }`}
                >
                    {message.type === "success" ? (
                        <CheckCircle2 className="h-5 w-5" />
                    ) : (
                        <AlertCircle className="h-5 w-5" />
                    )}
                    <span className="font-medium">{message.text}</span>
                </div>
            )}



            {/* Password Change */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <CardTitle>Change Password</CardTitle>
                    </div>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                        <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                            <Lock className="h-4 w-4 mr-2" />
                            {loading ? "Changing..." : "Change Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <CardTitle>Notifications</CardTitle>
                    </div>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications.emailNotifications}
                            onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                            className="w-5 h-5 accent-emerald-600"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Appointment Reminders</p>
                            <p className="text-sm text-muted-foreground">Get reminded about upcoming appointments</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications.appointmentReminders}
                            onChange={(e) => setNotifications({ ...notifications, appointmentReminders: e.target.checked })}
                            className="w-5 h-5 accent-emerald-600"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">New Booking Alerts</p>
                            <p className="text-sm text-muted-foreground">Get notified when students book appointments</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications.newBookings}
                            onChange={(e) => setNotifications({ ...notifications, newBookings: e.target.checked })}
                            className="w-5 h-5 accent-emerald-600"
                        />
                    </div>
                    <Button onClick={handleNotificationsUpdate} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? "Saving..." : "Save Preferences"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
