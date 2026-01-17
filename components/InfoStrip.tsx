
import React from 'react';

const InfoStrip: React.FC = () => {
  const stats = [
    { label: 'Risk Level', value: 'Low Risk' },
    { label: 'Ownership', value: 'Fractional Access' },
    { label: 'Currency', value: 'Stablecoin Yield' },
    { label: 'Compliance', value: 'Transparent On-chain' },
  ];

  return (
    <section className="bg-zinc-900 border-y border-white/5 py-12 px-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col gap-2 group cursor-default">
            <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">
              {stat.label}
            </span>
            <span className="text-white text-2xl lg:text-3xl font-black uppercase tracking-tight group-hover:text-orange-500 transition-colors">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InfoStrip;
