
import React from "react";
import { Navigate } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/context/AuthContext";

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 login-container">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-aamec-purple mb-10">
          AAMEC Book Bank
        </h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
