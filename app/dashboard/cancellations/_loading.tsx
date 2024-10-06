import { HeadingWrapper } from "../_components/HeadingWrapper";
import { OrderCardSkeleton } from "../_components/OrderCardSkeleton";

export default function CancellationsLoading() {
  return (
    <HeadingWrapper heading="Your Cancellations">
      <div className="flex flex-col gap-5">
        <OrderCardSkeleton />
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </div>
    </HeadingWrapper>
  );
}
