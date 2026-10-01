import { Sparkles, Zap, Layers, RefreshCcw } from 'lucide-react';

export function FeatureGrid() {
  return (
    <section className="py-24 border-t border-white/[0.05] bg-[#030303]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
            Stop starting from a blank page.
          </h2>
          <p className="text-slate-400 text-lg">
            Reframe.ai takes your existing ideas and perfectly adapts them to the format and constraints of every platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "1-Click Reframe",
              description: "Paste any content \u2192 get Twitter thread + LinkedIn post + newsletter in seconds.",
              icon: Sparkles
            },
            {
              title: "Format Aware",
              description: "LinkedIn posts get spacing, Twitter gets brevity, Newsletters get structure.",
              icon: Layers
            },
            {
              title: "Voice DNA",
              description: "Upload your past hits. We clone your tone, hooks, and formatting style.",
              icon: Zap
            },
            {
              title: "Lifetime Pass",
              description: "Pay once, reframe forever. No monthly fees, no usage caps, no surprises.",
              icon: RefreshCcw
            }
          ].map((feat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#09090b] border border-white/[0.08] hover:border-white/[0.15] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                <feat.icon className="w-5 h-5 text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{feat.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}