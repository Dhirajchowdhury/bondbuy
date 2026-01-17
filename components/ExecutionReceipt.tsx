import React, { useEffect, useState } from 'react';
import { getExecutionReceipt, ExecutionReceipt as ReceiptType } from '../lib/weilChain';

interface ExecutionReceiptProps {
  receiptId: string;
  onBack: () => void;
}

const ExecutionReceipt: React.FC<ExecutionReceiptProps> = ({ receiptId, onBack }) => {
  const [receipt, setReceipt] = useState<ReceiptType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReceipt();
  }, [receiptId]);

  const loadReceipt = async () => {
    setLoading(true);
    const data = await getExecutionReceipt(receiptId);
    setReceipt(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Loading Receipt...</p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-black uppercase mb-4">Receipt Not Found</h2>
          <p className="text-zinc-500 mb-8">The execution receipt could not be located.</p>
          <button
            onClick={() => {
              window.location.hash = '';
              onBack();
            }}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const truncate = (str: string, len = 16) => 
    `${str.slice(0, len)}...${str.slice(-len)}`;

  const statusColor = receipt.execution_status === 'VERIFIED' 
    ? 'text-green-500 bg-green-500/10 border-green-500/20'
    : 'text-red-500 bg-red-500/10 border-red-500/20';

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => {
              window.location.hash = '';
              onBack();
            }}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6 font-bold uppercase tracking-widest text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">Execution Receipt</h1>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Weil Chain-Verified Workflow</p>
            </div>
          </div>
        </div>

        {/* Receipt Summary */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Status</div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-black uppercase tracking-widest text-sm ${statusColor}`}>
                {receipt.execution_status === 'VERIFIED' && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {receipt.execution_status}
              </div>
            </div>
            
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Action</div>
              <div className="text-xl font-black">Bond Minting</div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Bond Name</div>
              <div className="text-xl font-black">{receipt.bond_name}</div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Wallet</div>
              <div className="text-sm font-mono text-zinc-400">{truncate(receipt.wallet_address, 8)}</div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Timestamp</div>
              <div className="text-sm font-bold">{new Date(receipt.created_at).toLocaleString()}</div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Investment</div>
              <div className="text-xl font-black text-orange-500">₹{receipt.invested_amount.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>

        {/* Rules Verified */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-black uppercase mb-6">Rules Verified</h2>
          <div className="space-y-4">
            {Object.entries(receipt.rules_verified).map(([rule, passed]) => (
              <div key={rule} className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  passed ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                }`}>
                  {passed ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-bold uppercase tracking-wider">
                  {rule.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>

          {receipt.verification_errors && receipt.verification_errors.length > 0 && (
            <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
              <h3 className="text-sm font-black uppercase text-red-500 mb-3">Verification Errors</h3>
              <ul className="space-y-2">
                {receipt.verification_errors.map((error, idx) => (
                  <li key={idx} className="text-sm text-zinc-400">• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Linked Artifacts */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-black uppercase mb-6">Linked Artifacts</h2>
          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Receipt ID</div>
              <div className="bg-black/50 rounded-xl px-4 py-3 font-mono text-sm text-zinc-400 break-all">
                {receipt.receipt_id}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Receipt Hash</div>
              <div className="bg-black/50 rounded-xl px-4 py-3 font-mono text-sm text-zinc-400 break-all">
                {receipt.receipt_hash}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Weil Chain Block</div>
              <div className="bg-black/50 rounded-xl px-4 py-3 font-mono text-sm text-purple-400">
                {receipt.weil_chain_block}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Weil Chain Network</div>
              <div className="bg-black/50 rounded-xl px-4 py-3 font-mono text-sm text-purple-400">
                {receipt.weil_chain_network}
              </div>
            </div>

            {receipt.solana_tx_hash && (
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Solana Transaction</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-black/50 rounded-xl px-4 py-3 font-mono text-sm text-green-400 break-all">
                    {receipt.solana_tx_hash}
                  </div>
                  <a
                    href={`https://explorer.solana.com/tx/${receipt.solana_tx_hash}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 w-10 h-10 bg-green-500/20 hover:bg-green-500/30 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Integrity Statement */}
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-3xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-black uppercase mb-4">Integrity Statement</h3>
              <p className="text-zinc-400 leading-relaxed mb-4">
                This receipt proves that the bond minting workflow was executed on <span className="text-purple-400 font-bold">Weil Chain</span> according to predefined rules before the Solana blockchain transaction was finalized.
              </p>
              <p className="text-zinc-400 leading-relaxed mb-4">
                The execution was verified by <span className="text-white font-bold">{receipt.weil_chain_executor}</span> and recorded immutably on block <span className="text-purple-400 font-mono">{receipt.weil_chain_block}</span>.
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                This tamper-proof receipt provides an audit-ready trail for regulatory compliance and enterprise-grade verification of the minting process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionReceipt;
