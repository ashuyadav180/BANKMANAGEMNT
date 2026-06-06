import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, Activity, Server, FileText, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import FraudRingMap from './FraudRingMap';
import AIInterrogator from './AIInterrogator';

const Dashboard = ({ alerts, onAction }) => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [showInterrogator, setShowInterrogator] = useState(false);

  const getRiskColor = (verdict) => {
    if (verdict === 'HIGH') return 'text-[#ff3c6e] border-[#ff3c6e] bg-[#ff3c6e11]';
    if (verdict === 'MEDIUM') return 'text-[#ffc947] border-[#ffc947] bg-[#ffc94711]';
    return 'text-[#00e676] border-[#00e676] bg-[#00e67611]';
  };

  const getChartData = (factors) => {
    if (!factors) return [];
    return factors.map(f => ({
      name: f.feature,
      impact: f.shap_impact,
      isPositive: f.shap_impact > 0
    }));
  };

  const handleBtnClick = () => {
    if (selectedCase && onAction) {
      onAction(selectedCase.account_id);
      setSelectedCase(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Live Feed Panel */}
      <div className="lg:col-span-2 bg-[#0b1120] border border-[#00e5ff22] rounded-xl overflow-hidden shadow-lg">
        <div className="bg-[#111c30] px-4 py-3 border-b border-[#00e5ff22] flex items-center space-x-2">
          <Activity className="text-[#00e5ff] w-5 h-5 animate-pulse" />
          <h2 className="font-semibold text-[#e8f0fe]">Live Transaction Feed</h2>
        </div>
        <div className="p-4 max-h-[600px] overflow-y-auto space-y-2">
          {alerts.length === 0 ? (
            <div className="text-center text-[#7b93b8] py-10">Waiting for live data feed...</div>
          ) : (
            alerts.map((alert, idx) => (
              <div 
                key={idx} 
                onClick={() => {
                  setSelectedCase(alert);
                  setShowInterrogator(false);
                }}
                className={`flex items-center justify-between p-3 rounded-lg border border-transparent cursor-pointer transition-all hover:bg-[#111c30] ${selectedCase?.account_id === alert.account_id ? 'border-[#00e5ff] bg-[#111c30]' : 'bg-[#0b1120]'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`px-2 py-1 rounded text-xs font-bold border ${getRiskColor(alert.verdict)}`}>
                    {alert.verdict}
                  </div>
                  <div>
                    <div className="font-mono text-sm text-[#e8f0fe]">{alert.account_id}</div>
                    <div className="text-xs text-[#7b93b8]">Risk Score: {alert.risk_score}%</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-xs text-[#7b93b8]">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#7b93b8]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Case Details Panel */}
      <div className="bg-[#0b1120] border border-[#00e5ff22] rounded-xl overflow-hidden shadow-lg flex flex-col">
        <div className="bg-[#111c30] px-4 py-3 border-b border-[#00e5ff22] flex items-center space-x-2">
          <FileText className="text-[#a259ff] w-5 h-5" />
          <h2 className="font-semibold text-[#e8f0fe]">Explainable AI Analysis</h2>
        </div>
        <div className="p-4 flex-1">
          {!selectedCase ? (
            <div className="flex flex-col items-center justify-center h-full text-[#7b93b8] space-y-4">
              <Server className="w-12 h-12 opacity-20" />
              <p>Select a transaction to view details</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score header */}
              <div className="flex items-center justify-between border-b border-[#ffffff11] pb-4">
                <div>
                  <h3 className="text-xl font-mono text-[#00e5ff]">{selectedCase.account_id}</h3>
                  <p className="text-sm text-[#7b93b8]">Analyst Review Recommended</p>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${selectedCase.verdict === 'HIGH' ? 'text-[#ff3c6e]' : selectedCase.verdict === 'MEDIUM' ? 'text-[#ffc947]' : 'text-[#00e676]'}`}>
                    {selectedCase.risk_score}%
                  </div>
                  <div className="text-xs text-[#7b93b8] uppercase tracking-wide">Risk Score</div>
                </div>
              </div>

              {/* Explainable AI & Incredible Features Container */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Left Column: Explanations */}
                <div className="space-y-4">
                  {/* Gemini Explanation */}
                  <div className="bg-[#111c30] p-4 rounded-lg border border-[#a259ff44]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#a259ff] mb-2 flex items-center">
                      <span className="mr-2">✦</span> Gemini AI Summary
                    </h4>
                    <p className="text-sm text-[#e8f0fe] leading-relaxed">
                      {selectedCase.explanation || "No explanation provided for this prediction."}
                    </p>
                  </div>

                  {/* SHAP Chart */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#7b93b8] mb-2">Top Contributing Factors (SHAP)</h4>
                    <div className="h-[200px] w-full bg-[#111c30] rounded-lg p-2 border border-[#ffffff11]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getChartData(selectedCase.top_factors)}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#7b93b8', fontSize: 10}} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0b1120', borderColor: '#00e5ff33', fontSize: '12px' }}
                            itemStyle={{ color: '#00e5ff' }}
                            formatter={(value) => [Number(value).toFixed(3), 'Impact']}
                          />
                          <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                            {getChartData(selectedCase.top_factors).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.isPositive ? '#ff3c6e' : '#00e676'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Right Column: Active Countermeasures */}
                <div className="space-y-4">
                  {!showInterrogator ? (
                    <>
                      <FraudRingMap accountId={selectedCase.account_id} />
                      <button 
                        onClick={() => setShowInterrogator(true)}
                        className="w-full bg-[#a259ff22] hover:bg-[#a259ff44] text-[#a259ff] border border-[#a259ff] py-3 rounded font-bold transition-all shadow-[0_0_15px_rgba(162,89,255,0.3)] animate-pulse cursor-pointer flex items-center justify-center"
                      >
                        Deploy AI Interrogator
                      </button>
                    </>
                  ) : (
                    <AIInterrogator 
                      accountId={selectedCase.account_id} 
                      onComplete={() => {
                        setShowInterrogator(false);
                        handleBtnClick(); // Freeze and clear
                      }} 
                    />
                  )}
                </div>
              </div>
              
              <div className="pt-4 border-t border-[#ffffff11] flex space-x-3">
                <button onClick={handleBtnClick} className="flex-1 bg-[#ff3c6e22] hover:bg-[#ff3c6e44] text-[#ff3c6e] border border-[#ff3c6e] py-2 rounded font-semibold transition-colors cursor-pointer">
                  Freeze Account
                </button>
                <button onClick={handleBtnClick} className="flex-1 bg-[#00e67622] hover:bg-[#00e67644] text-[#00e676] border border-[#00e676] py-2 rounded font-semibold transition-colors cursor-pointer">
                  Clear Flag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
