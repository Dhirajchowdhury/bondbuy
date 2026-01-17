
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-16 px-6 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-sm">
          <div className="text-3xl font-black mb-6">bondbuy<span className="text-orange-500">.</span></div>
          <p className="text-zinc-500 text-sm font-medium leading-relaxed">
            The next generation of fixed income. Secure your future with the world's most stable assets, tokenized for everyone.
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-6">
          <div className="flex gap-8">
            <a href="#" className="text-sm font-bold uppercase tracking-widest text-white hover:text-orange-500">Twitter</a>
            <a href="#" className="text-sm font-bold uppercase tracking-widest text-white hover:text-orange-500">Discord</a>
            <a href="#" className="text-sm font-bold uppercase tracking-widest text-white hover:text-orange-500">GitHub</a>
          </div>
          <div className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] text-left md:text-right">
            © 2025 bondbuy Protocol. <br />
            This is an educational demo project. Not financial advice.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
