import { Textarea } from "@/components/ui/textarea";

export const ReviewTextarea = ({
  review,
  maxChars,
  handleReviewChange,
}: {
  review: string;
  maxChars: number;
  handleReviewChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => (
  <div>
    <Textarea
      placeholder="Share your thoughts..."
      value={review}
      onChange={handleReviewChange}
      className="h-32 resize-none"
    />
    <div className="mt-1 text-right text-sm text-muted-foreground">
      {review.length}/{maxChars}
    </div>
  </div>
);
