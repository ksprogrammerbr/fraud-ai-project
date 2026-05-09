"use client";
import { useState, useEffect } from "react";
import { ShieldAlert, ShieldCheck, Activity, DollarSign, Clock, CreditCard, Cpu, Database, CheckCircle2 } from "lucide-react";

type AILog = {
  id: number;
  text: string;
  status: "loading" | "success" | "error";
};

export default function Home() {
  const [status, setStatus] = useState("checking");
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [aiLogs, setAiLogs] = useState<AILog[]>([]);
  const [form, setForm] = useState({
    valor_transacao: 9000,
    hora_transacao: 2,
    limite_credito: 5000,
    transacoes_anteriores: 1
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then(() => setStatus("online"))
      .catch(() => setStatus("offline"));
  }, []);

  const addLog = (text: string, status: "loading" | "success" | "error" = "success") => {
    setAiLogs((prev) => [...prev, { id: Date.now() + Math.random(), text, status }]);
  };

  const analisarFraude = async () => {
    setLoading(true);
    setResultado(null);
    setAiLogs([]);
    
    // Simula as etapas de pensamento da IA para UI (Recrutadores)
    addLog("Iniciando motor de análise de fraude...", "loading");
    
    setTimeout(() => {
      setAiLogs(prev => prev.map(log => log.text.includes("Iniciando") ? { ...log, status: "success" } : log));
      addLog("Extraindo features da transação (Valor, Hora, Limite)...", "loading");
    }, 800);

    setTimeout(() => {
      setAiLogs(prev => prev.map(log => log.text.includes("Extraindo") ? { ...log, status: "success" } : log));
      addLog("Normalizando dados usando StandardScaler...", "loading");
    }, 1600);

    setTimeout(() => {
      setAiLogs(prev => prev.map(log => log.text.includes("Normalizando") ? { ...log, status: "success" } : log));
      addLog("Invocando rede neural profunda (TensorFlow)...", "loading");
    }, 2400);

    setTimeout(async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        
        setAiLogs(prev => prev.map(log => log.text.includes("Invocando") ? { ...log, status: "success" } : log));
        addLog(`Análise concluída com ${(data.fraude_probabilidade * 100).toFixed(2)}% de confiança.`, "success");
        
        setResultado(data);
      } catch (err) {
        console.error("Erro na API", err);
        setAiLogs(prev => prev.map(log => log.text.includes("Invocando") ? { ...log, status: "error" } : log));
        addLog("Erro de conexão com o motor de IA.", "error");
      } finally {
        setLoading(false);
      }
    }, 3200);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-4 md:p-8 flex flex-col">
      {/* Header com Status */}
      <div className="max-w-7xl w-full mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
            <Cpu className="text-blue-400" /> DeepAudit AI
          </h1>
          <p className="text-slate-400 text-sm mt-1">Monitoramento Antifraude em Tempo Real</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border shadow-lg ${
          status === "online" ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10 shadow-emerald-500/10" : "border-red-500/50 text-red-400 bg-red-500/10 shadow-red-500/10"
        }`}>
          <Database size={14} className={status === "online" ? "animate-pulse" : ""} />
          API: {status.toUpperCase()}
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Lado Esquerdo: Terminal da IA */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden col-span-1 h-[600px]">
          <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700 flex items-center gap-3">
            <Cpu className="text-purple-400 animate-pulse" size={20} />
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-widest">Atividade da IA</h2>
          </div>
          <div className="p-6 flex-1 overflow-y-auto space-y-4 font-mono text-sm">
            {aiLogs.length === 0 ? (
              <div className="text-slate-500 flex flex-col items-center justify-center h-full opacity-50">
                <Activity size={32} className="mb-2" />
                <span>IA em repouso...</span>
                <span className="text-xs mt-2">Aguardando transações</span>
              </div>
            ) : (
              aiLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 animate-in slide-in-from-left-4 fade-in duration-300">
                  <div className="mt-0.5">
                    {log.status === "loading" && (
                      <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
                    )}
                    {log.status === "success" && (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    )}
                    {log.status === "error" && (
                      <ShieldAlert size={16} className="text-red-500" />
                    )}
                  </div>
                  <span className={`${
                    log.status === "loading" ? "text-purple-300" :
                    log.status === "success" ? "text-emerald-300" :
                    "text-red-400"
                  }`}>
                    {log.text}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Centro e Direita: Formulário e Resultado */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário */}
          <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-700 shadow-2xl h-fit">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <CreditCard className="text-blue-400" /> Simular Transação
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Valor da Transação (R$)</label>
                <div className="relative group">
                  <DollarSign className="absolute left-3 top-3 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                  <input type="number" value={form.valor_transacao} className="w-full bg-[#0f172a] border border-slate-600 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 transition-all shadow-inner" 
                    onChange={(e) => setForm({...form, valor_transacao: Number(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Hora da Transação (0-23)</label>
                <div className="relative group">
                  <Clock className="absolute left-3 top-3 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                  <input type="number" value={form.hora_transacao} className="w-full bg-[#0f172a] border border-slate-600 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 transition-all shadow-inner" 
                    onChange={(e) => setForm({...form, hora_transacao: Number(e.target.value)})} />
                </div>
              </div>

              <button onClick={analisarFraude} disabled={loading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-80 group">
                {loading && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                )}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? <><Cpu className="animate-spin" size={18} /> PROCESSANDO COM IA...</> : "ANALISAR COM IA"}
                </span>
              </button>
            </div>
          </div>

          {/* Resultado */}
          <div className="flex flex-col h-full">
            {!resultado ? (
              <div className="text-center p-10 h-full flex flex-col justify-center items-center border-2 border-dashed border-slate-700 rounded-2xl opacity-40 bg-[#1e293b]/50">
                <ShieldCheck size={48} className="mb-4 text-slate-500" />
                <p>Aguardando simulação para análise...</p>
              </div>
            ) : (
              <div className={`p-8 rounded-2xl border-2 shadow-2xl transition-all h-full animate-in fade-in zoom-in duration-500 flex flex-col justify-center ${
                resultado.fraude_detectada 
                  ? "bg-red-500/10 border-red-500/50 shadow-red-500/20" 
                  : "bg-emerald-500/10 border-emerald-500/50 shadow-emerald-500/20"
              }`}>
                <div className="flex flex-col items-center justify-center text-center mb-8 h-32">
                  {resultado.fraude_detectada ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                      <ShieldAlert size={64} className="text-red-500 relative z-10 mb-2 animate-bounce" />
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 rounded-full"></div>
                      <ShieldCheck size={64} className="text-emerald-500 relative z-10 mb-2" />
                    </div>
                  )}
                  <h3 className={`text-2xl font-black mt-4 ${resultado.fraude_detectada ? "text-red-500" : "text-emerald-500"}`}>
                    {resultado.fraude_detectada ? "FRAUDE DETECTADA" : "TRANSAÇÃO SEGURA"}
                  </h3>
                </div>
                
                <div className="space-y-4 bg-[#0f172a]/50 p-6 rounded-xl border border-slate-700/50">
                  <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                    <span className="text-slate-400 flex items-center gap-2"><Cpu size={16}/> Confiança da IA</span>
                    <span className={`font-mono font-black text-lg ${resultado.fraude_probabilidade > 0.8 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {(resultado.fraude_probabilidade * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-400 flex items-center gap-2"><Activity size={16}/> Ação Recomendada</span>
                    <span className="font-bold bg-slate-800 px-3 py-1 rounded-lg text-sm">
                      {resultado.fraude_detectada ? "BLOQUEAR CARTÃO" : "APROVAR COMPRA"}
                    </span>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                    Processado por Deep Neural Network • TensorFlow Backend
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}