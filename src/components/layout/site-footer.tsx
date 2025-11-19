import Link from "next/link";

const LINKS = [
  {
    title: "Product",
    items: ["Curriculum", "Pulse Console", "Cohorts", "Playbooks"],
  },
  {
    title: "Inspiration",
    items: ["hyve.system", "p5.js", "trae.ai", "Koto Studio"],
  },
  {
    title: "Company",
    items: ["Studios", "Residency", "Press", "Support"],
  },
];

export function SiteFooter() {
  return (
    <footer id="footer" className="border-t border-white/5 bg-black/40 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 md:flex-row md:justify-between">
        <div className="max-w-sm space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Synapse LMS</p>
          <p className="text-3xl font-semibold text-white">
            Learning that feels cinematic yet operationally exact.
          </p>
          <p className="text-sm text-white/60">
            Footer choreography inspired by trae.ai: soft gradients, precise typography, and
            conversational CTAs.
          </p>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-8 text-sm text-white/70 md:grid-cols-3">
          {LINKS.map((column) => (
            <div key={column.title} className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                {column.title}
              </p>
              <ul className="space-y-2">
                {column.items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="transition hover:text-white">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-4 border-t border-white/5 px-4 pt-8 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} Synapse Collective</span>
        <span>Crafted with references from hyve.system · p5.js · trae.ai · A24</span>
      </div>
    </footer>
  );
}

