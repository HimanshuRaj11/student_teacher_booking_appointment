import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-blue-50 to-transparent dark:from-gray-900">
      <div className="text-center space-y-6 max-w-2xl px-6">
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-gray-900 dark:text-gray-100">
          Book Appointments with <span className="text-blue-600">Ease</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Connect with teachers, schedule discussions, and manage your academic appointments in one place.
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" variant="default" className="text-lg px-8">Login</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="text-lg px-8">Student Sign Up</Button>
          </Link>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-5xl">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
          <h3 className="font-bold text-xl mb-2">For Students</h3>
          <p className="text-gray-600 dark:text-gray-400">Search for teachers by department, view availability, and book slots instantly.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
          <h3 className="font-bold text-xl mb-2">For Teachers</h3>
          <p className="text-gray-600 dark:text-gray-400">Manage your office hours, approve requests, and keep track of student meetings.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
          <h3 className="font-bold text-xl mb-2">Admin Control</h3>
          <p className="text-gray-600 dark:text-gray-400">Oversee the entire system, manage users, and view detailed logs.</p>
        </div>
      </div>
    </div>
  );
}
