
import React, { useState } from 'react';
import { Bond } from '../App';

interface EducationProps {
  marketBonds: Bond[];
  onNavigate?: (view: string) => void;
}

const Education: React.FC<EducationProps> = ({ marketBonds, onNavigate }) => {
  const exampleBond = marketBonds[0];
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      <header className="mb-24 text-center">
        <h1 className="text-huge font-black uppercase mb-4 tracking-tighter">
          INDIA <span className="text-orange-500 italic">SECURE.</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">
          Navigating the <span className="text-white">G-Sec</span> and <span className="text-white">SDL</span> market on-chain.
        </p>
      </header>

      {/* Introduction Grid */}
      <div className="grid md:grid-cols-2 gap-24 items-start mb-32">
        <section className="space-y-8">
          <div className="text-orange-500 font-black text-6xl opacity-20">01</div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">What are G-Secs?</h2>
          <p className="text-zinc-400 leading-relaxed text-lg">
            Government Securities (G-Secs) are tradable instruments issued by the Central Government or State Governments. They acknowledge the Government's debt obligation. At <span className="text-white">bondbuy</span>, we use Solana to make these institution-only assets available for just <span className="text-orange-500 font-black">₹100</span>.
          </p>
          <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-orange-500">Key Features</h3>
            <ul className="space-y-2 text-zinc-400">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Backed by the sovereign guarantee of the Government of India</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Zero default risk - safest investment in the country</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Fixed coupon payments at regular intervals</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">•</span>
                <span>Tradable on secondary markets for liquidity</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-8">
          <div className="text-orange-500 font-black text-6xl opacity-20">02</div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">Yield Accrual</h2>
          <p className="text-zinc-400 leading-relaxed text-lg">
            For <span className="text-white">{exampleBond.name}</span>, the yield is calculated at a fixed APY of <span className="text-white font-bold">{exampleBond.apy}%</span>. Unlike traditional banks that credit interest quarterly, our system updates your accrued ₹ balance <span className="text-white">every second</span>.
          </p>
          <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-orange-500">Calculation Example</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Investment Amount:</span>
                <span className="text-white font-bold">₹10,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Annual Yield (7.18%):</span>
                <span className="text-white font-bold">₹718/year</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Monthly Accrual:</span>
                <span className="text-orange-500 font-bold">₹59.83/month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Daily Accrual:</span>
                <span className="text-orange-500 font-bold">₹1.97/day</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Types of Government Securities */}
      <section className="mb-32">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 text-center">Types of Government Securities</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 hover:border-orange-500/30 transition-all">
            <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">🏛️</span>
            </div>
            <h3 className="text-2xl font-black uppercase mb-4">Treasury Bills</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Short-term instruments with maturity periods of 91, 182, or 364 days. Issued at a discount and redeemed at face value.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Maturity:</span>
                <span className="text-white font-bold">&lt; 1 Year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Risk:</span>
                <span className="text-green-500 font-bold">Lowest</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 hover:border-orange-500/30 transition-all">
            <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">📜</span>
            </div>
            <h3 className="text-2xl font-black uppercase mb-4">Dated Securities</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Long-term bonds with fixed or floating coupon rates. These form the bulk of government borrowing.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Maturity:</span>
                <span className="text-white font-bold">5-40 Years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Coupon:</span>
                <span className="text-orange-500 font-bold">Fixed/Floating</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 hover:border-orange-500/30 transition-all">
            <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">🏙️</span>
            </div>
            <h3 className="text-2xl font-black uppercase mb-4">State Dev. Loans</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Issued by state governments for infrastructure and development projects. Slightly higher yields than central G-Secs.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Maturity:</span>
                <span className="text-white font-bold">5-20 Years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Yield Premium:</span>
                <span className="text-orange-500 font-bold">+0.25-0.50%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Comparison */}
      <section className="mb-32">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 text-center italic">Institutional Comparison</h2>
        <div className="grid grid-cols-4 border border-white/10 rounded-3xl overflow-hidden bg-zinc-900/20">
          {['Metric', 'Bank FD', 'Retail G-Sec', 'bondbuy'].map((h, i) => (
            <div key={i} className="bg-zinc-900/50 p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 border-r border-white/10 last:border-0">{h}</div>
          ))}
          
          <div className="p-8 border-t border-r border-white/10 font-bold">Minimum</div>
          <div className="p-8 border-t border-r border-white/10 text-zinc-500">₹10,000</div>
          <div className="p-8 border-t border-r border-white/10 text-zinc-500">₹10,000</div>
          <div className="p-8 border-t border-white/10 text-orange-500 font-black">₹100.00</div>

          <div className="p-8 border-t border-r border-white/10 font-bold">Liquidity</div>
          <div className="p-8 border-t border-r border-white/10 text-zinc-500">Locked / Penalty</div>
          <div className="p-8 border-t border-r border-white/10 text-zinc-500">T+2 Days</div>
          <div className="p-8 border-t border-white/10 text-white font-black">Instant on SOL</div>

          <div className="p-8 border-t border-r border-white/10 font-bold">Transparency</div>
          <div className="p-8 border-t border-r border-white/10 text-zinc-500">Bank Records</div>
          <div className="p-8 border-t border-r border-white/10 text-zinc-500">Demat Account</div>
          <div className="p-8 border-t border-white/10 text-white font-black">On-Chain</div>

          <div className="p-8 border-t border-r border-white/10 font-bold">Fractional</div>
          <div className="p-8 border-t border-r border-white/10 text-zinc-500">No</div>
          <div className="p-8 border-t border-r border-white/10 text-zinc-500">No</div>
          <div className="p-8 border-t border-white/10 text-white font-black">Yes</div>
        </div>
      </section>

      {/* Blockchain Technology Section */}
      <section className="mb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Why Blockchain?</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto">
            Solana's high-performance infrastructure enables instant settlement, fractional ownership, and transparent verification.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-3xl p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black uppercase mb-3">Instant Settlement</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Solana processes transactions in under 400ms with finality in seconds. No more waiting for T+2 settlement cycles or bank processing delays.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-3xl p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black uppercase mb-3">Transparent Ownership</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Every bond purchase is recorded on-chain with a unique NFT certificate. Verify your holdings anytime on Solana Explorer without intermediaries.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-3xl p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black uppercase mb-3">Fractional Access</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Smart contracts enable division of bonds into micro-units. Invest ₹100 instead of ₹10,000 minimum, democratizing access to government securities.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-3xl p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black uppercase mb-3">Global Accessibility</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Access Indian government bonds from anywhere in the world with just a Phantom wallet. No bank account, KYC delays, or geographic restrictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk & Safety Section */}
      <section className="mb-32">
        <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-12 lg:p-16">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-12">Risk & Safety</h2>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-black uppercase mb-6 text-orange-500">Credit Risk: ZERO</h3>
              <p className="text-zinc-400 leading-relaxed mb-6">
                Government Securities are backed by the sovereign guarantee of the Government of India. The government has never defaulted on its debt obligations, making G-Secs the safest investment instrument in the country.
              </p>
              <div className="bg-black/50 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-green-500 text-2xl">✓</span>
                  <span className="text-sm font-bold text-white">Sovereign Guarantee</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  The Government of India's ability to print currency and levy taxes ensures repayment capacity under all economic conditions.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black uppercase mb-6 text-orange-500">Smart Contract Security</h3>
              <p className="text-zinc-400 leading-relaxed mb-6">
                Our platform uses Solana's battle-tested infrastructure with transparent, verifiable transactions. Every bond purchase creates an immutable on-chain record.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="text-zinc-400">Non-custodial: You control your private keys</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="text-zinc-400">Transparent: All transactions visible on Solana Explorer</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="text-zinc-400">Immutable: Records cannot be altered or deleted</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="text-sm font-black uppercase mb-2 text-orange-500">Important Disclaimer</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  This is an educational demo running on Solana Devnet. It is not a real financial product and does not involve actual government securities. Always consult with a financial advisor before making investment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-32">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {[
            {
              id: 'faq1',
              question: 'How is bondbuy different from traditional bond platforms?',
              answer: 'bondbuy leverages blockchain technology to enable fractional ownership starting at just ₹100, compared to ₹10,000 minimums on traditional platforms. We offer instant settlement, transparent on-chain records, and 24/7 accessibility without intermediaries.'
            },
            {
              id: 'faq2',
              question: 'What happens to my bonds at maturity?',
              answer: 'At maturity, you receive your principal amount plus all accrued interest. The bond NFT in your wallet serves as proof of ownership. In a production system, the smart contract would automatically transfer the maturity amount to your wallet.'
            },
            {
              id: 'faq3',
              question: 'Can I sell my bonds before maturity?',
              answer: 'Yes! Since your bonds are represented as NFTs on Solana, they can be traded on secondary markets. This provides liquidity that traditional bonds lack, though this feature is conceptual in the current demo version.'
            },
            {
              id: 'faq4',
              question: 'How is yield calculated and distributed?',
              answer: 'Yield is calculated using the fixed APY rate of each bond. The system tracks accrual in real-time based on the time elapsed since purchase. In a production environment, yields would be distributed as per the bond\'s coupon payment schedule.'
            },
            {
              id: 'faq5',
              question: 'Is my investment protected by the government?',
              answer: 'Real government securities are backed by the sovereign guarantee of the Government of India. However, bondbuy is currently a demo platform on Solana Devnet and does not involve actual government securities or real money.'
            },
            {
              id: 'faq6',
              question: 'What are the tax implications?',
              answer: 'In India, interest from government securities is taxable as per your income tax slab. Long-term capital gains (holding period > 1 year) are taxed at 10% without indexation. Consult a tax advisor for personalized guidance.'
            }
          ].map((faq) => (
            <div key={faq.id} className="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all">
              <button
                onClick={() => toggleSection(faq.id)}
                className="w-full p-8 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-black uppercase tracking-tight pr-4">{faq.question}</h3>
                <svg 
                  className={`w-6 h-6 text-orange-500 flex-shrink-0 transition-transform ${expandedSection === faq.id ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === faq.id && (
                <div className="px-8 pb-8">
                  <p className="text-zinc-400 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Getting Started Guide */}
      <section className="mb-32">
        <div className="bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/20 rounded-[3rem] p-12 lg:p-16">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Getting Started</h2>
          <p className="text-zinc-500 mb-12 text-lg">Follow these simple steps to start investing in government bonds on Solana</p>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-black font-black text-xl">1</div>
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 pt-12 h-full">
                <h3 className="text-xl font-black uppercase mb-4">Install Phantom</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Download the Phantom wallet extension for Chrome, Firefox, or Brave. Create a new wallet and securely store your recovery phrase.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-black font-black text-xl">2</div>
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 pt-12 h-full">
                <h3 className="text-xl font-black uppercase mb-4">Get Devnet SOL</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Visit Solana's faucet to receive free Devnet SOL for testing. Switch your Phantom wallet to Devnet mode in settings.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-black font-black text-xl">3</div>
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 pt-12 h-full">
                <h3 className="text-xl font-black uppercase mb-4">Connect Wallet</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Click "Connect Wallet" on bondbuy and approve the connection request in your Phantom extension popup.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-black font-black text-xl">4</div>
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 pt-12 h-full">
                <h3 className="text-xl font-black uppercase mb-4">Start Investing</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Browse available bonds, select your investment amount, and confirm the transaction to mint your bond NFT.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="bg-zinc-900 p-20 rounded-[4rem] text-center border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-transparent" />
        <h2 className="text-6xl font-black uppercase mb-8">Secure your ₹ wealth.</h2>
        <p className="text-zinc-500 max-w-2xl mx-auto mb-12 text-xl italic">
          Join the protocol bringing India's most stable assets to the global liquidity of Solana Devnet.
        </p>
        <button 
          onClick={() => onNavigate?.('dashboard')}
          className="bg-orange-500 text-black px-16 py-6 rounded-full font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl shadow-orange-500/10"
        >
          Launch Dashboard
        </button>
      </div>
    </div>
  );
};

export default Education;
