import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// ── POST CONTENT MAP ─────────────────────────────────────────────────────────
interface PostData {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  content: string;
}

const posts: Record<string, PostData> = {
  "fractional-cfo-cost": {
    title: "How Much Does a Fractional CFO Cost in 2026? (And When AI is the Better Bet)",
    excerpt: "Fractional CFOs charge $5K–$15K/mo. We break down exactly what you're paying for, what you're not getting, and when AI CFO software makes more sense.",
    category: "Strategy",
    readTime: "8 min read",
    date: "February 15, 2026",
    content: `
## The honest answer: $5,000–$15,000/mo

A fractional CFO in 2026 typically charges between $250–$400/hour, or $5,000–$15,000/month for a structured engagement. For a Series A-stage company, expect to pay $8,000–$12,000/month for someone who joins board meetings, builds models, and advises on fundraising.

That's $96,000–$144,000/year. Before benefits, equity, or the time you spend managing them.

## What you actually get for that money

A good fractional CFO brings:

**Financial modeling expertise.** They build or clean up your three-statement model, create board-ready dashboards, and keep the forecast updated. This takes 8–12 hours/month.

**Board meeting support.** They prepare board materials, attend meetings, and handle investor questions. 4–8 hours per board cycle.

**Strategic advice.** Hiring decisions, runway management, fundraising timing, and vendor negotiation. Highly variable.

**Relationships.** A good fractional CFO knows bankers, auditors, and investors. Network value is real.

The catch: most of what a fractional CFO does is **reactive and manual**. They update models when you ask. They flag problems in the next meeting. They can't watch your data 24/7.

## What you don't get

- Real-time monitoring
- Proactive alerts before problems escalate
- Instant analysis at 11pm before a board meeting
- A machine that never misses an accrual

A fractional CFO is a person. They have 8–12 other clients. You're getting 10–20 hours/month, not a dedicated CFO.

## The alternative: AI-first financial intelligence

Platforms like HelmCFO take the recurring, data-intensive work off your plate:

| Task | Fractional CFO | HelmCFO |
|------|---------------|---------|
| Burn rate calculation | Monthly update | Real-time, always current |
| Cash flow forecast | Manual model | Auto-generated from live data |
| Variance explanation | Next meeting | Instant AI analysis |
| Board report | 4–8 hours to build | Generated in seconds |
| Scenario modeling | Manual spreadsheet | One-click base/bull/bear |

## When to hire a fractional CFO anyway

AI doesn't replace human judgment for:

1. **Complex fundraising negotiations** — Term sheet negotiation requires relationship and experience
2. **M&A / exit diligence** — Human judgment on deal structure matters
3. **Audit management** — CPA relationships and signing authority
4. **Complex multi-entity structures** — Intercompany accounting requires expertise
5. **When your board demands it** — Some investors want a human CFO to talk to

## The hybrid model (what most Series A companies do)

Use AI for the 80% — monitoring, alerts, forecasting, board prep, scenario modeling. Use a fractional CFO for the 20% that requires human judgment and relationships.

Cost: $299–$1,499/mo for AI + $2,000–$4,000/mo for a fractional CFO on a lighter engagement (strategic advice only, not ops).

Total: $2,300–$5,500/mo vs $8,000–$15,000/mo. Same outcome.

## The bottom line

If you're spending $8K+/mo on someone to update your cash flow model and build board slides — stop. That's a $96K/year spreadsheet problem.

Use AI for the operational work. Save the human CFO budget for the relationships, judgment, and firepower you actually need.

---

*HelmCFO starts at $299/mo. Connect bank + QuickBooks + Stripe in 5 minutes. [Try it free →](/onboarding)*
    `,
  },

  "startup-cash-flow-forecast": {
    title: "The Startup Cash Flow Forecast Template That VCs Actually Want to See",
    excerpt: "Most founders build cash flow models that look backward. VCs want to see forward-looking, scenario-based forecasts. Here's the exact framework.",
    category: "Fundraising",
    readTime: "12 min read",
    date: "February 8, 2026",
    content: `
## Why most startup cash flow forecasts fail

Before you put your model in front of a VC, understand what they're actually looking for:

1. **They're stress-testing your assumptions**, not validating your math
2. **They want scenarios**, not a single "plan" that will be wrong
3. **They're looking for self-awareness** — do you know what you don't know?
4. **They care about unit economics first**, cash flow second

A model with perfect formulas and wrong assumptions is worthless. A model with honest assumptions and clear scenario ranges builds trust.

## The 3-statement model vs. the cash flow forecast

Investors want the **direct cash flow forecast**, not just the income statement. The difference matters:

- **Income statement**: Accrual-based. Revenue recognized when earned, not when cash arrives.
- **Cash flow statement**: Cash in, cash out. When does money actually move?

For a SaaS company billing monthly, these often match. For a company with net-60 terms or annual contracts paid upfront, they diverge significantly — and VCs know to check.

## The exact structure VCs want to see

### 1. Starting cash position
Where you are today. No assumptions, just fact.

### 2. Revenue forecast — bottom-up, not top-down

Bad: "We'll capture 1% of a $10B market"
Good: "We have 45 customers paying $1,200/mo. Our current close rate is 28% on demos. We're running 40 demos/month. Our churn is 2% monthly."

Build from individual customer cohorts, not total addressable market.

### 3. Operating expenses — fully loaded
Include:
- Payroll + benefits + payroll tax (~1.25× base salary)
- Contractor/freelancer costs
- Software and SaaS subscriptions
- Cloud infrastructure (scaled to revenue growth)
- Marketing spend (tied to customer acquisition model)
- G&A: accounting, legal, insurance
- Depreciation/amortization (if relevant)

**The number founders always underestimate:** accrued expenses. Benefits accruals, vacation accruals, deferred revenue liabilities. Get your accountant to do a proper accrual review before you fundraise.

### 4. Working capital adjustments
- Accounts receivable movement (longer DSO = cash tied up)
- Accounts payable movement (pay slower = conserve cash)
- Deferred revenue (annual contracts = great for cash)
- Prepaid expenses (cash out before expense)

### 5. Capital expenditures
Hardware, infrastructure buildout, capitalized software development.

### 6. Financing activities
Draws on existing credit facilities, equity injection, debt repayment.

## The three scenarios every investor expects

**Bear scenario:** 20% revenue miss, 10% cost overrun, key hire delayed 2 months. How long does cash last?

**Base scenario:** Plan. Your best honest estimate.

**Bull scenario:** 15% revenue outperformance, viral growth unlocks, key partnership closes. What happens to runway?

The spread between bear and bull shows investors how much uncertainty exists in your assumptions. A company where bear = 6 months, base = 12 months, bull = 18 months is in a very different position from one where all three are within 2 months of each other.

## The runway number that actually matters

Investors don't just care about runway — they care about **runway to the next fundable milestone**.

If your Series A requires:
- $1M ARR (you're at $420K)
- 3 reference customers (you have 1)
- 18 months of growth data (you have 10 months)

Then your model needs to show you hitting those milestones with 3–6 months of buffer before you run out of cash. If the math doesn't work at current burn, you have a decision to make.

## What to leave out

- Multi-year forecasts beyond 24 months (founders don't know, VCs don't believe it)
- "Conservative" scenarios that are still optimistic (be actually conservative)
- Synergistic growth from features not yet built
- TAM slides in a financial model (different document)

## Red flags VCs look for

1. **Flat burn rate** — Real companies have lumpy costs as they hire. Flat burn means you haven't modeled headcount properly.
2. **Revenue accelerating faster than sales capacity** — If you need 5 more salespeople to hit that revenue but they're not in the model…
3. **No accruals** — If your P&L matches your bank account exactly, something's wrong.
4. **Single scenario** — "We'll hit this number." No you won't, and sophisticated investors know it.
5. **The raise isn't in the model** — The whole point of the model is to show what happens once you close the round.

## The HelmCFO approach

We build these models from your live financial data — automatically. Connect QuickBooks, Plaid, and Stripe, and we generate the three-scenario forecast, the fully-loaded burn rate, and the runway-to-milestone calculation within minutes.

The model is always current. No more "let me update the spreadsheet" at 11pm before a founder meeting.

---

*[Try HelmCFO free →](/onboarding) — Connect your data in 5 minutes, get your investor-ready model instantly.*
    `,
  },

  "burn-rate-calculation": {
    title: "Burn Rate: The Complete Guide for Startup Founders (With Calculator)",
    excerpt: "Gross burn, net burn, fully-loaded burn — founders confuse these constantly. Master the calculation, understand the levers, and stop guessing your runway.",
    category: "Fundamentals",
    readTime: "10 min read",
    date: "January 28, 2026",
    content: `
## The three burn rates every founder confuses

**Gross burn rate** — Total cash out the door each month. Every payroll, vendor payment, AWS bill, rent check. This is how fast you're spending.

**Net burn rate** — Gross burn minus revenue. This is how fast your cash balance is actually declining.

**Fully-loaded burn rate** — Net burn adjusted for accrued but unpaid expenses. Benefits accruals, vacation liabilities, deferred revenue adjustments. This is what your investors actually care about.

Most founders track gross burn and stop there. The problem: gross burn overstates your "true" burn when you have revenue, and understates it when you have accruals hiding in your books.

## The formula

\`\`\`
Gross Burn = Total Cash Payments (this month)
Net Burn = Gross Burn - Cash Revenue
Fully-Loaded Burn = Net Burn + Accrued Liabilities
\`\`\`

Runway = Current Cash Balance ÷ Monthly Net Burn

## Why founders consistently underestimate burn

**The three hidden expenses:**

1. **Payroll accruals.** If you pay on the 1st and 15th, you're always carrying ~10–15 days of wages as a liability that hasn't hit your bank account yet. For a 30-person team with average fully-loaded cost of $12K/mo/person, that's $60K–$90K floating.

2. **Benefits liabilities.** Health insurance, 401k matching, and accrued vacation. Most early-stage companies underestimate this by 20–30% of base compensation.

3. **Annual contracts paid upfront.** If a key vendor or customer has an annual contract, your bank account shows a spike that doesn't represent recurring economics.

## The burn calculation that actually matters for runw

Don't use last month's burn. Use a weighted 3-month average, then adjust forward for:

- Committed headcount additions (offers out, start dates confirmed)
- Contracts signed but not yet invoiced
- Known one-time events (equipment purchases, office moves, compliance projects)

Your actual runway calculation:

\`\`\`
Adjusted Monthly Burn = 3-Month Avg Burn
                       + Committed Headcount × Fully-Loaded Cost
                       + Known One-Times ÷ 12
                       - Revenue Growth (if conservative, use 0)

Runway = Cash Balance ÷ Adjusted Monthly Burn
\`\`\`

## Burn rate benchmarks by stage

**Pre-seed (idea → first customers):**
- Engineering-first: $40K–$80K/mo (3–6 engineers)
- Typical runway: 12–18 months on a $1M pre-seed

**Seed ($1M–$3M round):**
- Team of 8–15: $150K–$350K/mo gross
- Target: 18–24 months runway post-close

**Series A ($5M–$15M round):**
- Team of 20–50: $400K–$900K/mo gross
- Target: 18 months to Series B milestone

**Rule of 40 implication:** At Series B+, burn efficiency compounds with revenue. A company at $100K MRR burning $300K/mo has a burn multiple of 3x (poor). Burn multiple = Net New ARR added ÷ Net Burn. VCs want < 1.5x for Series B.

## The levers

If runway is <6 months, these are the moves (in approximate impact order):

1. **Collect overdue AR.** Average SMB has 15–25% of monthly revenue sitting in overdue invoices. Collecting 60-day+ receivables is a direct cash injection.

2. **Extend payables.** Negotiate net-60 or net-90 with key vendors. It's free financing.

3. **Cut zero-utilization SaaS.** The average startup wastes $2,000–$8,000/mo on unused software subscriptions.

4. **Freeze discretionary spending.** Marketing experiments, conference travel, office upgrades.

5. **Renegotiate variable costs.** Cloud costs (pricing tiers), marketing agency retainers, recruiting fees.

6. **Reduce contractor costs.** Agencies and contractors are often the first cut without affecting core product development.

Only after the above: consider headcount reductions. Layoffs are expensive in morale, severance, and rehiring cost — and often signal desperation to investors.

## When to raise your alarm bells

**12+ months runway:** Normal operating mode. Plan your next raise.

**9 months runway:** Begin fundraising process. Raise takes 3–5 months typically.

**6 months runway:** Urgency mode. Fundraise aggressively or cut to extend to 12+.

**4 months runway:** Crisis mode. Cut now, fundraise with downside assumptions.

**<3 months runway:** Emergency. Board-level conversation required immediately.

## The calculation HelmCFO does automatically

HelmCFO connects to your bank (via Plaid), accounting (QuickBooks or Xero), and payroll (Finch) to calculate your true fully-loaded burn rate in real time — including accruals your accounting software might be missing.

The output: your precise runway date, the $-impact of each burn lever, and a three-scenario model showing what happens if everything goes right, stays the same, or breaks.

---

*[Connect your data free →](/onboarding) — Know your real burn rate in 5 minutes.*
    `,
  },
};

