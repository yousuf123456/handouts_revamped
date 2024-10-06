import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

const cancellationPolicy = [
  "Cancellations are only possible for items not yet shipped.",
  "Refunds will be processed within 5-7 business days.",
  "Shipping costs are non-refundable for cancelled orders.",
  "For items already shipped, please refer to our return policy.",
];

const returnPolicy = [
  "Items can be returned within 30 days of receipt.",
  "Products must be unused and in original packaging.",
  "Refunds will be processed after inspection of the returned item.",
  "Return shipping costs are the responsibility of the customer.",
  "For defective or damaged items, return shipping will be covered.",
  "Refunds may take 5-7 business days to process after approval.",
  "Exchanges are subject to product availability.",
];

export const Policy = () => {
  const type = useSearchParams().get("type") as "cancel" | "return";

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="mb-3 text-base font-medium">
          {type === "cancel" ? "Cancellation Policy" : "Return Policy"}
        </h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {type === "cancel"
            ? cancellationPolicy.map((point, i) => <li key={i}>{point}</li>)
            : returnPolicy.map((point, i) => <li key={i}>{point}</li>)}
        </ul>
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <AlertCircle className="mr-2 h-4 w-4" />
          <p>
            By submitting, you agree to our{" "}
            {type === "cancel" ? "cancellation policy" : "return policy"}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
