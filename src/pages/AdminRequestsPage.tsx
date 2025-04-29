
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useBook } from "@/context/BookContext";
import RequestList from "@/components/request/RequestList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminRequestsPage = () => {
  const [tab, setTab] = useState("pending");
  const { requests, approveRequest, rejectRequest } = useBook();

  const pendingRequests = requests.filter(request => request.status === "pending");
  const approvedRequests = requests.filter(request => request.status === "approved");
  const rejectedRequests = requests.filter(request => request.status === "rejected");

  const handleApprove = (requestId: string) => {
    approveRequest(requestId);
  };

  const handleReject = (requestId: string) => {
    rejectRequest(requestId);
  };

  return (
    <DashboardLayout title="Book Requests">
      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <RequestList
            requests={pendingRequests}
            isAdmin={true}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <RequestList
            requests={approvedRequests}
            isAdmin={true}
          />
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <RequestList
            requests={rejectedRequests}
            isAdmin={true}
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminRequestsPage;
