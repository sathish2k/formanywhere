import { createHandler, StartServer } from "@solidjs/start/server";
// @ts-expect-error - getRequestEvent exists in solid-js/web at runtime but TS bundler resolution doesn't re-export it properly from client.d.ts
import { getRequestEvent } from "solid-js/web";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => {
      /**
       * Read theme from event.locals — set by middleware.ts which already
       * parses cookies for auth.  Reading inside the document template
       * guarantees we are within the SSR async context.
       *
       * "system" mode cannot be resolved server-side (no prefers-color-scheme),
       * so we default to "light" and let the blocking <head> script below
       * correct the attributes before the first paint.
       */
      let ssrMode: 'light' | 'dark' = 'light';
      let ssrColor: string = 'green';
      try {
        const event = getRequestEvent();
        const locals = event?.locals;
        ssrColor = locals?.themeColor ?? 'green';
        const storedMode = locals?.themeMode ?? 'system';
        ssrMode = storedMode === 'dark' ? 'dark' : 'light';
      } catch { /* keep defaults */ }

      const isDark = ssrMode === 'dark';

      return (
        <html
          lang="en"
          data-theme={ssrColor}
          data-mode={ssrMode}
          classList={{ dark: isDark }}
        >
          <head>
            {/*
              Blocking theme script — MUST be the first child of <head>.
              Runs synchronously before any stylesheet or other resource is
              applied, eliminating the flash entirely.

              For explicit dark/light cookies, the SSR <html> attrs above
              already carry the correct values and this script is a no-op.
              For "system" mode it resolves prefers-color-scheme and patches
              the default "light" SSR attrs before the first paint.
              Cookies are checked first; localStorage is a legacy fallback.
            */}
            <script>{`
              (function(){
                function gc(n){
                  var m=document.cookie.match(new RegExp('(?:^|;)\\s*'+n+'=([^;]*)'));
                  return m?decodeURIComponent(m[1]):null;
                }
                var d=document.documentElement;
                var c=gc('formanywhere-theme-color')||localStorage.getItem('formanywhere-theme-color')||'green';
                var m=gc('formanywhere-theme')||localStorage.getItem('formanywhere-theme')||'system';
                var dk=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
                d.setAttribute('data-theme',c);
                d.setAttribute('data-mode',dk?'dark':'light');
                if(dk){d.classList.add('dark');}else{d.classList.remove('dark');}
              })();
            `}</script>
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
            {assets}
          </head>
          <body>
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <div id="app">{children}</div>
            {scripts}
          </body>
        </html>
      );
    }}
  />
));
