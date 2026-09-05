import React, { useState } from 'react';
import { HOMERIC_CATALOG } from './data/catalogData';
import ShipViewer3D from './components/ShipViewer3D';
import HomericMap from './components/HomericMap';
import ArcheologyAndAgent from './components/ArcheologyAndAgent';
import { Anchor, Shield, Users, Compass } from 'lucide-react';

export default function App() {
  const [selectedContingent, setSelectedContingent] = useState(HOMERIC_CATALOG.contingents[0]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between border-b border-amber-900/50 pb-4 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-400 tracking-wide flex items-center gap-3">
            <Anchor className="w-7 h-7 text-amber-500" /> Catalog of Ships (Iliad Book II) 3D Explorer
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Late Bronze Age Mycenaean Naval Architecture, Homeric Geography & Archaeological Intelligence
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 text-xs text-amber-200">
          <div className="flex items-center gap-1.5">
            <Anchor className="w-4 h-4 text-amber-400" />
            <span className="font-bold">{HOMERIC_CATALOG.summary.totalShips}</span> Total Ships
          </div>
          <div className="h-4 w-[1px] bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="font-bold">~100,000</span> Achaean Troops
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 h-[480px] flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
            <Compass className="w-4 h-4" /> Achaean Contingents
          </h3>
          <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
            {HOMERIC_CATALOG.contingents.map((item) => {
              const isSelected = selectedContingent.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedContingent(item)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between border ${
                    isSelected 
                      ? 'bg-amber-950/60 border-amber-500/80 text-amber-200 shadow' 
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div>
                    <span className="font-bold block">{item.name}</span>
                    <span className="text-[10px] text-slate-400">{item.leaders.join(", ")}</span>
                  </div>
                  <span className="bg-slate-900 px-2 py-1 rounded text-[11px] font-mono text-amber-400 border border-slate-800">
                    {item.ships} ships
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="lg:col-span-9 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ShipViewer3D selectedContingent={selectedContingent} />
            <HomericMap 
              contingents={HOMERIC_CATALOG.contingents} 
              selectedContingent={selectedContingent} 
              onSelectContingent={setSelectedContingent} 
            />
          </div>

          <ArcheologyAndAgent 
            catalogData={HOMERIC_CATALOG} 
            selectedContingent={selectedContingent} 
          />
        </section>
      </main>
    </div>
  );
}
