import React, { useState, useEffect } from 'react';
import { Bot, User, ShieldAlert, Lock } from 'lucide-react';

const AIInterrogator = ({ accountId, onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('initiating'); // initiating, interrogating, analyzing, complete

  const chatScript = [
    { sender: 'ai', text: `SECURITY ALERT: We detected unusual activity on account ${accountId}. Please verify the $1,250 transfer to John Doe. Type "YES" to authorize.`, delay: 1000 },
    { sender: 'user', text: `what transfer? i dont know about this`, delay: 3500 },
    { sender: 'ai', text: `Thank you. Our systems indicate your device location does not match your registered address. Please provide your current city for verification.`, delay: 5000 },
    { sender: 'user', text: `im traveling right now just approve it`, delay: 8000 },
    { sender: 'sys', text: `[SYSTEM]: Analyzing linguistic patterns and behavioral biometrics...`, delay: 10000 },
    { sender: 'sys', text: `[SYSTEM]: Deception probability 94%. IP origin mismatched. Device fingerprint anomalous.`, delay: 12000 },
  ];

  useEffect(() => {
    let timers = [];
    setStatus('interrogating');
    
    chatScript.forEach((msg, index) => {
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, msg]);
        if (index === chatScript.length - 1) {
          setStatus('complete');
        } else if (msg.sender === 'sys') {
          setStatus('analyzing');
        }
      }, msg.delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [accountId]);

  return (
    <div className="bg-[#0b1120] border border-[#a259ff] rounded-lg overflow-hidden flex flex-col h-[350px] shadow-[0_0_20px_rgba(162,89,255,0.2)]">
      <div className="bg-[#a259ff] text-white px-4 py-2 flex justify-between items-center text-sm font-bold">
        <div className="flex items-center">
          <Bot className="w-4 h-4 mr-2" /> Autonomous AI Interrogator
        </div>
        {status === 'complete' ? (
          <span className="flex items-center text-red-100 bg-red-900 px-2 rounded border border-red-500 animate-pulse">
            <Lock className="w-3 h-3 mr-1" /> ACCOUNT LOCKED
          </span>
        ) : (
          <span className="animate-pulse flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div> Live Session
          </span>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-2 rounded ${
              msg.sender === 'ai' ? 'bg-[#111c30] text-[#a259ff] border border-[#a259ff44]' :
              msg.sender === 'user' ? 'bg-[#ff3c6e22] text-[#ff3c6e] border border-[#ff3c6e44]' :
              'bg-[#000000] text-[#00e5ff] border border-[#00e5ff] w-full mt-2'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {status !== 'complete' && (
          <div className="text-[#7b93b8] italic mt-2 animate-pulse">
            {status === 'analyzing' ? 'Processing analysis...' : 'Awaiting response...'}
          </div>
        )}
      </div>

      {status === 'complete' && (
        <div className="p-3 bg-[#111c30] border-t border-[#a259ff44]">
          <button 
            onClick={onComplete}
            className="w-full bg-[#ff3c6e] hover:bg-[#d62d59] text-white py-2 rounded font-bold transition-colors shadow-[0_0_10px_rgba(255,60,110,0.5)]"
          >
            Confirm Freeze & Close
          </button>
        </div>
      )}
    </div>
  );
};

export default AIInterrogator;
