
import React, { useState } from "react";
import { useBook } from "@/context/BookContext";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RequestList from "@/components/request/RequestList";

const RequestsPage = () => {
  const { currentUser } = useAuth();
  const { getUserRequests, submitPayment } = useBook();

  if (!currentUser) {
    return null;
  }

  const userRequests = getUserRequests(currentUser.id);

  const handleSubmitPayment = (
    requestId: string,
    transactionId: string,
    paymentTime: string
  ) => {
    submitPayment(requestId, transactionId, paymentTime);
  };

  return (
    <DashboardLayout title="My Requests">
      <div className="flex flex-col gap-6">
        <RequestList
          requests={userRequests}
          onSubmitPayment={handleSubmitPayment}
        />
      </div>
    </DashboardLayout>
  );
};

export default RequestsPage;
