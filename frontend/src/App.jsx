import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ChevronRight, Lock, ShieldOff, CheckCircle, Download, Sparkles } from 'lucide-react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function transformBackendData(data) {
  const score = data.risk_score;
  const level = data.verdict;
  const rawAmount = Math.round(50000 + Math.random() * 850000);
  const amount = rawAmount.toLocaleString('en-IN');
  const d = new Date(data.timestamp || Date.now());
  const h = d.getHours(); const m = d.getMinutes(); const s = d.getSeconds();
  const time = `${h%12||12}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} ${h<12?'AM':'PM'}`;
  
  const shapValues = (data.top_factors || []).map(f => ({
    name: f.feature,
    value: parseFloat(f.shap_impact.toFixed(3)),
    weight: Math.abs(f.shap_impact),
    impact: Math.abs(f.shap_impact) > 0.5 ? 'High' : 'Med',
    dir: f.shap_impact > 0 ? '↑' : '↓'
  })).sort((a,b) => Math.abs(b.value)-Math.abs(a.value));

  const terminalLogs = [
    {type:'SYSTEM', message:'Initializing risk assessment pipeline...', time},
    {type:'SYSTEM', message:'Loading behavioral biometric baseline...', time},
    {type:'SYSTEM', message:'Cross-referencing global AML watchlists...', time},
    {type:'PASS',   message:'OFAC checks negative.', time},
    {type:'WARN',   message:'Device fingerprint mismatch. Primary: iOS/Delhi. Current: Android/Unknown.', time},
    {type:'SYSTEM', message:'Analyzing transaction velocity graph...', time},
    {type:'ALERT',  message:`Velocity anomaly detected: ${Math.round(200+Math.random()*300)}% above 90-day baseline.`, time},
    {type:'AI',     message:'Linguistic analysis of transaction memos indicates structured evasion.', time},
    {type:'INFO',   message:'Awaiting analyst countermeasure decision...', time}
  ];

  return {
    id: data.account_id,
    riskScore: score,
    level,
    amount,
    bank: ['HDFC','ICICI','SBI','AXIS','KOTAK','PNB','BOB','IDFC'][Math.floor(Math.random()*8)],
    time,
    shapValues,
    aiSummary: data.explanation || "No explanation provided.",
    terminalLogs
  };
}

