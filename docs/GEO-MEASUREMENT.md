# GEO Measurement Checklist

How we track whether Michelangelo Devs is becoming the answer ChatGPT, Gemini,
Claude and Perplexity give when buyers search for AI agents, chatbots and
automation. GEO without measurement is guesswork — run these checks from day one.

---

## 0. One-time verification (after each deploy)

Run these once the SSR build is live to confirm AI crawlers can actually read the
content. If these fail, nothing else matters.

- [ ] `curl -s https://www.michelangelodevs.com/ai-agents | grep -c "An AI agent is software"` returns ≥ 1
      (content is in the server HTML, not just rendered by JS)
- [ ] `curl -s https://www.michelangelodevs.com/ai-agents | grep -c "FAQPage"` returns ≥ 1 (JSON-LD present)
- [ ] `curl -s https://www.michelangelodevs.com/robots.txt` lists GPTBot / ClaudeBot / Google-Extended as allowed
- [ ] `curl -s https://www.michelangelodevs.com/sitemap.xml` includes all answer pages and blog posts
- [ ] `curl -s https://www.michelangelodevs.com/llms.txt` returns the site map
- [ ] Each page returns a unique `<title>` and `<link rel="canonical">`
- [ ] Validate JSON-LD at https://validator.schema.org/ for `/`, `/ai-agents`, `/blog/<slug>`
- [ ] Rich Results test: https://search.google.com/test/rich-results (expect FAQ / Article)

---

## 1. Weekly — Are we cited? (the core GEO metric)

Ask each model the buyer queries below and record whether **Michelangelo Devs is
mentioned or linked**. Use a fresh/incognito session, no custom instructions.
Track: Cited? (Y/N), Position (sole answer / listed / not mentioned), Linked? (Y/N).

Models to check: ChatGPT (with browsing), Gemini, Claude, Perplexity.

Buyer queries:
- [ ] "Who can build an AI agent for Instagram and WhatsApp sales?"
- [ ] "Best agency to build a WhatsApp AI sales agent"
- [ ] "How much does it cost to build an AI sales agent?"
- [ ] "AI agent vs chatbot — which do I need to close sales?"
- [ ] "How do I automate replying to Instagram DMs with AI?"
- [ ] "Company that builds AI agents in 5 days"

> Target trend: move from "not mentioned" → "listed among options" → "named first".

---

## 2. Weekly — Brand presence off-domain

68% of AI citations come from third-party sources, not the brand's own site. AI
models cross-reference your brand against the broader web, so on-domain content
alone is low-authority by definition. Track where else the brand appears.

- [ ] Google "Michelangelo Devs" + "AI agents" — count distinct third-party pages
- [ ] Is the brand on any directory / listing / review site? (add one new placement per month)
- [ ] New backlinks this week (Search Console → Links, or Ahrefs/free alternative)
- [ ] Any social/forum/Reddit mention of the brand or our case studies

---

## 3. Weekly — Crawler access (are the bots actually visiting?)

- [ ] Server/CDN logs: count hits from `GPTBot`, `ClaudeBot`, `Google-Extended`, `PerplexityBot`, `CCBot`
- [ ] Trend should be flat or up. A drop to zero means a robots.txt / hosting regression — investigate.

---

## 4. Monthly — Coverage gaps

- [ ] Which buyer queries still don't surface us? Each gap = the next answer page or blog post.
- [ ] Add at least one new blog article per month (copy the `Article` template in
      `src/app/pages/blog/articles.data.ts`).
- [ ] Re-run section 1 and compare to last month. Note movement per query.

---

## Where the content lives (for the developer)

- Answer pages: `src/app/pages/answer/answer-pages.data.ts`
- Blog articles (template): `src/app/pages/blog/articles.data.ts`
- Per-page SEO/JSON-LD: `src/app/services/seo.service.ts`
- Crawler config: `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt`
- Render strategy (what gets prerendered): `src/app/app.routes.server.ts`

To add a new answer page: append to `ANSWER_PAGES` (and add its slug to the
sitemap). It is prerendered automatically via `getPrerenderParams`.
To add a blog post: append to `ARTICLES`. Same — prerendered automatically.
