
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useBook } from "@/context/BookContext";
import RequestList from "@/components/request/RequestList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PaymentsPage = () => {
  const [tab, setTab] = useState("pending");
  const { requests, approvePayment, rejectPayment } = useBook();

  // Filter requests that have payment details and are pending payment verification
  const pendingPayments = requests.filter(
    (request) => 
      request.status === "approved" && 
      request.paymentStatus === "pending" &&
      request.paymentDetails
  );

  const approvedPayments = requests.filter(
    (request) => request.paymentStatus === "approved"
  );

  const rejectedPayments = requests.filter(
    (request) => request.paymentStatus === "rejected"
  );

  const handleApprovePayment = (requestId: string) => {
    approvePayment(requestId);
  };

  const handleRejectPayment = (requestId: string) => {
    rejectPayment(requestId);
  };

  return (
    <DashboardLayout title="Payment Verification">
      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingPayments.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedPayments.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedPayments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <RequestList
            requests={pendingPayments}
            isClerk={true}
            onApprovePayment={handleApprovePayment}
            onRejectPayment={handleRejectPayment}
          />
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <RequestList
            requests={approvedPayments}
            isClerk={true}
          />
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <RequestList
            requests={rejectedPayments}
            isClerk={true}
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default PaymentsPage;
