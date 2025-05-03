
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { BookRequest } from "@/context/BookContext";
import { Printer, FileText } from "lucide-react";

interface PaymentReceiptProps {
  request: BookRequest;
  studentInfo: {
    username: string;
    registerNumber?: string;
  };
  onClose: () => void;
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  request,
  studentInfo,
  onClose,
}) => {
  const paymentDetails = request.paymentDetails;
  
  if (!paymentDetails) {
    return null;
  }

  const handlePrint = () => {
    const printContent = document.getElementById("payment-receipt");
    const originalContents = document.body.innerHTML;
    
    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy hh:mm a");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full bg-white" id="payment-receipt">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-center text-xl">
            AAMEC Book Bank Receipt
          </CardTitle>
          <div className="text-center text-sm text-muted-foreground">
            Receipt ID: {request.id.substring(0, 8)}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm mb-1">Student Information</h3>
              <div className="text-sm grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Name:</span>
                <span>{studentInfo.username}</span>
                <span className="text-muted-foreground">Register No:</span>
                <span>{studentInfo.registerNumber || "N/A"}</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-sm mb-1">Payment Information</h3>
              <div className="text-sm grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span>{paymentDetails.transactionId}</span>
                <span className="text-muted-foreground">Payment Time:</span>
                <span>{formatDate(paymentDetails.paymentTime)}</span>
                <span className="text-muted-foreground">Amount:</span>
                <span>₹550</span>
                <span className="text-muted-foreground">Status:</span>
                <span className="font-semibold text-green-600">Approved</span>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm font-medium">Thank you for using AAMEC Book Bank!</p>
              <p className="text-xs text-muted-foreground mt-1">
                Please collect your book within two days from the Book Bank.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Receipt
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentReceipt;
