import Link from "next/link";
import { Calendar, Users, Shield, Clock, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[85vh] text-center py-12 sm:py-16">
          <div className="space-y-6 sm:space-y-8 max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>Appointment Scheduling Made Simple</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              Book Appointments with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Ease
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
              Connect with teachers, schedule discussions, and manage your academic appointments in one centralized platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-200 group">
                  Login
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-200">
                  Student Sign Up
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 max-w-2xl mx-auto">
              <div className="text-center group cursor-default">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:scale-110 transition-transform">500+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Teachers</div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:scale-110 transition-transform">10K+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Students</div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:scale-110 transition-transform">50K+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Appointments</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="pb-16 sm:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {/* Student Card */}
            <div className="group bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-xl sm:text-2xl mb-3 text-gray-900 dark:text-gray-100">For Students</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Search for teachers by department, view real-time availability, and book slots instantly with just a few clicks.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Browse teacher profiles</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Instant booking confirmation</span>
                </li>
              </ul>
            </div>

            {/* Teacher Card */}
            <div className="group bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-bold text-xl sm:text-2xl mb-3 text-gray-900 dark:text-gray-100">For Teachers</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Manage your office hours, approve or decline requests, and keep track of all student meetings efficiently.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Flexible schedule management</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Automated reminders</span>
                </li>
              </ul>
            </div>

            {/* Admin Card */}
            <div className="group bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-2 md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold text-xl sm:text-2xl mb-3 text-gray-900 dark:text-gray-100">Admin Control</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Oversee the entire system, manage user accounts, monitor activity, and access detailed analytics and logs.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Comprehensive dashboard</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Advanced reporting tools</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}