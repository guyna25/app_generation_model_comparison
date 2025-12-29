export const ItemDisplayAsset = () => (
  <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/70 p-4 shadow-xl shadow-slate-950/70">
    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Preview</p>
    <div className="mt-3 grid gap-3">
      <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3 shadow-inner shadow-slate-950/60">
        <p className="text-sm font-semibold text-white">Sprint board</p>
        <p className="text-xs text-slate-400">Organize milestones</p>
      </div>
      <div className="rounded-2xl border border-slate-800/60 bg-gradient-to-r from-slate-900/80 to-slate-900/50 p-3">
        <p className="text-sm font-semibold text-cyan-200">Focus on what matters</p>
        <p className="text-xs uppercase tracking-wide text-slate-500">Always synced locally</p>
      </div>
    </div>
  </div>
);

