"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
    const [formData, setFormData] = useState({
        department: "",
        subject: "",
        bio: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

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
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/teachers/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                alert("Profile updated!");
                fetchProfile();
            }
        } catch (error) {
            alert("Failed to update");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>My Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <p className="font-bold">Name:</p>
                            <p>{profile?.user?.name}</p>
                        </div>
                        <div>
                            <p className="font-bold">Email:</p>
                            <p>{profile?.user?.email}</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Input
                                id="department"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Input
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            />
                        </div>

                        <Button type="submit">Update Profile</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
