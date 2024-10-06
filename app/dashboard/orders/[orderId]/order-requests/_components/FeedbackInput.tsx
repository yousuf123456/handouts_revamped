import React, { useContext } from "react";

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { requestFormContext } from "./OrderRequestForm";

export const FeedbackInput = () => {
  const { requestFormData, setRequestFormData } =
    useContext(requestFormContext);

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="mb-3 text-base font-medium">Additional Comments</h2>
        <Textarea
          placeholder="Please share any additional concerns or reasons for cancellation..."
          value={requestFormData.feedback}
          onChange={(e) =>
            setRequestFormData((prev) => ({
              ...prev,
              feedback: e.target.value,
            }))
          }
          rows={3}
        />
      </CardContent>
    </Card>
  );
};
