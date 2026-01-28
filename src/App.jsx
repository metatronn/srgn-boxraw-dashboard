import { useMemo, useState } from "react";

const money = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const percent = (n) => `${Math.round(n * 100)}%`;

const SKUS = [
  { name: "Hand Wraps", price: 21 },
  { name: "Hoodie (Style A)", price: 95 },
  { name: "Hoodie (Style B)", price: 95 },
  { name: "Sweat Pants (Style A)", price: 85 },
  { name: "Sweat Pants (Style B)", price: 85 },
  { name: "Shorts (Style A)", price: 40 },
  { name: "Shorts (Style B)", price: 40 },
  { name: "T-Shirt (Style A)", price: 45 },
  { name: "T-Shirt (Style B)", price: 45 },
  { name: "Socks", price: 31 },
  { name: "Impello Boot", price: 240 },
  { name: "Lifestyle Sneaker", price: 200 },
  { name: "Windbreaker", price: 160 },
];

function downloadCSV(rows) {
  const header = ["SKU", "Retail Price", "Units", "Revenue", "COGS (30%)", "Profit"];
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [
        `"${r.name.replaceAll('"', '""')}"`,
        r.price,
        r.units,
        r.revenue,
        r.cogs,
        r.profit,
      ].join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "srgn-boxraw-projections.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [units, setUnits] = useState(500); // per SKU
  const [priceLift, setPriceLift] = useState(0); // 0, .1, .2, .3
  const cogsRate = 0.3;

  const rows = useMemo(() => {
    return SKUS.map((s) => {
      const price = Math.round(s.price * (1 + priceLift));
      const revenue = price * units;
      const cogs = Math.round(revenue * cogsRate);
      const profit = revenue - cogs;
      return { ...s, price, units, revenue, cogs, profit };
    });
  }, [units, priceLift]);

  const totals = useMemo(() => {
    const revenue = rows.reduce((a, r) => a + r.revenue, 0);
    const cogs = rows.reduce((a, r) => a + r.cogs, 0);
    const profit = revenue - cogs;
    const margin = revenue ? profit / revenue : 0;
    return { revenue, cogs, profit, margin };
  }, [rows]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-semibold tracking-tight">
              SRGN <span className="text-white/40">×</span> BOXRAW
            </h1>
            <span className="text-sm text-white/50">
              Commercial Projections & Scenario Planning
            </span>
          </div>

          <button
            onClick={() => downloadCSV(rows)}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-white/90 active:bg-white/80"
          >
            Download CSV
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Controls */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs font-medium text-white/60">Volume Scenario</div>
            <div className="mt-3 flex gap-2">
              {[500, 750, 1000].map((u) => (
                <button
                  key={u}
                  onClick={() => setUnits(u)}
                  className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    units === u
                      ? "bg-white text-zinc-950"
                      : "bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {u} / SKU
                </button>
              ))}
            </div>
            <div className="mt-3 text-xs text-white/40">
              Units apply per SKU (same volume per product)
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs font-medium text-white/60">Pricing Strategy</div>
            <div className="mt-3 flex gap-2">
              {[
                { label: "Base", v: 0 },
                { label: "+10%", v: 0.1 },
                { label: "+20%", v: 0.2 },
                { label: "+30%", v: 0.3 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => setPriceLift(p.v)}
                  className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    priceLift === p.v
                      ? "bg-white text-zinc-950"
                      : "bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="mt-3 text-xs text-white/40">
              Adjusts retail prices across all SKUs
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs font-medium text-white/60">Summary</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-black/30 p-3">
                <div className="text-[11px] text-white/50">Total Revenue</div>
                <div className="mt-1 text-lg font-semibold">{money(totals.revenue)}</div>
              </div>
              <div className="rounded-xl bg-black/30 p-3">
                <div className="text-[11px] text-white/50">Est. COGS (30%)</div>
                <div className="mt-1 text-lg font-semibold">{money(totals.cogs)}</div>
              </div>
              <div className="rounded-xl bg-black/30 p-3">
                <div className="text-[11px] text-white/50">Gross Profit</div>
                <div className="mt-1 text-lg font-semibold">{money(totals.profit)}</div>
              </div>
              <div className="rounded-xl bg-black/30 p-3">
                <div className="text-[11px] text-white/50">Margin</div>
                <div className="mt-1 text-lg font-semibold">{percent(totals.margin)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-semibold">Mainline Collection</div>
              <div className="text-xs text-white/50">
                Scenario: {units} units / SKU • Pricing:{" "}
                {priceLift === 0 ? "Base" : `+${Math.round(priceLift * 100)}%`}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border-t border-white/10">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="bg-black/30 text-xs uppercase tracking-wide text-white/50">
                <tr>
                  <th className="px-5 py-3">SKU</th>
                  <th className="px-5 py-3">Retail</th>
                  <th className="px-5 py-3">Units</th>
                  <th className="px-5 py-3">Revenue</th>
                  <th className="px-5 py-3">COGS (30%)</th>
                  <th className="px-5 py-3">Profit</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className="border-t border-white/10">
                    <td className="px-5 py-3 font-medium">{r.name}</td>
                    <td className="px-5 py-3">{money(r.price)}</td>
                    <td className="px-5 py-3">{r.units.toLocaleString()}</td>
                    <td className="px-5 py-3">{money(r.revenue)}</td>
                    <td className="px-5 py-3 text-white/70">-{money(r.cogs)}</td>
                    <td className="px-5 py-3 font-semibold">{money(r.profit)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/10 bg-black/30">
                  <td className="px-5 py-3 text-xs uppercase tracking-wide text-white/50">
                    Totals
                  </td>
                  <td className="px-5 py-3" />
                  <td className="px-5 py-3" />
                  <td className="px-5 py-3 font-semibold">{money(totals.revenue)}</td>
                  <td className="px-5 py-3 font-semibold text-white/80">
                    -{money(totals.cogs)}
                  </td>
                  <td className="px-5 py-3 font-semibold">{money(totals.profit)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="mt-6 text-xs text-white/40">
          Note: COGS is modeled at a flat 30% for planning.
        </div>
      </main>
    </div>
  );
}
