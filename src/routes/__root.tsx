import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { useCartSync } from "@/hooks/useCartSync";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 font-display text-5xl">Sidan saknas</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sidan du letar efter finns inte eller har flyttats.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center bg-charcoal px-5 py-3 text-sm font-medium text-bone hover:bg-charcoal/90"
        >
          Till startsidan
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Något gick fel</p>
        <h1 className="mt-3 font-display text-3xl">Sidan kunde inte laddas</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="bg-charcoal px-5 py-3 text-sm font-medium text-bone hover:bg-charcoal/90"
          >
            Försök igen
          </button>
          <a href="/" className="border border-border px-5 py-3 text-sm font-medium hover:bg-secondary">
            Hem
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "KJK Lagerprodukter AB — Säkra, effektiva och hållbara lagerlösningar" },
      {
        name: "description",
        content:
          "Premier svensk leverantör av nya och begagnade pallställ, hyllställ, grenställ och entresolplan. Projektering, montage och besiktning sedan 1972.",
      },
      { property: "og:site_name", content: "KJK Lagerprodukter AB" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "KJK Lagerprodukter AB" },
      {
        property: "og:description",
        content:
          "Nya och begagnade lagerinredningar — pallställ, hyllställ, grenställ, entresolplan. Sverige.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#1f1f23" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "KJK Lagerprodukter AB",
          url: "/",
          description:
            "Svensk leverantör av nya och begagnade lagerinredningar — pallställ, hyllställ, grenställ, entresolplan.",
          areaServed: "SE",
          foundingDate: "1972",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AppShell() {
  useCartSync();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toaster position="top-center" />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}
