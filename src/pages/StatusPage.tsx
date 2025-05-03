
import React, { useState } from "react";
import { useBook } from "@/context/BookContext";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Clock, FileText } from "lucide-react";
import PaymentReceipt from "@/components/request/PaymentReceipt";

const StatusPage = () => {
  const { currentUser } = useAuth();
  const { getUserRequests, getBook, getRequestById } = useBook();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  if (!currentUser) {
    return null;
  }

  const userRequests = getUserRequests(currentUser.id);
  const selectedRequest = selectedRequestId ? getRequestById(selectedRequestId) : null;

  const getStatusMessage = (request: any) => {
    if (request.status === "rejected") {
      return "Your request has been rejected.";
    } else if (request.status === "pending") {
      return "Your request is pending approval.";
    } else if (request.status === "approved") {
      if (request.paymentStatus === "pending" && !request.paymentDetails) {
        return "Your request has been approved. Please make payment to proceed.";
      } else if (request.paymentStatus === "pending" && request.paymentDetails) {
        return "Your payment is being verified.";
      } else if (request.paymentStatus === "rejected") {
        return "Your payment was rejected. Please enter correct transaction details.";
      } else if (request.paymentStatus === "approved") {
        return "Visit Book Bank within two days to collect your book.";
      }
    }
    return "Status unknown.";
  };

  const getStatusIcon = (request: any) => {
    if (request.status === "rejected" || request.paymentStatus === "rejected") {
      return <AlertCircle className="text-destructive" size={38} />;
    } else if (
      request.status === "pending" ||
      request.paymentStatus === "pending"
    ) {
      return <Clock className="text-amber-500" size={38} />;
    } else if (request.paymentStatus === "approved") {
      return <CheckCircle className="text-green-600" size={38} />;
    }
    return null;
  };

  const handleShowReceipt = (requestId: string) => {
    setSelectedRequestId(requestId);
  };

  const handleCloseReceipt = () => {
    setSelectedRequestId(null);
  };

  return (
    <DashboardLayout title="Request Status">
      <div className="grid grid-cols-1 gap-6">
        {userRequests.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg text-gray-500">No requests found</h3>
          </div>
        ) : (
          userRequests.map((request) => {
            const book = getBook(request.bookId);
            if (!book) return null;

            return (
              <Card key={request.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">{book?.title}</CardTitle>
                      <CardDescription>by {book?.author}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        request.status === "approved"
                          ? "success"
                          : request.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {request.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 py-2">
                    {getStatusIcon(request)}
                    <div className="flex-grow">
                      <p className="text-sm">{getStatusMessage(request)}</p>
                      {request.paymentDetails && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Transaction ID: {request.paymentDetails.transactionId}
                        </p>
                      )}
                    </div>
                    {request.paymentStatus === "approved" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleShowReceipt(request.id)}
                      >
                        <FileText className="mr-1 h-4 w-4" />
                        Receipt
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
      
      {selectedRequest && currentUser && (
        <PaymentReceipt 
          request={selectedRequest}
          studentInfo={{
            username: currentUser.username,
            registerNumber: currentUser.registerNumber
          }}
          onClose={handleCloseReceipt}
        />
      )}
    </DashboardLayout>
  );
};

export default StatusPage;
