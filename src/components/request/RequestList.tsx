
import React from "react";
import { BookRequest } from "@/context/BookContext";
import { useBook } from "@/context/BookContext";
import RequestCard from "./RequestCard";

interface RequestListProps {
  requests: BookRequest[];
  isAdmin?: boolean;
  isClerk?: boolean;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onSubmitPayment?: (
    requestId: string,
    transactionId: string,
    paymentTime: string
  ) => void;
  onApprovePayment?: (requestId: string) => void;
  onRejectPayment?: (requestId: string) => void;
}

const RequestList: React.FC<RequestListProps> = ({
  requests,
  isAdmin = false,
  isClerk = false,
  onApprove,
  onReject,
  onSubmitPayment,
  onApprovePayment,
  onRejectPayment,
}) => {
  const { getBook } = useBook();

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg text-gray-500">No requests found</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          book={getBook(request.bookId)}
          isAdmin={isAdmin}
          isClerk={isClerk}
          onApprove={onApprove}
          onReject={onReject}
          onSubmitPayment={onSubmitPayment}
          onApprovePayment={onApprovePayment}
          onRejectPayment={onRejectPayment}
        />
      ))}
    </div>
  );
};

export default RequestList;