// Fallback for unpublished slugs — 404
export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.excerpt };
}

// ── Simple markdown renderer (paragraphs, headers, tables, code, lists) ────
function renderMarkdown(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    // H2
    if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-2xl font-bold mt-10 mb-4" style={{ fontFamily: "'DM Serif Display',serif", color: "var(--text)" }}>{line.slice(3)}</h2>);
      i++; continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-lg font-bold mt-6 mb-2" style={{ color: "var(--text)" }}>{line.slice(4)}</h3>);
      i++; continue;
    }

    // Bold standalone paragraph (** text **)
    if (line.startsWith("**") && line.endsWith("**") && !line.slice(2, -2).includes("**")) {
      elements.push(<p key={i} className="font-semibold mt-4 mb-1 text-[15px]" style={{ color: "var(--text)" }}>{line.slice(2, -2)}</p>);
      i++; continue;
    }

    // Code block
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="my-5 p-4 rounded-xl overflow-x-auto text-[12px] font-mono" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--green)" }}>
          {codeLines.join("\n")}
        </pre>
      );
      i++; continue;
    }

    // Table
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines.filter((l) => !l.match(/^\|[\s-|]+\|$/));
      elements.push(
        <div key={i} className="my-6 overflow-x-auto">
          <table className="w-full text-[13px]" style={{ borderCollapse: "collapse" }}>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ borderBottom: "1px solid var(--border)", background: ri === 0 ? "var(--surface-2)" : "transparent" }}>
                  {row.split("|").filter(Boolean).map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5" style={{ color: ri === 0 ? "var(--text)" : "var(--text-2)", fontWeight: ri === 0 ? 600 : 400 }}>
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // List item
    if (line.match(/^(\d+\.|[-*]) /)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^(\d+\.|[-*]) /)) {
        listItems.push(lines[i].replace(/^(\d+\.|[-*]) /, ""));
        i++;
      }
      elements.push(
        <ul key={i} className="my-4 space-y-1.5 pl-5 list-disc">
          {listItems.map((item, li) => (
            <li key={li} className="text-[14px] leading-relaxed" style={{ color: "var(--text-2)" }}
              dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text)">$1</strong>') }} />
          ))}
        </ul>
      );
      continue;
    }

    // Paragraph
    const html = line
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text)">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--accent);text-decoration:underline">$1</a>');

    if (line.startsWith("---")) {
      elements.push(<hr key={i} className="my-8" style={{ borderColor: "var(--border)" }} />);
    } else {
      elements.push(<p key={i} className="text-[14px] leading-[1.8] mb-4" style={{ color: "var(--text-2)" }} dangerouslySetInnerHTML={{ __html: html }} />);
    }
    i++;
  }

  return elements;
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "'Outfit',sans-serif", minHeight: "100vh" }}>
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-[15px]">Helm<span style={{ color: "var(--accent)" }}>CFO</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-[13px]" style={{ color: "var(--text-2)" }}>← All posts</Link>
            <Link href="/onboarding" className="px-4 py-2 rounded-xl text-[13px] font-semibold" style={{ background: "var(--accent)", color: "white" }}>Try free</Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        {/* Post header */}
        <div className="mb-10">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full mb-5 inline-block" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>{post.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-[-0.02em] mb-5" style={{ fontFamily: "'DM Serif Display',serif" }}>{post.title}</h1>
          <p className="text-[15px] leading-relaxed mb-6" style={{ color: "var(--text-2)" }}>{post.excerpt}</p>
          <div className="flex items-center gap-3 text-[12px] pb-8 border-b" style={{ color: "var(--text-3)", borderColor: "var(--border)" }}>
            <span>HelmCFO Team</span><span>·</span><span>{post.date}</span><span>·</span><span>{post.readTime}</span>
          </div>
        </div>

        {/* Content */}
        <article>{renderMarkdown(post.content)}</article>

        {/* CTA */}
        <div className="mt-14 rounded-2xl p-6 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border-hi)" }}>
          <p className="font-bold text-[16px] mb-2" style={{ color: "var(--text)" }}>Know your real burn rate in 5 minutes.</p>
          <p className="text-[13px] mb-5" style={{ color: "var(--text-2)" }}>Connect QuickBooks + Plaid + Stripe. Get instant cash flow intelligence.</p>
          <Link href="/onboarding" className="px-6 py-2.5 rounded-xl text-[13px] font-semibold inline-block" style={{ background: "var(--accent)", color: "white" }}>
            Start free →
          </Link>
        </div>

        {/* Back */}
        <div className="mt-10 text-center">
          <Link href="/blog" className="text-[13px]" style={{ color: "var(--text-3)" }}>← Back to all posts</Link>
        </div>
      </main>
    </div>
  );
}
