import React, { useState } from 'react';

interface SIPPlan {
  id: string;
  bondName: string;
  monthlyAmount: number;
  duration: number; // months
  expectedReturns: number;
  startDate: string;
  status: 'active' | 'paused' | 'completed';
}

interface SIPPageProps {
  balance: number;
  weilBalance: number;
}

const SIPPage: React.FC<SIPPageProps> = ({ balance, weilBalance }) => {
  const [selectedBond, setSelectedBond] = useState<string>('');
  const [monthlyAmount, setMonthlyAmount] = useState<string>('');
  const [duration, setDuration] = useState<string>('12');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState<string | null>(null);
  const [newMonthlyAmount, setNewMonthlyAmount] = useState<string>('');

  // Mock SIP plans with state management
  const [sipPlans, setSipPlans] = useState<SIPPlan[]>([
    {
      id: 'sip-1',
      bondName: '10Y Government Bond',
      monthlyAmount: 5000,
      duration: 24,
      expectedReturns: 142800,
      startDate: '2025-01-01',
      status: 'active'
    },
    {
      id: 'sip-2',
      bondName: '5Y State Development Loan',
      monthlyAmount: 3000,
      duration: 12,
      expectedReturns: 38520,
      startDate: '2024-12-01',
      status: 'active'
    }
  ]);

  const availableBonds = [
    { id: 'bond-1', name: '10Y Government Bond', apy: 7.18 },
    { id: 'bond-2', name: '5Y State Development Loan', apy: 7.35 },
    { id: 'bond-3', name: '15Y Infrastructure Bond', apy: 7.89 },
    { id: 'bond-4', name: '3Y Treasury Bond', apy: 6.95 }
  ];

  const calculateReturns = (monthly: number, months: number, apy: number) => {
    const monthlyRate = apy / 100 / 12;
    const totalInvested = monthly * months;
    const futureValue = monthly * (((1 + monthlyRate) ** months - 1) / monthlyRate);
    return { totalInvested, futureValue, returns: futureValue - totalInvested };
  };

  const handleCreateSIP = () => {
    if (!selectedBond || !monthlyAmount || !duration) {
      alert('Please fill all fields');
      return;
    }

    const bond = availableBonds.find(b => b.id === selectedBond);
    if (!bond) return;

    const { futureValue } = calculateReturns(Number(monthlyAmount), Number(duration), bond.apy);
    
    // Create new SIP plan
    const newSIP: SIPPlan = {
      id: `sip-${Date.now()}`,
      bondName: bond.name,
      monthlyAmount: Number(monthlyAmount),
      duration: Number(duration),
      expectedReturns: futureValue,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setSipPlans(prev => [...prev, newSIP]);
    
    alert(`SIP Created Successfully!\n\nBond: ${bond.name}\nMonthly: ₹${monthlyAmount}\nDuration: ${duration} months\nExpected Returns: ₹${futureValue.toLocaleString('en-IN')}`);
    
    setShowCreateForm(false);
    setSelectedBond('');
    setMonthlyAmount('');
    setDuration('12');
  };

  const handlePauseSIP = (sipId: string) => {
    setSipPlans(prev => prev.map(sip => 
      sip.id === sipId 
        ? { ...sip, status: sip.status === 'active' ? 'paused' : 'active' }
        : sip
    ));
    
    const sip = sipPlans.find(s => s.id === sipId);
    const newStatus = sip?.status === 'active' ? 'paused' : 'active';
    alert(`SIP ${newStatus === 'paused' ? 'paused' : 'resumed'} successfully!`);
  };

  const handleModifyAmount = (sipId: string) => {
    setShowModifyModal(sipId);
    const sip = sipPlans.find(s => s.id === sipId);
    setNewMonthlyAmount(sip?.monthlyAmount.toString() || '');
  };

  const confirmModifyAmount = () => {
    if (!showModifyModal || !newMonthlyAmount) return;

    setSipPlans(prev => prev.map(sip => 
      sip.id === showModifyModal 
        ? { ...sip, monthlyAmount: Number(newMonthlyAmount) }
        : sip
    ));

    alert(`SIP amount updated to ₹${Number(newMonthlyAmount).toLocaleString('en-IN')} successfully!`);
    setShowModifyModal(null);
    setNewMonthlyAmount('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/5 px-6 lg:px-12 py-8">
        <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter mb-4">
          SIP Investment
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm max-w-4xl">
          Systematic Investment Plan for <span className="text-white">Government Bonds</span>.
          <br />
          <span className="text-orange-500 text-xs">Build wealth through disciplined monthly investments</span>
        </p>
      </header>

      <div className="px-6 lg:px-12 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Active SIP Plans */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Your SIP Plans</h2>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-orange-500 text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-sm hover:bg-orange-400 transition-all"
              >
                + Create New SIP
              </button>
            </div>

            <div className="space-y-6">
              {sipPlans.map((sip) => (
                <div key={sip.id} className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tighter mb-2">{sip.bondName}</h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                          sip.status === 'active' ? 'bg-green-500/20 text-green-500' : 
                          sip.status === 'paused' ? 'bg-yellow-500/20 text-yellow-500' : 
                          'bg-zinc-500/20 text-zinc-500'
                        }`}>
                          {sip.status}
                        </span>
                        <span className="text-zinc-500">Started: {new Date(sip.startDate).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black">₹{sip.monthlyAmount.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-zinc-500 uppercase tracking-widest">Monthly</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Duration</div>
                      <div className="text-lg font-bold">{sip.duration} months</div>
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Total Invested</div>
                      <div className="text-lg font-bold">₹{(sip.monthlyAmount * sip.duration).toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Expected Returns</div>
                      <div className="text-lg font-bold text-green-500">₹{sip.expectedReturns.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button 
                      onClick={() => handlePauseSIP(sip.id)}
                      className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all"
                    >
                      {sip.status === 'active' ? 'Pause SIP' : 'Resume SIP'}
                    </button>
                    <button 
                      onClick={() => handleModifyAmount(sip.id)}
                      className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all"
                    >
                      Modify Amount
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Balance Card */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">Available Balance</h3>
              <div className="text-3xl font-black mb-2">{weilBalance.toFixed(4)} <span className="text-orange-500">WEIL</span></div>
              <div className="text-sm text-zinc-400">≈ ₹{balance.toLocaleString('en-IN')}</div>
            </div>

            {/* SIP Benefits */}
            <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-black uppercase tracking-widest mb-4">Why SIP?</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold">Rupee Cost Averaging</div>
                    <div className="text-zinc-400 text-xs">Reduce impact of market volatility</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold">Disciplined Investing</div>
                    <div className="text-zinc-400 text-xs">Build wealth systematically</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold">Compound Growth</div>
                    <div className="text-zinc-400 text-xs">Earn returns on returns</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create SIP Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Create New SIP</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Bond Selection */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">Select Bond</label>
                <select
                  value={selectedBond}
                  onChange={(e) => setSelectedBond(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Choose a bond...</option>
                  {availableBonds.map((bond) => (
                    <option key={bond.id} value={bond.id}>
                      {bond.name} ({bond.apy}% APY)
                    </option>
                  ))}
                </select>
              </div>

              {/* Monthly Amount */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">Monthly Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-zinc-600">₹</span>
                  <input
                    type="number"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(e.target.value)}
                    placeholder="5000"
                    min="100"
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">Duration (Months)</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                  <option value="60">60 months</option>
                </select>
              </div>

              {/* Projection */}
              {selectedBond && monthlyAmount && duration && (
                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                  <div className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">Projection</div>
                  {(() => {
                    const bond = availableBonds.find(b => b.id === selectedBond);
                    if (!bond) return null;
                    const { totalInvested, futureValue, returns } = calculateReturns(Number(monthlyAmount), Number(duration), bond.apy);
                    return (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Investment:</span>
                          <span className="font-bold">₹{totalInvested.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expected Returns:</span>
                          <span className="font-bold text-green-500">₹{returns.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between border-t border-white/10 pt-2">
                          <span>Maturity Value:</span>
                          <span className="font-black text-lg">₹{futureValue.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              <button
                onClick={handleCreateSIP}
                className="w-full bg-orange-500 text-black py-4 rounded-full font-black uppercase tracking-widest hover:bg-orange-400 transition-all"
              >
                Create SIP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modify Amount Modal */}
      {showModifyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Modify SIP Amount</h2>
              <button
                onClick={() => setShowModifyModal(null)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">New Monthly Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-zinc-600">₹</span>
                  <input
                    type="number"
                    value={newMonthlyAmount}
                    onChange={(e) => setNewMonthlyAmount(e.target.value)}
                    placeholder="5000"
                    min="100"
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowModifyModal(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmModifyAmount}
                  className="flex-1 bg-orange-500 text-black py-3 rounded-full font-black uppercase tracking-widest text-sm hover:bg-orange-400 transition-all"
                >
                  Update Amount
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SIPPage;