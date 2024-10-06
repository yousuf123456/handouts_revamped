import { Star } from "lucide-react";

export const StarRating = ({
  rating,
  onStarClick,
}: {
  rating: number;
  onStarClick: (selectedRating: 1 | 2 | 3 | 4 | 5) => void;
}) => (
  <div className="flex justify-center space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-8 w-8 cursor-pointer transition-all ${
          star <= rating ? "fill-primary text-primary" : "text-muted-foreground"
        }`}
        onClick={() => onStarClick(star as 1 | 2 | 3 | 4 | 5)}
      />
    ))}
  </div>
);
