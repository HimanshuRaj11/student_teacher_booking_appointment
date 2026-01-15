'use client';
import { useState } from 'react';
import { Calendar, Clock, Users, BookOpen, ArrowRight, Star, CheckCircle } from 'lucide-react';

export default function HomePage() {
    const [selectedRole, setSelectedRole] = useState<string>("");

    const features = [
        {
            icon: Calendar,
            title: "Easy Scheduling",
            description: "Book appointments with your teachers in just a few clicks"
        },
        {
            icon: Clock,
            title: "Flexible Timing",
            description: "Choose from available time slots that fit your schedule"
        },
        {
            icon: Users,
            title: "Direct Communication",
            description: "Connect with teachers for academic support and guidance"
        },
        {
            icon: BookOpen,
            title: "Track Progress",
            description: "View your appointment history and upcoming sessions"
        }
    ];

    const stats = [
        { number: "500+", label: "Active Teachers" },
        { number: "10K+", label: "Students Enrolled" },
        { number: "50K+", label: "Appointments Booked" },
        { number: "4.8", label: "Average Rating" }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Student",
            text: "This platform made it so easy to get help from my teachers. I can book sessions whenever I need guidance!",
            rating: 5
        },
        {
            name: "Prof. Michael Chen",
            role: "Teacher",
            text: "Managing student appointments has never been easier. The interface is intuitive and saves me so much time.",
            rating: 5
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="w-8 h-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">EduConnect</span>
                        </div>
                        <div className="hidden md:flex space-x-8">
                            <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
                            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition">How It Works</a>
                            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition">Testimonials</a>
                        </div>
                        <div className="flex space-x-4">
                            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                Sign In
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Connect, Learn, and
                        <span className="text-blue-600"> Grow Together</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                        The easiest way for students to book appointments with teachers. Schedule one-on-one sessions,
                        get academic support, and accelerate your learning journey.
                    </p>

                    {/* Role Selection Cards */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
                        <div
                            onClick={() => setSelectedRole('student')}
                            className={`p-8 bg-white rounded-2xl shadow-lg cursor-pointer transition-all transform hover:scale-105 ${selectedRole === 'student' ? 'ring-4 ring-blue-500' : ''
                                }`}
                        >
                            <Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">I'm a Student</h3>
                            <p className="text-gray-600 mb-4">Book appointments with teachers for guidance and support</p>
                            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2">
                                <span>Get Started</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div
                            onClick={() => setSelectedRole('teacher')}
                            className={`p-8 bg-white rounded-2xl shadow-lg cursor-pointer transition-all transform hover:scale-105 ${selectedRole === 'teacher' ? 'ring-4 ring-purple-500' : ''
                                }`}
                        >
                            <BookOpen className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">I'm a Teacher</h3>
                            <p className="text-gray-600 mb-4">Manage your schedule and connect with students effortlessly</p>
                            <button className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center space-x-2">
                                <span>Get Started</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-blue-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                                <div className="text-blue-100">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose EduConnect?</h2>
                    <p className="text-xl text-gray-600">Everything you need for seamless teacher-student collaboration</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition">
                            <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-xl text-gray-600">Get started in three simple steps</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your Account</h3>
                            <p className="text-gray-600">Sign up as a student or teacher in seconds</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Browse & Select</h3>
                            <p className="text-gray-600">Find teachers or view student requests</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Book & Connect</h3>
                            <p className="text-gray-600">Schedule appointments and start learning</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
                    <p className="text-xl text-gray-600">Trusted by students and teachers worldwide</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="p-8 bg-white rounded-xl shadow-md">
                            <div className="flex mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                            <div>
                                <div className="font-bold text-gray-900">{testimonial.name}</div>
                                <div className="text-gray-600 text-sm">{testimonial.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
                    <p className="text-xl text-blue-100 mb-8">Join thousands of students and teachers already using EduConnect</p>
                    <button className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition text-lg font-semibold">
                        Create Your Free Account
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <BookOpen className="w-6 h-6" />
                                <span className="text-lg font-bold">EduConnect</span>
                            </div>
                            <p className="text-gray-400">Connecting students and teachers for better learning outcomes.</p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Product</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">Features</a></li>
                                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition">Security</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">About</a></li>
                                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 EduConnect. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}