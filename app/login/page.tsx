import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Section } from "@/components/ui/section";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <Section>
      <h1 className="text-center text-5xl font-black">Client Login</h1>
      <div className="mt-8"><AuthForm mode="login" /></div>
      <p className="mt-5 text-center text-sm">Need an account? <Link className="font-semibold text-cyan-700 dark:text-cyan-300" href="/signup">Sign up</Link></p>
    </Section>
  );
}
