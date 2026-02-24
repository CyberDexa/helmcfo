import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Financial Intelligence for Founders",
  description: "Cash flow forecasting, burn rate management, board reporting, and startup finance strategy. From the HelmCFO team.",
};

const posts = [
  {
    slug: "fractional-cfo-cost",
    title: "How Much Does a Fractional CFO Cost in 2026? (And When AI is the Better Bet)",
    excerpt: "Fractional CFOs charge $5K–$15K/mo. We break down exactly what you're paying for, what you're not getting, and when AI CFO software makes more sense.",
    category: "Strategy",
    readTime: "8 min read",
    date: "Feb 15, 2026",
    featured: true,
  },
  {
    slug: "startup-cash-flow-forecast",
    title: "The Startup Cash Flow Forecast Template That VCs Actually Want to See",
    excerpt: "Most founders build cash flow models that look backward. VCs want to see forward-looking, scenario-based forecasts. Here's the exact framework.",
    category: "Fundraising",
    readTime: "12 min read",
    date: "Feb 8, 2026",
    featured: false,
  },
  {
    slug: "burn-rate-calculation",
    title: "Burn Rate: The Complete Guide for Startup Founders (With Calculator)",
    excerpt: "Gross burn, net burn, fully-loaded burn — founders confuse these constantly. Master the calculation, understand the levers, and stop guessing your runway.",
    category: "Fundamentals",
    readTime: "10 min read",
    date: "Jan 28, 2026",
    featured: false,
  },
  {
    slug: "board-reporting",
    title: "How to Build a Board Report That Your Investors Will Actually Read",
    excerpt: "Most board reports are too long, too backward-looking, and buried in slides. Here's how to structure a board pack that builds investor confidence.",
    category: "Board Management",
    readTime: "9 min read",
    date: "Jan 20, 2026",
    featured: false,
  },
  {
    slug: "unit-economics",
    title: "CAC, LTV, and Payback Period: The Unit Economics Every SaaS Founder Must Know",
    excerpt: "Unit economics determine whether your business is fundable, scalable, and profitable. This guide covers the metrics, the benchmarks, and how to improve them.",
    category: "SaaS Metrics",
    readTime: "11 min read",
    date: "Jan 12, 2026",
    featured: false,
  },
  {
    slug: "scenario-planning",
    title: "Bear, Base, Bull: How to Build Financial Scenarios That Survive Contact with Reality",
    excerpt: "Single-point forecasts are worse than useless — they give false confidence. This guide shows you how to build scenario models that actually help you make decisions.",
    category: "Forecasting",
    readTime: "7 min read",
    date: "Jan 5, 2026",
    featured: false,
  },
];

const categories = ["All", "Strategy", "Fundraising", "Fundamentals", "Board Management", "SaaS Metrics", "Forecasting"];

export default function BlogPage() {
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "'Outfit',sans-serif", minHeight: "100vh" }}>
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-[15px]">Helm<span style={{ color: "var(--accent)" }}>CFO</span></Link>
          <Link href="/onboarding" className="px-4 py-2 rounded-xl text-[13px] font-semibold" style={{ background: "var(--accent)", color: "white" }}>Start free</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "var(--accent)" }}>The HelmCFO Blog</p>
          <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ fontFamily: "'DM Serif Display',serif" }}>Financial intelligence for founders.</h1>
          <p className="text-[15px]" style={{ color: "var(--text-2)" }}>Everything you need to manage cash, plan headcount, report to your board, and raise your next round.</p>
        </div>

        {/* Category filter pills (display-only) */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((c, i) => (
            <span key={c} className="px-3 py-1.5 rounded-full text-[12px] font-medium cursor-pointer"
              style={{ background: i === 0 ? "var(--accent)" : "var(--surface)", color: i === 0 ? "white" : "var(--text-2)", border: i === 0 ? "none" : "1px solid var(--border)" }}>
              {c}
            </span>
          ))}
        </div>

        {/* Featured post */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="block rounded-2xl p-8 mb-8 group hover:border-blue-500/30 transition-colors"
            style={{ background: "var(--surface)", border: "1px solid var(--border-hi)" }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: "var(--accent)", color: "white" }}>FEATURED</span>
              <span className="text-[11px] px-2 py-0.5 rounded" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>{featured.category}</span>
            </div>
            <h2 className="text-2xl font-bold leading-tight mb-3 group-hover:text-blue-400 transition-colors" style={{ color: "var(--text)" }}>{featured.title}</h2>
            <p className="text-[14px] leading-relaxed mb-4" style={{ color: "var(--text-2)" }}>{featured.excerpt}</p>
            <div className="flex items-center gap-4 text-[12px]" style={{ color: "var(--text-3)" }}>
              <span>{featured.date}</span>
              <span>·</span>
              <span>{featured.readTime}</span>
            </div>
          </Link>
        )}

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block rounded-2xl p-6 group hover:border-blue-500/20 transition-colors"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded mb-3 inline-block" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>{post.category}</span>
              <h3 className="font-bold text-[15px] leading-snug mb-2.5 group-hover:text-blue-400 transition-colors" style={{ color: "var(--text)" }}>{post.title}</h3>
              <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--text-2)" }}>{post.excerpt}</p>
              <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--text-3)" }}>
                <span>{post.date}</span><span>·</span><span>{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Subscribe CTA */}
        <div className="mt-14 rounded-2xl p-8 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Weekly financial intelligence for founders.</h3>
          <p className="text-[13px] mb-6" style={{ color: "var(--text-2)" }}>Join 2,400+ founders who get our CFO playbook every Friday.</p>
          <form className="flex gap-2 max-w-md mx-auto justify-center flex-wrap">
            <input type="email" placeholder="your@company.com" className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border-hi)", color: "var(--text)" }} />
            <button type="submit" className="px-5 py-2.5 rounded-xl text-[13px] font-semibold" style={{ background: "var(--accent)", color: "white" }}>Subscribe</button>
          </form>
        </div>
      </main>
    </div>
  );
}