export default function MuleWatchUI() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [analyzedCount, setAnalyzedCount] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const [latency, setLatency] = useState(12);
  const [sessionTime, setSessionTime] = useState(0);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [frozenAccounts, setFrozenAccounts] = useState(new Set());
  const [clearedAccounts, setClearedAccounts] = useState(new Set());

  // Init & Socket
  useEffect(() => {
    // Fetch historical data
    fetch('http://localhost:3001/api/predictions?limit=25')
      .then(res => res.json())
      .then(data => {
        const parsed = data.map(transformBackendData);
        setAccounts(parsed);
        setAnalyzedCount(parsed.length);
        setAlertCount(parsed.filter(a => a.level === 'HIGH').length);
        if (parsed.length > 0) setSelectedAcc(parsed[0]);
      })
      .catch(err => console.error(err));

    socket.on('new_prediction', (data) => {
      const acc = transformBackendData(data);
      acc.isNew = true;
      setAccounts(prev => {
        const next = [acc, ...prev];
        if (next.length > 50) return next.slice(0, 50);
        return next;
      });
      setAnalyzedCount(c => c + 1);
      if (acc.level === 'HIGH') setAlertCount(c => c + 1);
      
      // Auto select if it's the very first one
      setSelectedAcc(curr => curr || acc);
    });

    return () => socket.off('new_prediction');
  }, []);

  // Timers
  useEffect(() => {
    const tLatency = setInterval(() => setLatency(Math.floor(Math.random() * 11) + 8), 5000);
    const tSession = setInterval(() => setSessionTime(s => s + 1), 1000);
    return () => { clearInterval(tLatency); clearInterval(tSession); };
  }, []);

  const confirmFreeze = () => {
    if (selectedAcc) {
      setFrozenAccounts(prev => new Set(prev).add(selectedAcc.id));
      setShowFreezeModal(false);
    }
  };

  const handleClear = () => {
    if (selectedAcc) {
      setClearedAccounts(prev => new Set(prev).add(selectedAcc.id));
    }
  };

  const filteredAccounts = accounts.filter(a => filter === 'ALL' || a.level === filter);

  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: '52px 1fr 28px',
      gridTemplateColumns: '1fr',
      height: '100vh',
      width: '100vw',
      background: 'var(--bg-0)',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif",
      color: 'var(--t1)'
    }}>
      <TopBar analyzedCount={analyzedCount} alertCount={alertCount} latency={latency} />
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '38% 37% 25%',
        height: '100%',
        overflow: 'hidden',
        borderTop: '1px solid var(--b1)'
      }}>
        <FeedPanel 
          accounts={filteredAccounts} 
          filter={filter} 
          setFilter={setFilter} 
          selectedAcc={selectedAcc} 
          setSelectedAcc={setSelectedAcc} 
          frozenAccounts={frozenAccounts}
          clearedAccounts={clearedAccounts}
        />
        <AnalysisPanel 
          acc={selectedAcc} 
          setShowFreezeModal={setShowFreezeModal} 
          handleClear={handleClear}
          frozenAccounts={frozenAccounts}
        />
        <TerminalPanel acc={selectedAcc} isFrozen={selectedAcc && frozenAccounts.has(selectedAcc.id)} />
      </div>

      <StatusBar sessionTime={sessionTime} />

      {/* Freeze Modal */}
      {showFreezeModal && selectedAcc && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(6,9,15,0.88)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
          animation: 'fadeIn 200ms ease-out'
        }}>
          <div style={{
            width: 380,
            background: 'var(--bg-3)',
            border: '1px solid var(--red-20)',
            borderRadius: 14,
            padding: '28px 28px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
            animation: 'scaleIn 220ms ease-out'
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--red-08)', border: '1px solid var(--red-20)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 18
            }}>
              <ShieldOff style={{ width: 24, color: 'var(--red)' }} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 600, color: 'var(--t1)' }}>
              Confirm Account Freeze
            </h3>
            <span style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--cyan)', marginBottom: 14 }}>
              {selectedAcc.id}
            </span>
            <p style={{ fontSize: 13, color: 'var(--t2)', textAlign: 'center', lineHeight: 1.6, margin: '0 0 24px' }}>
              This will immediately suspend all transactions and flag the account for regulatory review. This action is logged and cannot be undone without supervisor approval.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}>
              <button
                onClick={() => setShowFreezeModal(false)}
                style={{
                  height: 44, borderRadius: 8, border: '1px solid var(--b2)',
                  background: 'transparent', fontSize: 13, color: 'var(--t2)', cursor: 'pointer'
                }}
              >Cancel</button>
              <button
                onClick={confirmFreeze}
                style={{
                  height: 44, borderRadius: 8, border: 'none',
                  background: 'var(--red)', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer',
                  transition: 'opacity 200ms'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >Confirm Freeze</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ================= TOPBAR =================
function TopBar({ analyzedCount, alertCount, latency }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', gap: 0, background: 'var(--bg-1)', borderBottom: '1px solid var(--b1)' }}>
      {/* Zone A */}
      <div style={{ width: 260, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 2L19.66 7V17L11 22L2.34 17V7L11 2Z" stroke="#00E5C3" strokeWidth="1.5" fill="none"/>
          <circle cx="11" cy="11" r="3" fill="#00E5C3" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}/>
        </svg>
        <div style={{ width: 10 }} />
        <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>MuleWatch</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--cyan)' }}>AI</span>
        <div style={{ width: 12 }} />
        <span style={{ color: 'var(--t3)', fontSize: 14 }}>·</span>
        <div style={{ width: 12 }} />
        <span style={{ color: 'var(--t2)', fontSize: 12, fontWeight: 400 }}>Live Fraud Intelligence</span>
      </div>

      {/* Zone B */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '5px 14px',
          border: '1px solid var(--green-20)', borderRadius: 20, background: 'var(--green-08)'
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', animation: 'pulse-ring-green 1.5s ease-out infinite' }}/>
          <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 600, letterSpacing: '1px', color: 'var(--green)' }}>
            INGESTING LIVE STREAM
          </span>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--green)' }}>
          LATENCY {latency}ms
        </span>
      </div>

      {/* Zone C */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
        <StatChip icon={<CheckCircle style={{width: 14, color: 'var(--t1)'}}/>} value={analyzedCount.toLocaleString()} label="ANALYZED" />
        <div style={{ width: 1, height: 20, background: 'var(--b1)' }}/>
        <StatChip 
          icon={<Lock style={{width: 14, color: alertCount > 0 ? 'var(--red)' : 'var(--t1)'}}/>} 
          value={alertCount.toLocaleString()} 
          label="ALERTS" 
          active={alertCount > 0} 
        />
        <div style={{ width: 1, height: 20, background: 'var(--b1)' }}/>
        <StatChip icon={<CheckCircle style={{width: 14, color: 'var(--green)'}}/>} value="98.7%" label="MODEL ACC" valueColor="var(--green)" />
        <div style={{ width: 1, height: 20, background: 'var(--b1)' }}/>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: 'var(--cyan-08)', border: '1px solid var(--cyan-20)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 600, color: 'var(--cyan)', fontFamily: 'monospace', marginLeft: 8
        }}>AY</div>
      </div>
    </div>
  );
}

