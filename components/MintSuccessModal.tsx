import React from 'react';

interface MintSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bondName: string;
  publicKey: string;
  txSignature: string;
  investedAmount: number;
  units: number;
  certificateId: string;
  receiptId?: string | null;
}

const MintSuccessModal: React.FC<MintSuccessModalProps> = ({
  isOpen,
  onClose,
  bondName,
  publicKey,
  txSignature,
  investedAmount,
  units,
  certificateId,
  receiptId
}) => {
  if (!isOpen) return null;

  const truncateAddress = (addr: string, len = 8) => `${addr.slice(0, len)}...${addr.slice(-len)}`;
  const explorerUrl = `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Bond Minted Successfully</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex flex-col lg:flex-row gap-6">
          {/* Certificate Image with Overlay Data */}
          <div className="flex-1 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/cert.png" 
                alt="Bond Certificate" 
                className="w-full h-auto"
              />
              {/* Overlay text on certificate */}
              <div className="absolute bottom-[18%] left-[5%] text-[10px] sm:text-xs md:text-sm font-bold text-zinc-800 space-y-1 sm:space-y-2">
                <p><span className="font-black">{truncateAddress(publicKey, 6)}</span></p>
                <p><span className="font-black">{truncateAddress(txSignature, 6)}</span></p>
                <p><span className="font-black">{units.toFixed(2)}</span></p>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              ON-CHAIN
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 space-y-5">
            {/* Wallet Connection */}
            <div className="bg-zinc-800/50 rounded-2xl p-5 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-xs font-black uppercase tracking-wider text-white">Wallet Connected</span>
              </div>
              <p className="text-zinc-400 text-xs mb-3">Your bond NFT has been minted to your wallet.</p>
              <div className="bg-zinc-900 rounded-xl px-4 py-3">
                <span className="text-green-500 font-mono text-xs break-all">{publicKey}</span>
              </div>
            </div>

            {/* Blockchain Verification */}
            <div className="bg-zinc-800/50 rounded-2xl p-5 border border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full border-2 border-green-500"></div>
                <span className="text-xs font-black uppercase tracking-wider text-white">Blockchain Verification</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Network</p>
                  <p className="text-sm font-bold text-white">Solana Devnet</p>
                </div>
                
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Transaction Signature</p>
                  <div className="bg-zinc-900 rounded-xl px-4 py-3 flex items-center justify-between gap-2">
                    <p className="text-xs font-mono text-zinc-400 truncate">{txSignature}</p>
                    <button 
                      onClick={() => navigator.clipboard.writeText(txSignature)}
                      className="text-zinc-500 hover:text-white transition-colors flex-shrink-0"
                      title="Copy"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Certificate ID</p>
                  <div className="bg-zinc-900 rounded-xl px-4 py-3">
                    <p className="text-xs font-mono text-zinc-400">{certificateId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bond Details */}
            <div className="bg-zinc-800/50 rounded-2xl p-5 border border-white/5">
              <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4">Investment Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Bond</p>
                  <p className="text-sm font-bold text-white">{bondName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Units</p>
                  <p className="text-sm font-bold text-orange-500">{units.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Amount</p>
                  <p className="text-sm font-bold text-white">₹{investedAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <a 
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-4 rounded-full font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on Explorer
              </a>
              <button 
                onClick={onClose}
                className="px-6 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-full font-black uppercase tracking-widest text-sm text-white transition-all border border-white/10"
              >
                Close
              </button>
            </div>

            {/* Weil Chain Execution Receipt Notice */}
            {receiptId && (
              <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black uppercase mb-2 text-purple-400">🔒 Execution Receipt Generated on Weil Chain</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                      This transaction was verified through Weil Chain's tamper-proof execution receipt system before minting. All rules were validated and recorded immutably.
                    </p>
                    <button
                      onClick={() => {
                        // Navigate to receipt view
                        window.location.hash = `receipt/${receiptId}`;
                        onClose();
                      }}
                      className="inline-flex items-center gap-2 text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <span>View Execution Receipt</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintSuccessModal;
