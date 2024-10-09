import Link from "next/link";
import { routes } from "./_config/routes";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-5 text-foreground">
      <h1 className="mb-4 animate-bounce text-5xl font-bold">404</h1>
      <h2 className="mb-6 text-2xl">Page Not Found</h2>
      <p className="mb-8 max-w-md text-center">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link href={routes.home}>
        <Button variant={"corners"} size={"lg"}>
          Go Back Home
        </Button>
      </Link>
    </div>
  );
}
