import { HeadingWrapper } from "../_components/HeadingWrapper";
import { OrderCardSkeleton } from "../_components/OrderCardSkeleton";

export default function OrdersLoading() {
  return (
    <HeadingWrapper heading="Your Orders">
      <div className="flex flex-col gap-5">
        <OrderCardSkeleton />
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </div>
    </HeadingWrapper>
  );
}
