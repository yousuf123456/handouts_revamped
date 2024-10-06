import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Question } from "@prisma/client";

interface QuestionCardProps {
  question: Pick<
    Question,
    "id" | "answer" | "userInformation" | "query" | "createdAt" | "answeredAt"
  > & {
    [key: string]: any;
  };
}

export const QuestionCard = ({ question }: QuestionCardProps) => {
  return (
    <Card className="w-full">
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1 space-y-1">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={question.userInformation.image || undefined}
                    alt={question.userInformation.name}
                  />
                  <AvatarFallback>
                    {question.userInformation.name[0]}
                  </AvatarFallback>
                </Avatar>

                <span className="text-sm text-muted-foreground">
                  {question.userInformation.name}
                </span>
              </div>

              <p className="text-sm">{question.query}</p>
            </div>

            <Badge variant="secondary" className="text-xs">
              <CalendarIcon className="mr-1 h-3 w-3" />
              {new Date(question.createdAt).toLocaleDateString()}
            </Badge>
          </div>

          {question.answer && question.answeredAt && (
            <div className="mt-2 flex flex-col gap-1 rounded-md bg-muted p-3">
              <div className="flex items-center justify-between">
                <div className="mb-2 flex items-center space-x-3">
                  <Avatar className="flex h-6 w-6 items-center justify-center bg-primary">
                    <Store className="h-4 w-4 text-primary-foreground" />
                  </Avatar>
                  <p className="text-sm text-muted-foreground">
                    Store Response
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {new Date(question.answeredAt).toLocaleDateString()}
                  </Badge>
                </div>
              </div>

              <p className="text-sm">{question.answer}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
