# Setup Questions — frankgaard.com

Fill in answers below each question, then tell Claude you're done.

---

## Tooling

**1. Package manager**
Options: `npm` / `pnpm` (recommended) / `yarn`

Answer: whatever is recommended

**2. Database: Neon or Supabase?**
- Neon — minimal, fast, Vercel-native integration
- Supabase — adds a web dashboard to browse/edit data directly (handy for you)

Answer: Supabase

**3. ORM: Drizzle or Prisma?**
- Drizzle — lightweight, SQL-close, great with Neon/Supabase
- Prisma — more tooling, auto-generated client, heavier

Answer: What are your thoughts on this? I'm a developer and might appreciate one that has a better devex, but at the same time this is a super small project and I won't be working on it that much. Looking at examples online they seem pretty close. Maybe drizzle as you said it works with supabase?

---

## Design / Frontend

**4. Visual style**
Should this preserve Frank's current site look, or is it a redesign?
If redesign — any reference sites or adjectives (minimal, dark, editorial, etc.)?

Answer: Lower effort level. Out of the box components and style. It's a gallery site for artwork so we want the art to be the main visual component. If you can visit the current site and see we just used basic bootstrap css styles back when i built it.

**5. Lightbox on gallery images?**
Should clicking a photo open a fullscreen/lightbox view?

Answer: That would be great

---

## Admin UI

**6. Auth approach**
Frank is the only user. Options:
- Simple: one hardcoded email/password, session cookie — no OAuth, no setup
- Auth.js (NextAuth): more robust, supports magic link or GitHub login

Answer: In the past I've created myself an account as well to go in and to administrative things. The previous site built on drupal 8 so that was just how that worked. He's the only user that will need to do what he does, but I want to make sure I can go in there and make changes. Maybe I could just log in with his credentials?

**7. Who manages content day-to-day?**
Will Frank upload artwork and write posts himself, or will you do it on his behalf?
(Affects how much we optimize the admin UI for non-technical use)

Answer: Frank is the main user. I would only go in to assist if neccessary but maybe i don't need an account for that.

---

## Repo & Infrastructure

**8. GitHub repo**
- Your GitHub username or org:
- Public or private:

Answer: I think vscode here is setup with my repo. https://github.com/samgaard should be public

**9. Vercel**
Are you already on Vercel Pro, or does that need to be set up?

Answer: I haven't signed up yet. I'm hoping to do all the development locally and then we can set that up. Or is that not how it works?

**10. Cloudflare**
Do you already have a Cloudflare account with R2 enabled, or starting fresh?

Answer: starting fresh

**EXTRA NOTES
- Current website can be found at frankgaard.com for reference
- This is a low budget site and I want to use as much 'out of the box' options as possible. You might be able to see on current site i used bootstrap styles and components.
- There is a rotating banner on the homepage I'd like to consider options to replicate. Aside from that, listing photos under their categorical sections and blog posts in a simple way are the other main requirements.
- My understanding is that vercel can host a couple of smaller sites under a single account. So for hosting options I'd like to know how to support the next project(s) after this.