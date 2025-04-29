
import React, { useState } from "react";
import { BookRequest, Book, RequestStatus } from "@/context/BookContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

import PaymentForm from "./PaymentForm";

interface RequestCardProps {
  request: BookRequest;
  book: Book | undefined;
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

const getStatusBadgeVariant = (status: RequestStatus) => {
  switch (status) {
    case "approved":
      return "success";
    case "rejected":
      return "destructive";
    case "pending":
    default:
      return "secondary";
  }
};

const getPaymentStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "approved":
      return "success";
    case "rejected":
      return "destructive";
    case "pending":
      return "warning";
    case "not_required":
    default:
      return "secondary";
  }
};

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  book,
  isAdmin = false,
  isClerk = false,
  onApprove,
  onReject,
  onSubmitPayment,
  onApprovePayment,
  onRejectPayment,
}) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  if (!book) {
    return <div>Book not found</div>;
  }

  const requestDate = new Date(request.requestDate);
  const timeAgo = formatDistanceToNow(requestDate, { addSuffix: true });

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{book.title}</CardTitle>
            <CardDescription>by {book.author}</CardDescription>
          </div>
          <Badge variant={getStatusBadgeVariant(request.status) as any}>
            {request.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Requested:</span>
            <span>{timeAgo}</span>
          </div>

          {!isAdmin && !isClerk && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Status:</span>
              <Badge variant={getPaymentStatusBadgeVariant(request.paymentStatus) as any}>
                {request.paymentStatus === "not_required"
                  ? "NOT REQUIRED"
                  : request.paymentStatus.toUpperCase()}
              </Badge>
            </div>
          )}

          {isAdmin && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Requested By:</span>
              <span>{request.username} ({request.registerNumber})</span>
            </div>
          )}

          {isClerk && request.paymentDetails && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span>{request.paymentDetails.transactionId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Time:</span>
                <span>{request.paymentDetails.paymentTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Student:</span>
                <span>{request.username} ({request.registerNumber})</span>
              </div>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        {isAdmin && request.status === "pending" && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex gap-1"
              onClick={() => onReject && onReject(request.id)}
            >
              <X size={16} /> Reject
            </Button>
            <Button
              size="sm"
              className="flex gap-1"
              onClick={() => onApprove && onApprove(request.id)}
            >
              <Check size={16} /> Approve
            </Button>
          </>
        )}

        {isClerk && request.paymentStatus === "pending" && request.paymentDetails && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex gap-1"
              onClick={() => onRejectPayment && onRejectPayment(request.id)}
            >
              <X size={16} /> Reject Payment
            </Button>
            <Button
              size="sm"
              className="flex gap-1"
              onClick={() => onApprovePayment && onApprovePayment(request.id)}
            >
              <Check size={16} /> Approve Payment
            </Button>
          </>
        )}

        {!isAdmin && !isClerk && request.status === "approved" && request.paymentStatus === "pending" && !request.paymentDetails && (
          <Button
            className="w-full flex gap-2"
            onClick={() => setShowPaymentForm(true)}
          >
            <CreditCard size={18} /> Make Payment
          </Button>
        )}
      </CardFooter>

      {showPaymentForm && onSubmitPayment && (
        <PaymentForm 
          requestId={request.id}
          onSubmit={(transactionId, paymentTime) => {
            onSubmitPayment(request.id, transactionId, paymentTime);
            setShowPaymentForm(false);
          }}
          onCancel={() => setShowPaymentForm(false)}
        />
      )}
    </Card>
  );
};

export default RequestCard;
