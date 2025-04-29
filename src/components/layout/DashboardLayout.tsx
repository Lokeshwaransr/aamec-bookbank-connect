
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Book, User, LogOut, BookOpen, CheckSquare, List } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Define navigation links based on user role
  const getNavLinks = () => {
    if (currentUser?.role === "student") {
      return [
        { name: "Book List", icon: <Book size={20} />, path: "/dashboard" },
        { name: "My Requests", icon: <BookOpen size={20} />, path: "/requests" },
        { name: "Status", icon: <CheckSquare size={20} />, path: "/status" },
      ];
    } else if (currentUser?.role === "bookbankadmin") {
      return [
        { name: "Book List", icon: <Book size={20} />, path: "/dashboard" },
        { name: "Manage Books", icon: <List size={20} />, path: "/manage-books" },
        { name: "Requests", icon: <BookOpen size={20} />, path: "/admin-requests" },
      ];
    } else if (currentUser?.role === "bookbankclerk") {
      return [
        { name: "Book List", icon: <Book size={20} />, path: "/dashboard" },
        { name: "Payment Verification", icon: <CheckSquare size={20} />, path: "/payments" },
      ];
    } else {
      return [
        { name: "Book List", icon: <Book size={20} />, path: "/dashboard" },
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex md:flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center">
            <Book className="w-6 h-6 text-aamec-purple" />
            <span className="ml-2 font-semibold text-lg text-aamec-dark">AAMEC Book Bank</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
        </div>

        <div className="flex flex-col justify-between flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navLinks.map((link) => (
              <Button
                key={link.path}
                variant="ghost"
                className="w-full justify-start mb-1 hover:bg-gray-100"
                onClick={() => navigate(link.path)}
              >
                {link.icon}
                <span className="ml-3">{link.name}</span>
              </Button>
            ))}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-aamec-purple rounded-full flex items-center justify-center text-white">
                {currentUser?.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{currentUser?.username}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center h-16 px-4 border-b md:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </Button>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
