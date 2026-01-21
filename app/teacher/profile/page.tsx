"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Mail, Building2, BookOpen, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface TeacherProfile {
    user: {
        name: string;
        email: string;
    };
    department: string;
    subject: string;
    bio?: string;
}

export default function TeacherProfilePage() {
    const [profile, setProfile] = useState<TeacherProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [formData, setFormData] = useState({
        department: "",
        subject: "",
        bio: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (profile) {
            const changed =
                formData.department !== (profile.department || "") ||
                formData.subject !== (profile.subject || "") ||
                formData.bio !== (profile.bio || "");
            setHasChanges(changed);
        }
    }, [formData, profile]);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/teachers/profile");
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setFormData({
                    department: data.department || "",
                    subject: data.subject || "",
                    bio: data.bio || "",
                });
            } else {
                setMessage({ type: 'error', text: 'Failed to load profile. Please try again.' });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Network error. Please check your connection.' });
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.department.trim()) {
            newErrors.department = "Department is required";
        }

        if (!formData.subject.trim()) {
            newErrors.subject = "Subject is required";
        }

        if (formData.bio && formData.bio.length > 500) {
            newErrors.bio = "Bio must be 500 characters or less";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        setMessage(null);

        if (!validateForm()) {
            setMessage({ type: 'error', text: 'Please fix the errors below' });
            return;
        }

        setSaving(true);

        try {
            const res = await fetch("/api/teachers/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                await fetchProfile();
                setHasChanges(false);
            } else {
                const errorData = await res.json();
                setMessage({ type: 'error', text: errorData.message || 'Failed to update profile' });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
        if (message) {
            setMessage(null);
        }
    };

    const handleCancel = () => {
        setFormData({
            department: profile?.department || "",
            subject: profile?.subject || "",
            bio: profile?.bio || "",
        });
        setErrors({});
        setMessage(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-2" />
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800 border-b">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">My Profile</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">Manage your teaching profile information</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    {message && (
                        <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            {message.type === 'success' ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                                <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                                {message.text}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-gray-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Name</p>
                                <p className="text-gray-900 mt-1 dark:text-gray-200 ">{profile?.user?.name || 'Not set'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-gray-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Email</p>
                                <p className="text-gray-900 mt-1 dark:text-gray-200">{profile?.user?.email || 'Not set'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="department" className="flex items-center gap-2 text-base">
                                <Building2 className="h-4 w-4" />
                                Department *
                            </Label>
                            <Input
                                id="department"
                                value={formData.department}
                                onChange={(e) => handleInputChange('department', e.target.value)}
                                placeholder="e.g., Computer Science"
                                className={errors.department ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            />
                            {errors.department && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.department}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject" className="flex items-center gap-2 text-base">
                                <BookOpen className="h-4 w-4" />
                                Subject *
                            </Label>
                            <Input
                                id="subject"
                                value={formData.subject}
                                onChange={(e) => handleInputChange('subject', e.target.value)}
                                placeholder="e.g., Data Structures and Algorithms"
                                className={errors.subject ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            />
                            {errors.subject && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.subject}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio" className="flex items-center gap-2 text-base">
                                <FileText className="h-4 w-4" />
                                Bio
                            </Label>
                            <textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                placeholder="Tell us about yourself, your teaching philosophy, or areas of expertise..."
                                rows={4}
                                maxLength={500}
                                className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${errors.bio ? 'border-red-500 focus-visible:ring-red-500' : ''
                                    }`}
                            />
                            <div className="flex justify-between items-center">
                                {errors.bio && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.bio}
                                    </p>
                                )}
                                <p className={`text-xs ${formData.bio.length > 450 ? 'text-orange-600' : 'text-gray-500'} ml-auto`}>
                                    {formData.bio.length}/500 characters
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t">
                            <Button
                                onClick={handleSubmit}
                                disabled={saving || !hasChanges}
                                className="flex-1 sm:flex-none"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Update Profile
                                    </>
                                )}
                            </Button>
                            {hasChanges && (
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}