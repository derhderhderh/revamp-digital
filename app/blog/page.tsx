import { Eyebrow, Section } from "@/components/ui/section";

export const metadata = { title: "Blog" };

const posts = [
  "How to know when your small business website needs a revamp",
  "Website maintenance checklist for local businesses",
  "What AI website analysis can and cannot tell you",
  "Simple homepage changes that improve conversions"
];

export default function BlogPage() {
  return (
    <Section>
      <Eyebrow>Blog</Eyebrow>
      <h1 className="max-w-4xl text-5xl font-black text-balance">SEO-rich guides for better websites, maintenance, and digital trust.</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post} className="glass rounded-3xl p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Revamp Guide</p>
            <h2 className="mt-4 text-2xl font-bold">{post}</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">A practical article shell wired for Firestore-backed publishing from the admin portal.</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
