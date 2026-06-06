import React, { useEffect, useState } from 'react';
import { Network, ArrowRight } from 'lucide-react';

const FraudRingMap = ({ accountId }) => {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    // Generate 4 fake connected mule accounts
    const fakeNodes = Array.from({ length: 4 }).map((_, i) => ({
      id: `ACC-${Math.floor(Math.random() * 90000) + 10000}`,
      amount: `$${(Math.random() * 5000 + 1000).toFixed(2)}`,
      delay: i * 200
    }));
    setNodes(fakeNodes);
  }, [accountId]);

  return (
    <div className="bg-[#111c30] p-4 rounded-lg border border-[#00e5ff33]">
      <h4 className="text-xs font-bold uppercase tracking-wider text-[#00e5ff] mb-4 flex items-center">
        <Network className="w-4 h-4 mr-2" /> Live Mule Ring Tracing
      </h4>
      
      <div className="flex flex-col items-center relative py-4">
        {/* Origin Node */}
        <div className="bg-[#ff3c6e] text-white px-4 py-2 rounded-lg font-mono text-sm z-10 shadow-[0_0_15px_rgba(255,60,110,0.5)] border border-[#ff3c6e] animate-pulse">
          {accountId} (Origin)
        </div>
        
        {/* Arrows and Connected Nodes */}
        <div className="flex justify-between w-full mt-8 relative px-4">
          {nodes.map((node, i) => (
            <div key={node.id} className="flex flex-col items-center" style={{ animation: `fadeIn 0.5s ease-out ${node.delay}ms both` }}>
              {/* Animated Arrow pointing down from origin to nodes - approximated visually */}
              <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 w-full flex justify-center opacity-50">
                 <svg width="100%" height="30" className="absolute top-0 left-0">
                    <path d={`M 50% 0 Q ${25 * i}% 15, ${10 + (i * 25)}% 30`} fill="none" stroke="#ff3c6e" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                 </svg>
              </div>
              <div className="bg-[#0b1120] text-[#7b93b8] px-3 py-2 rounded border border-[#ff3c6e44] font-mono text-xs z-10 text-center shadow-[0_0_10px_rgba(255,60,110,0.2)]">
                {node.id}
                <div className="text-[#00e676] mt-1 font-bold">{node.amount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default FraudRingMap;
