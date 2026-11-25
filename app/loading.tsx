export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      <div className="h-8 w-64 rounded-xl bg-slate-800/70" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl border border-slate-800 bg-slate-950/60" />
        ))}
      </div>
      <div className="h-72 rounded-2xl border border-slate-800 bg-slate-950/60" />
    </div>
  );
}
