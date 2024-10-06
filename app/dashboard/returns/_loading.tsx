import { HeadingWrapper } from "../_components/HeadingWrapper";
import { OrderCardSkeleton } from "../_components/OrderCardSkeleton";

export default function ReturnsLoading() {
  return (
    <HeadingWrapper heading="Your Returns">
      <div className="flex flex-col gap-5">
        <OrderCardSkeleton />
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </div>
    </HeadingWrapper>
  );
}
