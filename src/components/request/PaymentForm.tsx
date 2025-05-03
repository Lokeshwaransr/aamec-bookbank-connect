
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PaymentFormProps {
  requestId: string;
  onSubmit: (transactionId: string, paymentTime: string) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  requestId,
  onSubmit,
  onCancel,
}) => {
  const [transactionId, setTransactionId] = useState("");
  const [paymentTime, setPaymentTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Add a small delay to simulate processing
    setTimeout(() => {
      onSubmit(transactionId, paymentTime);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <Card className="border-t border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Payment Details</CardTitle>
        <CardDescription>
          Please make a payment to the following account and enter the transaction details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-3 rounded-md mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">IFSC Code:</div>
            <div>INDBOOIT</div>
            <div className="font-medium">Account Holder:</div>
            <div>Aamec Kovilvenni</div>
            <div className="font-medium">Account No:</div>
            <div>724536890435</div>
            <div className="font-medium">Amount:</div>
            <div>₹550</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID</Label>
            <Input
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentTime">Payment Time</Label>
            <Input
              id="paymentTime"
              type="datetime-local"
              value={paymentTime}
              onChange={(e) => setPaymentTime(e.target.value)}
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !transactionId || !paymentTime}
        >
          {isSubmitting ? "Processing..." : "Submit Payment"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
