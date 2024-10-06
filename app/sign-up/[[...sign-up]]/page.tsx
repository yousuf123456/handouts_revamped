import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-[calc(100vh-72px)] w-full items-center justify-center">
      <SignUp />
    </div>
  );
}
