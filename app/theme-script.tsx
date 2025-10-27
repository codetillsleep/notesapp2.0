// app/theme-script.tsx
import Script from "next/script";

export default function ThemeScript() {
  const code = `
    (function() {
      try {
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = storedTheme || (systemPrefersDark ? 'dark' : 'light');

        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.style.backgroundColor = '#1a1a1a';
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.style.backgroundColor = '#faf9f8';
        }

        // mark theme as loaded to enable transitions
        document.documentElement.dataset.themeLoaded = "true";
      } catch (_) {}
    })();
  `;

  return (
    <Script id="theme-script" strategy="beforeInteractive">
      {code}
    </Script>
  );
}