function StatChip({ icon, value, label, active, valueColor }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
      border: `1px solid ${active ? 'var(--red-20)' : 'var(--b1)'}`,
      borderRadius: 8, background: active ? 'var(--red-08)' : 'var(--bg-2)'
    }}>
      {icon}
      <span style={{ fontSize: 15, fontWeight: 600, color: active ? 'var(--red)' : (valueColor || 'var(--t1)') }}>{value}</span>
      <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.8px', color: active ? 'var(--red)' : 'var(--t3)', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

// ================= FEED PANEL =================
function FeedPanel({ accounts, filter, setFilter, selectedAcc, setSelectedAcc, frozenAccounts, clearedAccounts }) {
  return (
    <div style={{ background: 'var(--bg-1)', borderRight: '1px solid var(--b1)', height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 52, borderBottom: '1px solid var(--b1)', position: 'sticky', top: 0, background: 'var(--bg-1)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1.4px', color: 'var(--t2)', textTransform: 'uppercase' }}>
            Live Transaction Feed
          </span>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', animation: 'pulse-ring-green 1.5s ease-out infinite' }}/>
        </div>
        <span style={{ fontSize: 11, color: 'var(--t3)', padding: '3px 10px', border: '1px solid var(--b1)', borderRadius: 12, fontFamily: 'monospace' }}>
          {accounts.length} accounts
        </span>
      </div>

      <div style={{ position: 'relative', padding: '12px 16px', borderBottom: '1px solid var(--b1)' }}>
        <Search style={{ position: 'absolute', left: 26, top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', width: 14 }}/>
        <input
          placeholder="Search account ID or amount…"
          style={{
            width: '100%', height: 36, background: 'var(--bg-2)', border: '1px solid var(--b1)', borderRadius: 8,
            paddingLeft: 36, paddingRight: 12, fontSize: 13, color: 'var(--t1)', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
          }}
          onFocus={e => e.target.style.borderColor = 'var(--cyan-dim)'}
          onBlur={e => e.target.style.borderColor = 'var(--b1)'}
        />
      </div>

      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--b1)', display: 'flex', gap: 8, alignItems: 'center' }}>
        {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(f => {
          const isActive = filter === f;
          const bgActive = f === 'HIGH' ? 'var(--red)' : f === 'MEDIUM' ? 'var(--amber)' : f === 'LOW' ? 'var(--green)' : 'var(--cyan)';
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '5px 14px', borderRadius: 20, fontSize: 10, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
                border: isActive ? 'none' : '1px solid var(--b1)',
                background: isActive ? bgActive : 'transparent',
                color: isActive ? '#000' : 'var(--t2)',
                cursor: 'pointer'
              }}
            >
              {f}
            </button>
          );
        })}
        <button style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--t2)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          Sort: Risk ↓
        </button>
      </div>

      <div>
        {accounts.map(acc => {
          const isSelected = selectedAcc?.id === acc.id;
          const level = acc.level;
          return (
            <div
              key={acc.id}
              onClick={() => setSelectedAcc(acc)}
              style={{
                position: 'relative', display: 'grid', gridTemplateColumns: '52px 1fr auto', alignItems: 'center', gap: 12, height: 72, padding: '0 16px', cursor: 'pointer',
                borderBottom: '1px solid var(--b1)',
                borderLeft: isSelected ? '2px solid var(--cyan)' : '2px solid transparent',
                background: isSelected ? 'linear-gradient(90deg, var(--cyan-08) 0%, transparent 70%)' : 'transparent',
                transition: 'background 150ms ease, border-color 150ms ease',
                animation: acc.isNew ? 'slideInRow 400ms ease-out forwards' : 'none'
              }}
              onMouseEnter={e => { if(!isSelected) e.currentTarget.style.background = 'var(--bg-2)'; }}
              onMouseLeave={e => { if(!isSelected) e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Risk badge */}
              <div style={{
                padding: '4px 0', borderRadius: 6, textAlign: 'center', fontSize: 9, fontWeight: 700, letterSpacing: '1px',
                background: level==='HIGH'?'var(--red-20)':level==='MEDIUM'?'var(--amber-20)':'var(--green-20)',
                color: level==='HIGH'?'var(--red)':level==='MEDIUM'?'var(--amber)':'var(--green)',
                border: `1px solid ${level==='HIGH'?'var(--red-dim)':level==='MEDIUM'?'var(--amber)':'var(--green-dim)'}`
              }}>{level}</div>

              {/* Account ID + mini bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                <span style={{
                  fontFamily: 'monospace', fontSize: 13, fontWeight: 500,
                  color: isSelected ? 'var(--cyan)' : 'var(--t1)'
                }}>{acc.id} {frozenAccounts.has(acc.id) && '🔒'} {clearedAccounts.has(acc.id) && '✅'}</span>
                <div style={{ width: 80, height: 3, background: 'var(--b1)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: acc.riskScore + '%', borderRadius: 2,
                    background: level==='HIGH'?'var(--red)':level==='MEDIUM'?'var(--amber)':'var(--green)',
                    transition: 'width 600ms ease-out'
                  }}/>
                </div>
              </div>

              {/* Amount + bank + time */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--t1)' }}>
                  ₹{acc.amount}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--t3)' }}>
                  {acc.bank}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--t3)' }}>
                  {acc.time}
                </span>
              </div>

              {/* Chevron */}
              <ChevronRight style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                width: 14, color: isSelected ? 'var(--cyan)' : 'var(--t3)'
              }}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ================= ANALYSIS PANEL =================
function AnalysisPanel({ acc, setShowFreezeModal, handleClear, frozenAccounts }) {
  if (!acc) {
    return (
      <div style={{ background: 'var(--bg-1)', borderRight: '1px solid var(--b1)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Lock style={{ width: 48, height: 48, color: 'var(--t3)' }}/>
        <p style={{ fontSize: 14, color: 'var(--t2)', margin: 0 }}>Select a transaction</p>
        <p style={{ fontSize: 12, color: 'var(--t3)', margin: 0 }}>to begin AI-powered analysis</p>
      </div>
    );
  }

  const isFrozen = frozenAccounts.has(acc.id);

  return (
    <div style={{ background: 'var(--bg-1)', borderRight: '1px solid var(--b1)', height: '100%', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      {/* Account Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--b1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 500, color: 'var(--cyan)' }}>{acc.id}</span>
          <div style={{
            padding: '4px 8px', borderRadius: 6, textAlign: 'center', fontSize: 9, fontWeight: 700, letterSpacing: '1px',
            background: acc.level==='HIGH'?'var(--red-20)':acc.level==='MEDIUM'?'var(--amber-20)':'var(--green-20)',
            color: acc.level==='HIGH'?'var(--red)':acc.level==='MEDIUM'?'var(--amber)':'var(--green)',
            border: `1px solid ${acc.level==='HIGH'?'var(--red-dim)':acc.level==='MEDIUM'?'var(--amber)':'var(--green-dim)'}`
          }}>{acc.level}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: isFrozen ? 'var(--red)' : 'var(--amber)' }}>
            {isFrozen ? "AUTO-FLAGGED / FROZEN" : "Analyst Review Recommended"}
          </span>
          <RiskRing score={acc.riskScore} level={acc.level} />
        </div>
      </div>

      {/* Gemini AI Summary */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--b1)' }}>
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--b1)', borderLeft: '3px solid var(--purple)', borderRadius: 8, padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles style={{ width: 14, color: 'var(--purple)' }}/>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1.2px', color: 'var(--purple)', textTransform: 'uppercase' }}>
                Gemini AI Summary
              </span>
            </div>
            <span style={{
              fontSize: 9, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', padding: '3px 8px',
              background: 'var(--purple-08)', border: '1px solid var(--purple-20)', borderRadius: 4, color: 'var(--purple)'
            }}>Powered by Gemini 1.5 Pro</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--t1)', lineHeight: 1.65, margin: 0 }}>
            {acc.aiSummary}
          </p>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--b1)', fontSize: 11, color: 'var(--t3)', display: 'flex', gap: 16 }}>
            <span>Generated in 0.8s</span>
            <span>Confidence 94%</span>
          </div>
        </div>
      </div>

      {/* SHAP Factors */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--b1)' }}>
        <h2 style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 16, marginTop: 0 }}>TOP CONTRIBUTING FACTORS (SHAP)</h2>
        {acc.shapValues.slice(0, 6).map((feat, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 52px', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--t2)', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {feat.name}
            </span>
            <div style={{ height: 8, background: 'var(--b1)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: Math.min(Math.abs(feat.value) * 100, 100) + '%', borderRadius: 4,
                background: feat.value > 0 ? 'var(--red)' : 'var(--cyan)', transition: 'width 600ms ease-out'
              }}/>
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: feat.value > 0 ? 'var(--red)' : 'var(--cyan)', textAlign: 'right' }}>
              {feat.value > 0 ? '+' : ''}{feat.value.toFixed(3)}
            </span>
          </div>
        ))}
      </div>

      {/* Risk Factor Table */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--b1)' }}>
        <h2 style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--t2)', marginBottom: 16, marginTop: 0 }}>RISK FACTOR SUMMARY</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--b1)' }}>
              {['Factor','Impact','Direction','Weight'].map(h => (
                <th key={h} style={{ padding: '6px 8px', fontSize: 10, fontWeight: 600, letterSpacing: '1px', color: 'var(--t3)', textTransform: 'uppercase', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {acc.shapValues.slice(0, 6).map((f, i) => (
              <tr key={i} style={{ background: i%2===0 ? 'transparent' : 'rgba(255,255,255,0.015)', borderBottom: '1px solid var(--b1)' }}>
                <td style={{ padding: '8px 8px', fontFamily: 'monospace', fontSize: 11, color: 'var(--t1)' }}>{f.name}</td>
                <td>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '2px 6px', borderRadius: 4, background: f.impact==='High'?'var(--red-20)':'var(--amber-20)', color: f.impact==='High'?'var(--red)':'var(--amber)' }}>
                    {f.impact}
                  </span>
                </td>
                <td style={{ fontSize: 12, color: f.dir==='↑'?'var(--red)':'var(--cyan)' }}>{f.dir} {f.dir==='↑'?'Increase':'Decrease'}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--t2)' }}>{f.weight.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '16px',
        position: 'sticky', bottom: 0, background: 'var(--bg-1)', borderTop: '1px solid var(--b1)', marginTop: 'auto'
      }}>
        <button
          disabled={acc.level === 'LOW' || isFrozen}
          onClick={() => setShowFreezeModal(true)}
          style={{
            height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            border: '1.5px solid var(--red)', borderRadius: 8, background: 'transparent',
            fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--red)',
            cursor: (acc.level==='LOW' || isFrozen) ? 'not-allowed' : 'pointer', opacity: (acc.level==='LOW' || isFrozen) ? 0.35 : 1, transition: 'all 200ms ease'
          }}
          onMouseEnter={e => { if(acc.level!=='LOW' && !isFrozen){ e.currentTarget.style.background='var(--red)'; e.currentTarget.style.color='#fff'; }}}
          onMouseLeave={e => { if(acc.level!=='LOW' && !isFrozen){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--red)'; }}}
        >
          <Lock style={{ width: 14 }}/> Freeze Account
        </button>

        <button 
          onClick={handleClear}
          style={{
            height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1.5px solid var(--green)',
            borderRadius: 8, background: 'transparent', fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase',
            color: 'var(--green)', cursor: 'pointer', transition: 'all 200ms ease'
          }}
          onMouseEnter={e => { e.currentTarget.style.background='var(--green)'; e.currentTarget.style.color='#000'; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--green)'; }}
        >
          <CheckCircle style={{ width: 14 }}/> Clear Flag
        </button>

        <button style={{
          height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1.5px solid var(--b2)',
          borderRadius: 8, background: 'transparent', fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase',
          color: 'var(--t2)', cursor: 'pointer', transition: 'all 200ms ease'
        }}
        onMouseEnter={e => { e.currentTarget.style.background='var(--bg-3)'; e.currentTarget.style.color='var(--t1)'; }}
        onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--t2)'; }}
        >
          <Download style={{ width: 14 }}/> Export PDF
        </button>
      </div>

    </div>
  );
}

function RiskRing({ score, level }) {
  const color = level==='HIGH'?'#FF3B5C':level==='MEDIUM'?'#FFB547':'#2ECC7A';
  const r = 36; const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position: 'relative', width: 88, height: 88 }}>
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none"/>
        <circle cx="44" cy="44" r={r} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * 0.25}
          style={{ transition: 'stroke-dasharray 800ms ease-out', transformOrigin: 'center', transform: 'rotate(-90deg)' }}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color, lineHeight: 1 }}>{score.toFixed(1)}%</span>
        <span style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.8px', color: 'var(--t3)', textTransform: 'uppercase' }}>RISK</span>
      </div>
    </div>
  );
}

