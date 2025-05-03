
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import StudentSearch from "@/components/admin/StudentSearch";

const DashboardPage = () => {
  const { currentUser } = useAuth();

  let content;

  if (!currentUser) {
    return null;
  }

  if (currentUser.role === "bookbankadmin") {
    content = (
      <>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Student Search</h2>
          <StudentSearch />
        </section>
      </>
    );
  } else if (currentUser.role === "student") {
    content = (
      <section>
        <h2 className="text-2xl font-bold mb-4">Welcome, {currentUser.username}!</h2>
        <p className="mb-4">
          Use the navigation menu to browse available books, view your book
          requests, or check their status.
        </p>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-medium text-blue-800 mb-2">How to use the Book Bank</h3>
          <ol className="list-decimal pl-5 space-y-1 text-blue-700">
            <li>Browse the available books in the "Books" section</li>
            <li>Request books you're interested in</li>
            <li>Wait for admin approval</li>
            <li>Make payment when required</li>
            <li>Check status of your requests</li>
          </ol>
        </div>
      </section>
    );
  } else {
    content = (
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Welcome, {currentUser.username}!
        </h2>
        <p>
          Use the navigation menu to manage books, approve requests, or verify
          payments.
        </p>
      </section>
    );
  }

  return <DashboardLayout title="Dashboard">{content}</DashboardLayout>;
};

export default DashboardPage;
