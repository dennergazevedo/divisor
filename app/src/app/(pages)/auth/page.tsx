import Image from "next/image";
import AuthForm from "./forms/auth";

export default function Auth() {
  return (
    <main className="flex min-h-screen items-center justify-center relative">
      <AuthForm />
      <Image
        fill
        src="/auth-bg.webp"
        alt="Divisor Background"
        sizes="100vw"
        className="object-cover h-full bottom-0 w-full opacity-5 -z-10"
      />
    </main>
  );
}
