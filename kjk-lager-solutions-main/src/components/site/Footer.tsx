import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/data/categories";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-charcoal text-bone">
      <div className="container-tight py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center bg-safety text-safety-foreground font-display text-base font-bold">
              K
            </div>
            <div>
              <div className="font-display text-lg font-semibold">KJK Lagerprodukter AB</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/60">
                Sedan 1972 · Sverige
              </div>
            </div>
          </div>
          <p className="mt-6 max-w-md text-sm text-bone/70 leading-relaxed">
            Vi säljer och köper ny och begagnad lagerinredning — pallställ, hyllställ, grenställ och tillbehör.
            Projektering, montage och besiktning för lager och industri i hela Sverige.
          </p>
          <p className="mt-4 text-sm text-bone/60">
            <a href="tel:0854353155" className="hover:text-safety transition-colors">
              08-543 531 55
            </a>
            {" · "}
            <a href="mailto:info@kjk.se" className="hover:text-safety transition-colors">
              info@kjk.se
            </a>
          </p>
        </div>

        <div>
          <h4 className="eyebrow text-bone/60 mb-4">Sortiment</h4>
          <ul className="space-y-2.5 text-sm columns-1">
            {CATEGORIES.slice(0, 8).map((c) => (
              <li key={c.slug}>
                <Link
                  to="/kategori/$slug"
                  params={{ slug: c.slug }}
                  className="text-bone/80 hover:text-safety transition-colors"
                >
                  {c.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/begagnat" className="text-bone/80 hover:text-safety transition-colors">
                Begagnat
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-bone/60 mb-4">Tjänster</h4>
          <ul className="space-y-2.5 text-sm text-bone/80">
            <li>Projektering &amp; lagerlayout</li>
            <li>Montage &amp; demontering</li>
            <li>Besiktning SS-EN 15635</li>
            <li>Köp av begagnad inredning</li>
            <li>
              <a
                href="https://kjklager.se"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-safety transition-colors"
              >
                kjklager.se
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-bone/10">
        <div className="container-tight py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-bone/50 font-mono">
          <span>© {new Date().getFullYear()} KJK Lagerprodukter AB</span>
          <span>Stockholm · Göteborg · Malmö · 0589-153 55</span>
        </div>
      </div>
    </footer>
  );
}