// ================= TERMINAL PANEL =================
function TerminalPanel({ acc, isFrozen }) {
  const [logs, setLogs] = useState([]);
  const terminalRef = useRef(null);
  const userScrolled = useRef(false);

  useEffect(() => {
    setLogs([]);
    userScrolled.current = false;
    if (!acc) return;

    let currentIdx = 0;
    let typeInterval = null;

    const startTyping = () => {
      if (currentIdx >= acc.terminalLogs.length) return;
      const msgObj = acc.terminalLogs[currentIdx];
      const id = Date.now() + currentIdx;
      setLogs(prev => [...prev, { ...msgObj, displayText: '', id }]);
      
      let charIdx = 0;
      typeInterval = setInterval(() => {
        charIdx++;
        setLogs(prev => prev.map(l => l.id === id ? { ...l, displayText: msgObj.message.slice(0, charIdx) } : l));
        
        if (!userScrolled.current && terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }

        if (charIdx >= msgObj.message.length) {
          clearInterval(typeInterval);
          currentIdx++;
          setTimeout(startTyping, 400 + Math.random() * 400);
        }
      }, 18);
    };

    const initialTimeout = setTimeout(startTyping, 600);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(typeInterval);
    };
  }, [acc]);

  const handleScroll = () => {
    if (!terminalRef.current) return;
    const el = terminalRef.current;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20;
    userScrolled.current = !atBottom;
  };

  const getTypeColor = (type) => {
    const map = { SYSTEM:'var(--cyan)', ALERT:'var(--red)', WARN:'var(--amber)', INFO:'#7B9EC2', AI:'var(--purple)', PASS:'var(--green)' };
    return map[type] || '#FFF';
  };
  const getTextColor = (type) => {
    const map = { SYSTEM:'var(--t1)', ALERT:'var(--red)', WARN:'var(--amber)', INFO:'var(--t2)', AI:'var(--purple)', PASS:'var(--green)' };
    return map[type] || '#FFF';
  };

  return (
    <div style={{ background: 'var(--bg-terminal)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 32, padding: '0 12px', background: 'var(--bg-2)', borderBottom: '1px solid var(--b1)', flexShrink: 0, position: 'relative' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }}/>)}
        </div>
        <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: 9, fontWeight: 600, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--t3)' }}>
          AI Interrogator
        </span>
      </div>
      
      <div 
        ref={terminalRef}
        onScroll={handleScroll}
        style={{
          flex: 1, overflowY: 'auto', padding: 12,
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 1px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 2px), var(--bg-terminal)'
        }}
      >
        {isFrozen && (
          <div style={{ background: 'var(--red)', color: '#FFF', textAlign: 'center', padding: '6px', fontWeight: 700, marginBottom: 12, borderRadius: 2, fontSize: 13, fontFamily: 'monospace' }} className="animate-pulse">
            🔒 ACCOUNT LOCKED BY ANALYST
          </div>
        )}

        {logs.map((log) => (
          <div key={log.id} style={{ display: 'grid', gridTemplateColumns: '72px 68px 1fr', gap: 8, marginBottom: 3, fontFamily: 'monospace', fontSize: 11, lineHeight: 1.6 }}>
            <span style={{ color: 'var(--t3)', whiteSpace: 'nowrap' }}>{log.time}</span>
            <span style={{ fontWeight: 600, color: getTypeColor(log.type) }}>[{log.type}]</span>
            <span style={{ color: getTextColor(log.type) }}>{log.displayText}</span>
          </div>
        ))}
        {acc && <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--cyan)', animation: 'blink-cursor 530ms step-end infinite' }}>█</span>}
      </div>
    </div>
  );
}

// ================= STATUS BAR =================
function StatusBar({ sessionTime }) {
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', height: 28, background: 'var(--bg-1)', borderTop: '1px solid var(--b1)' }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', animation: 'pulse-ring-green 1.5s ease-out infinite' }}/>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--green)' }}>SYSTEM OPERATIONAL</span>
        </div>
        <span style={{ color: 'var(--b2)' }}>|</span>
        <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--t3)', fontFamily: 'monospace' }}>MODEL v2.4.1</span>
        <span style={{ color: 'var(--b2)' }}>|</span>
        <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--t3)', fontFamily: 'monospace' }}>LAST RETRAIN: 2h ago</span>
      </div>
      
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--t3)' }}>SESSION: {formatTime(sessionTime)}</span>
        <span style={{ color: 'var(--b2)' }}>|</span>
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--t3)' }}>ANALYST: AY</span>
        <span style={{ color: 'var(--b2)' }}>|</span>
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--t3)' }}>PUNE NODE 🇮🇳</span>
      </div>
    </div>
  );
}
