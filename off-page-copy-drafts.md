# Off-Page Copy Drafts — Upwork Text Formatter

Ready-to-paste copy for the directory submissions and content distribution recommended in the SEO review. Nothing here has been posted anywhere — these are drafts for you to review, tweak to your voice, and post once the site is live on a real domain (all placeholder links below use `https://upworkformatter.com`; swap for your actual domain when you post).

---

## Directory listings

### Product Hunt

**Tagline** (max ~60 characters):
> Format bold, italic & lists that survive pasting into Upwork

**Description:**
> Upwork strips HTML and Markdown from proposals, job posts, and messages — so your bold, italics, bullets, and links all get flattened on paste. Upwork Text Formatter works around that by converting your formatting into Unicode characters that already look styled, so there's nothing for Upwork to strip. Select text, hit a toolbar button (or Ctrl+B), and paste — no account, no sign-up, and nothing you type ever leaves your browser.

**First comment (maker comment):**
> Hey everyone — built this after getting tired of proposals looking like a wall of text because Upwork kills all formatting on paste. Turns out there's a neat trick with Unicode substitution characters that gets around it entirely. Would love feedback, especially from anyone who submits a lot of Upwork proposals.

---

### BetaList / Indie Hackers (product post)

**Title:**
> I built a free tool that makes Upwork proposals actually look formatted

**Body:**
> If you've ever pasted a nicely formatted proposal into Upwork and watched all the bold/italic/bullets disappear — that's not a bug, Upwork's fields are plain text on purpose. I built a small client-side tool that gets around it by swapping your formatting into Unicode characters that already render styled, so there's no markup for Upwork to strip.
>
> - 100% free, no sign-up
> - Runs entirely in your browser — nothing you type is stored or sent anywhere
> - Bold, italic, underline, bullet lists, numbered lists, and links
>
> Would genuinely appreciate feedback from anyone who writes a lot of Upwork proposals — what's missing, what's confusing, what you'd want next.

---

### AlternativeTo

**Category:** Text Editor / Productivity

**Description:**
> A free, client-side tool for formatting text before pasting it into Upwork. Converts bold, italic, underline, bullet lists, numbered lists, and links into Unicode characters that survive Upwork's plain-text fields — no account required, nothing leaves your browser.

**Tags:** `text-formatting`, `freelancing`, `upwork`, `unicode`, `productivity`

---

### SaaSHub

**One-liner:**
> The formatting tool for Upwork proposals, job posts, and messages.

**Description:**
> Upwork Text Formatter solves a specific, annoying problem: Upwork's text fields strip out all real formatting on paste. This free tool converts bold, italic, underline, and list formatting into Unicode characters instead, so it survives the paste intact. No sign-up, 100% client-side.

---

## Technical post draft (dev.to / Hashnode)

**Title:** How Unicode characters let you "format" text that Upwork can't strip

**Draft:**

> Upwork's proposal, job post, and message fields are plain text. Paste in something bold from Google Docs or Word, and the formatting vanishes on the way in — same with italics, underlines, bullet lists, and Markdown syntax like `**bold**`. This isn't a bug; it's a deliberate, common security/consistency measure for plain-text input fields across the web.
>
> That constraint has one interesting loophole: Unicode.
>
> Most people think of "bold" and "italic" as *properties* applied to text — something a font renderer does to a normal letter based on metadata like `<b>` or `font-weight: 700`. But Unicode also contains entire alternate letterform blocks that are visually bold, italic, or otherwise styled *as their own distinct characters* — not the letter "A" with a bold property attached, but a completely different code point that happens to render as a bold "𝐀." The Mathematical Alphanumeric Symbols block is where most of these live.
>
> Because these are just plain characters — the same category as any letter or number — there's no formatting markup attached to them for a plain-text field to strip. When you paste a Unicode "bold A" into a plain-text field, it pastes exactly like any other letter, because as far as the field is concerned, that's all it is.
>
> The practical effect: instead of asking a plain-text field to render `<b>bold</b>`, you ask it to render `𝐛𝐨𝐥𝐝` directly — no markup, no metadata, nothing to strip. Bullet points work the same way; `•` is just a character, not list markup.
>
> The one partial exception is underline, which most fonts can't fake with a dedicated letterform block the way bold/italic can — that one uses a Unicode *combining* character layered under each letter instead, which occasionally renders slightly differently across fonts and platforms.
>
> This is the entire mechanism behind [Upwork Text Formatter](https://upworkformatter.com) — a small tool I built that automates the substitution so you can select text and hit Ctrl+B instead of hand-picking Unicode characters. Everything runs client-side; nothing you type is sent anywhere.
>
> Curious whether anyone's used this trick elsewhere — Discord bios and Twitter/X posts are the other common places I've seen it show up.

---

## Community posts (use sparingly — once per community, framed as sharing, not promoting)

**r/Upwork (or similar freelancer subreddit):**
> Built a free tool to fix the "my proposal formatting disappears" problem — sharing in case it's useful to anyone else here. [link] It converts bold/italic/bullets into Unicode so Upwork can't strip it on paste. No sign-up, nothing stored. Happy to take feedback if anyone tries it.

**Freelancer Discord/Slack communities:**
> Small thing I built that might save some of you time — a free formatter that keeps your bold/italic/bullets intact when pasting into Upwork proposals or messages. [link] Runs entirely in-browser, no account needed.

A reminder on this last section specifically: post it once per community, respond genuinely to any replies, and don't repeat the same post across multiple threads or subreddits in a short window — that reads as spam and tends to get removed (and can get you banned from the community), which defeats the purpose.
