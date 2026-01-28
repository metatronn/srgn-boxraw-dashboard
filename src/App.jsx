import React, { useState, useMemo } from 'react';
import { Download, TrendingUp, Package, DollarSign, Layers } from 'lucide-react';

const App = () => {
  // --- State Configuration ---
  const [mainlineVolume, setMainlineVolume] = useState(500); // 500, 750, 1000
  const [priceLift, setPriceLift] = useState(0); // 0, 0.1, 0.2, 0.3

  // --- Data Definitions ---

  const premiumCollection = [
    { name: "Premium Boxing Glove (Tier 1)", price: 800, category: "Gloves" },
    { name: "Premium Boxing Glove (Tier 2)", price: 1000, category: "Gloves" },
    { name: "Premium Boxing Glove (Tier 3)", price: 1500, category: "Gloves" },
    { name: "Head Guard (Tier 1)", price: 600, category: "Protection" },
    { name: "Head Guard (Tier 2)", price: 800, category: "Protection" },
    { name: "Head Guard (Tier 3)", price: 1000, category: "Protection" },
    { name: "Groin Guard (Tier 1)", price: 600, category: "Protection" },
    { name: "Groin Guard (Tier 2)", price: 800, category: "Protection" },
    { name: "Groin Guard (Tier 3)", price: 1000, category: "Protection" },
    { name: "Premium Boxing Shoe (Tier 1)", price: 600, category: "Footwear" },
    { name: "Premium Boxing Shoe (Tier 2)", price: 800, category: "Footwear" },
    { name: "Premium Boxing Shoe (Tier 3)", price: 1500, category: "Footwear" },
  ];

  const mainlineBase = [
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
    { name: "Windbreaker", price: 95 },
    { name: "Track Bottoms", price: 90 },
    { name: "Track Jacket", price: 100 },
    { name: "Mainline Boxing Gloves", price: 200 },
  ];

  // --- Calculations ---

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const calculateMainline = () => {
    return mainlineBase.map(item => {
      const adjustedPrice = item.price * (1 + priceLift);
      const revenue = adjustedPrice * mainlineVolume;
      const cogs = revenue * 0.30;
      const profit = revenue - cogs;
      return {
        ...item,
        adjustedPrice,
        units: mainlineVolume,
        revenue,
        cogs,
        profit
      };
    });
  };

  const calculatePremium = () => {
    const volume = 50; // Fixed edition size
    return premiumCollection.map(item => {
      const revenue = item.price * volume;
      const cogs = revenue * 0.30;
      const profit = revenue - cogs;
      return {
        ...item,
        units: volume,
        revenue,
        cogs,
        profit
      };
    });
  };

  const mainlineData = useMemo(() => calculateMainline(), [mainlineVolume, priceLift]);
  const premiumData = useMemo(() => calculatePremium(), []);

  const totalMainlineRevenue = mainlineData.reduce((acc, item) => acc + item.revenue, 0);
  const totalPremiumRevenue = premiumData.reduce((acc, item) => acc + item.revenue, 0);
  const totalRevenue = totalMainlineRevenue + totalPremiumRevenue;

  const totalMainlineProfit = mainlineData.reduce((acc, item) => acc + item.profit, 0);
  const totalPremiumProfit = premiumData.reduce((acc, item) => acc + item.profit, 0);
  const totalProfit = totalMainlineProfit + totalPremiumProfit;

  // --- CSV Export Function ---

  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header
    csvContent += "Collection,Scenario Name,SKU Name,Retail Price,Price Lift %,Units,Gross Revenue,COGS (30%),Gross Profit\n";

    // 1. Add Premium (Fixed)
    premiumData.forEach(item => {
       csvContent += `Premium,Fixed Edition,${item.name},${item.price},0%,${item.units},${item.revenue},${item.cogs},${item.profit}\n`;
    });

    // 2. Add Mainline (All Scenarios Loop)
    const volumeScenarios = [500, 750, 1000];
    const priceScenarios = [0, 0.1, 0.2, 0.3];

    priceScenarios.forEach(lift => {
      volumeScenarios.forEach(vol => {
        mainlineBase.forEach(item => {
          const adjPrice = item.price * (1 + lift);
          const rev = adjPrice * vol;
          const cogs = rev * 0.30;
          const prof = rev - cogs;
          const scenarioName = `Mainline (+${lift * 100}% Price / ${vol} Units)`;
          
          csvContent += `Mainline,${scenarioName},${item.name},${adjPrice.toFixed(2)},${lift * 100}%,${vol},${rev.toFixed(2)},${cogs.toFixed(2)},${prof.toFixed(2)}\n`;
        });
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "SRGN_BOXRAW_Projections.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SRGN × BOXRAW</h1>
            <p className="text-slate-500 text-sm mt-1">Commercial Projections & Scenario Planning</p>
          </div>
          <button 
            onClick={downloadCSV}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Download size={16} />
            Download Full CSV Report
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">
              Mainline Volume Scenario (Units per SKU)
            </label>
            <div className="flex gap-2">
              {[500, 750, 1000].map(vol => (
                <button
                  key={vol}
                  onClick={() => setMainlineVolume(vol)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    mainlineVolume === vol 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {vol} Units
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">
              Mainline Pricing Strategy
            </label>
            <div className="flex gap-2">
              {[0, 0.1, 0.2, 0.3].map(lift => (
                <button
                  key={lift}
                  onClick={() => setPriceLift(lift)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    priceLift === lift 
                      ? 'bg-emerald-600 text-white border-emerald-600' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {lift === 0 ? 'Base' : `+${lift * 100}%`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl text-white shadow-md">
            <div className="flex items-center gap-3 mb-2 opacity-80">
              <Layers size={18} />
              <span className="text-sm font-medium">Total Revenue</span>
            </div>
            <div className="text-3xl font-bold">{formatCurrency(totalRevenue)}</div>
            <div className="text-xs text-slate-300 mt-2">Combined Premium + Mainline</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-slate-500">
              <TrendingUp size={18} />
              <span className="text-sm font-medium">Estimated COGS (30%)</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{formatCurrency(totalRevenue * 0.3)}</div>
            <div className="text-xs text-slate-400 mt-2">Deducted from Revenue</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-slate-500">
              <DollarSign size={18} />
              <span className="text-sm font-medium">Total Gross Profit</span>
            </div>
            <div className="text-3xl font-bold text-emerald-600">{formatCurrency(totalProfit)}</div>
            <div className="text-xs text-slate-400 mt-2">70% Margin</div>
          </div>
        </div>

        {/* Mainline Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Package size={18} className="text-blue-500"/>
              Mainline Collection
            </h2>
            <div className="text-sm text-slate-500">
              Scenario: {mainlineVolume} units @ {priceLift === 0 ? 'Base Price' : `+${priceLift * 100}% Retail`}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 font-semibold">SKU Name</th>
                  <th className="px-6 py-3 font-semibold text-right">Retail Price</th>
                  <th className="px-6 py-3 font-semibold text-right">Units</th>
                  <th className="px-6 py-3 font-semibold text-right">Revenue</th>
                  <th className="px-6 py-3 font-semibold text-right text-red-400">COGS (30%)</th>
                  <th className="px-6 py-3 font-semibold text-right text-emerald-600">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mainlineData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="px-6 py-3 text-right">{formatCurrency(item.adjustedPrice)}</td>
                    <td className="px-6 py-3 text-right">{item.units}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCurrency(item.revenue)}</td>
                    <td className="px-6 py-3 text-right text-red-400">-{formatCurrency(item.cogs)}</td>
                    <td className="px-6 py-3 text-right text-emerald-600 font-medium">{formatCurrency(item.profit)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                <tr>
                  <td className="px-6 py-3">MAINLINE TOTALS</td>
                  <td className="px-6 py-3 text-right">-</td>
                  <td className="px-6 py-3 text-right">{mainlineData.reduce((a,b)=>a+b.units,0)}</td>
                  <td className="px-6 py-3 text-right">{formatCurrency(totalMainlineRevenue)}</td>
                  <td className="px-6 py-3 text-right text-red-500">-{formatCurrency(totalMainlineRevenue * 0.3)}</td>
                  <td className="px-6 py-3 text-right text-emerald-700">{formatCurrency(totalMainlineProfit)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Premium Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-12">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Package size={18} className="text-amber-500"/>
              Premium Collection (Limited)
            </h2>
            <div className="text-sm text-slate-500">
              Fixed: 50 Units per SKU
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 font-semibold">SKU Name</th>
                  <th className="px-6 py-3 font-semibold text-right">Retail Price</th>
                  <th className="px-6 py-3 font-semibold text-right">Units</th>
                  <th className="px-6 py-3 font-semibold text-right">Revenue</th>
                  <th className="px-6 py-3 font-semibold text-right text-red-400">COGS (30%)</th>
                  <th className="px-6 py-3 font-semibold text-right text-emerald-600">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {premiumData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="px-6 py-3 text-right">{formatCurrency(item.price)}</td>
                    <td className="px-6 py-3 text-right">{item.units}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCurrency(item.revenue)}</td>
                    <td className="px-6 py-3 text-right text-red-400">-{formatCurrency(item.cogs)}</td>
                    <td className="px-6 py-3 text-right text-emerald-600 font-medium">{formatCurrency(item.profit)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                <tr>
                  <td className="px-6 py-3">PREMIUM TOTALS</td>
                  <td className="px-6 py-3 text-right">-</td>
                  <td className="px-6 py-3 text-right">{premiumData.reduce((a,b)=>a+b.units,0)}</td>
                  <td className="px-6 py-3 text-right">{formatCurrency(totalPremiumRevenue)}</td>
                  <td className="px-6 py-3 text-right text-red-500">-{formatCurrency(totalPremiumRevenue * 0.3)}</td>
                  <td className="px-6 py-3 text-right text-emerald-700">{formatCurrency(totalPremiumProfit)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;