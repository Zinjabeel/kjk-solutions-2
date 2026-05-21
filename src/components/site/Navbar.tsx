import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Menu, Search, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { CATEGORIES } from "@/data/categories";

const NAV_PRIMARY = [
  { to: "/produkter", label: "Alla produkter" },
  { to: "/begagnat", label: "Begagnat" },
  { to: "/kategori/identifiera", label: "Identifiera ställ" },
] as const;

const NAV_CATEGORIES = CATEGORIES.filter((c) =>
  ["pallstall", "hyllstall", "grenstall", "entresolplan", "arbetsplats", "pallhantering"].includes(c.slug),
);

export function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [q, setQ] = useState("");
  const totalItems = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const setCartOpen = useCartStore((s) => s.setOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      navigate({ to: "/produkter", search: { q: q.trim() } });
      setMobileOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-colors ${
        scrolled ? "border-border bg-background/95 backdrop-blur-md" : "border-transparent bg-background"
      }`}
    >
      <div className="container-tight flex h-16 items-center gap-4 lg:h-20">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center bg-charcoal text-bone font-display text-sm font-bold">
            K
          </div>
          <div className="leading-none">
            <div className="font-display text-base font-semibold tracking-tight">KJK</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Lagerprodukter
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 ml-6">
          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground"
            >
              Kategorier
              <ChevronDown className={`h-4 w-4 transition-transform ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 pt-2 w-56">
                <div className="border border-border bg-background shadow-lg py-2">
                  {NAV_CATEGORIES.map((c) => (
                    <Link
                      key={c.slug}
                      to="/kategori/$slug"
                      params={{ slug: c.slug }}
                      className="block px-4 py-2.5 text-sm hover:bg-secondary transition-colors"
                    >
                      {c.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          {NAV_PRIMARY.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-sm ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Sök produkt eller artikel…"
            className="w-full h-10 rounded-none border border-border bg-secondary/40 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-charcoal"
          />
        </form>

        <div className="flex items-center gap-1 ml-auto md:ml-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label="Meny"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-none"
            onClick={() => setCartOpen(true)}
            aria-label="Varukorg"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-safety text-safety-foreground border-0">
                {totalItems}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background max-h-[80vh] overflow-y-auto">
          <div className="container-tight py-4 space-y-3">
            <form onSubmit={onSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Sök produkt…"
                className="w-full h-10 rounded-none border border-border bg-secondary/40 pl-10 pr-3 text-sm"
              />
            </form>
            <p className="eyebrow pt-2">Kategorier</p>
            <nav className="flex flex-col">
              {NAV_CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  to="/kategori/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-sm font-medium border-b border-border"
                >
                  {c.title}
                </Link>
              ))}
            </nav>
            <nav className="flex flex-col pt-2">
              {NAV_PRIMARY.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-sm font-medium border-b border-border last:border-0"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

