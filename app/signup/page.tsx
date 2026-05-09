import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Section } from "@/components/ui/section";

export const metadata = { title: "Signup" };

export default function SignupPage() {
  return (
    <Section>
      <h1 className="text-center text-5xl font-black">Create Account</h1>
      <div className="mt-8"><AuthForm mode="signup" /></div>
      <p className="mt-5 text-center text-sm">Already have an account? <Link className="font-semibold text-cyan-700 dark:text-cyan-300" href="/login">Log in</Link></p>
    </Section>
  );
}
