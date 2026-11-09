# Proposal design source

Next.js and BoardUI page that prints to the one-page proposal PDF. Body text is 14px, which prints at 10.5pt on US Letter.

```bash
npm install
npx next build && npx next start -p 3123
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer \
  --print-to-pdf=proposal.pdf http://localhost:3123
```

The page is `app/page.tsx`, the flowsheet figure is `components/proposal/flowsheet-strip.tsx`, and the page size and margins are in `app/print.css`.
