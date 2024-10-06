"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { QuestionProductInformation } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { askQuestion } from "../_serverActions/askQuestion";
import { toast } from "sonner";

interface AskQuestionFormProps {
  storeId: string;
  productId: string;
  productInformation: QuestionProductInformation;
}

export default function AskQuestionForm(props: AskQuestionFormProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onAskQuestion = async () => {
    if (!query) return;

    setIsLoading(true);

    const result = await askQuestion({ ...props, query });

    if (!result.success) toast.error(result.message);

    if (result.success) toast.success(result.message);

    setIsLoading(false);
    setQuery("");
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-0 p-3">
        <CardTitle className="text-center text-xl font-bold">
          Ask a Question
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 py-0">
        <Textarea
          value={query}
          disabled={isLoading}
          className="min-h-[120px]"
          placeholder="Type your question here..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </CardContent>
      <CardFooter className="p-3">
        <SignedIn>
          <Button
            size={"sm"}
            className="w-full"
            disabled={isLoading}
            onClick={onAskQuestion}
          >
            Submit Question{" "}
            {isLoading && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin text-white" />
            )}
          </Button>
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <Button size={"sm"} className="w-full">
              Sign In To Ask
            </Button>
          </SignInButton>
        </SignedOut>
      </CardFooter>
    </Card>
  );
}
