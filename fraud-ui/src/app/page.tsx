"use client";
import { useState, useEffect } from "react";
import { ShieldAlert, ShieldCheck, Activity, DollarSign, Clock, CreditCard } from "lucide-react";

export default function Home() {
  const [status, setStatus] = useState("checking");
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
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

  const analisarFraude = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResultado(data);
    } catch (err) {
      console.error("Erro na API", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-4 md:p-10">
      {/* Header com Status */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            DeepAudit Dashboard
          </h1>
          <p className="text-slate-400 text-sm">Monitoramento Antifraude em Tempo Real</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
          status === "online" ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10" : "border-red-500/50 text-red-400 bg-red-500/10"
        }`}>
          <Activity size={14} />
          {status.toUpperCase()}
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lado Esquerdo: Formulário */}
        <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-700 shadow-2xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <CreditCard className="text-blue-400" /> Simular Transação
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Valor da Transação (R$)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 text-slate-500" size={18} />
                <input type="number" value={form.valor_transacao} className="w-full bg-[#0f172a] border border-slate-600 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 transition" 
                  onChange={(e) => setForm({...form, valor_transacao: Number(e.target.value)})} />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Hora da Transação (0-23)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-slate-500" size={18} />
                <input type="number" value={form.hora_transacao} className="w-full bg-[#0f172a] border border-slate-600 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 transition" 
                  onChange={(e) => setForm({...form, hora_transacao: Number(e.target.value)})} />
              </div>
            </div>

            <button onClick={analisarFraude} disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50">
              {loading ? "PROCESSANDO..." : "ANALISAR COM IA"}
            </button>
          </div>
        </div>

        {/* Lado Direito: Resultado */}
        <div className="flex flex-col justify-center">
          {!resultado ? (
            <div className="text-center p-10 border-2 border-dashed border-slate-700 rounded-2xl opacity-40">
              <ShieldCheck size={48} className="mx-auto mb-4" />
              <p>Aguardando simulação para análise...</p>
            </div>
          ) : (
            <div className={`p-8 rounded-2xl border-2 transition-all animate-in fade-in zoom-in duration-300 ${
              resultado.fraude_detectada ? "bg-red-500/10 border-red-500/50" : "bg-emerald-500/10 border-emerald-500/50"
            }`}>
              <div className="flex items-center gap-4 mb-4">
                {resultado.fraude_detectada ? (
                  <ShieldAlert size={40} className="text-red-500" />
                ) : (
                  <ShieldCheck size={40} className="text-emerald-500" />
                )}
                <h3 className={`text-2xl font-black ${resultado.fraude_detectada ? "text-red-500" : "text-emerald-500"}`}>
                  {resultado.fraude_detectada ? "FRAUDE SUSPEITA" : "TRANSACÃO SEGURA"}
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-700 py-2">
                  <span className="text-slate-400">Confiança da IA:</span>
                  <span className="font-mono font-bold">{(resultado.fraude_probabilidade * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 py-2">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold">{resultado.fraude_detectada ? "Bloqueado" : "Aprovado"}</span>
                </div>
              </div>
              
              <p className="text-xs text-slate-500 mt-6 uppercase tracking-widest text-center">
                Análise baseada em Deep Learning (TensorFlow)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}