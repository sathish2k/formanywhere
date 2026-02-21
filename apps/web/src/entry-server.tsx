import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.svg" />
          <style>{`
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 400 800;
              font-display: swap;
              src: url(/fonts/inter-latin.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
          `}</style>
          <script>{`
            (function() {
              var t = localStorage.getItem("formanywhere-theme") || "green";
              document.documentElement.setAttribute("data-theme", t);
            })();
          `}</script>
          {assets}
        </head>
        <body>
          <a href="#main-content" class="skip-link">Skip to main content</a>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
