'use client';

import { useState } from 'react';
import { 
  Building2, 
  Layers, 
  Tag, 
  Save, 
  CheckCircle,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';
import { mockModalities, mockPlans } from '@/lib/mock-data';

export default function ConfiguracoesPage() {
  const [modalities, setModalities] = useState(mockModalities);
  const [plans] = useState(mockPlans);
  const [newModalityName, setNewModalityName] = useState('');
  const [savedSettings, setSavedSettings] = useState(false);

  // Dados da Escolinha
  const [schoolInfo, setSchoolInfo] = useState({
    name: 'Escolinha de Fut',
    phone: '(11) 98765-4321',
    address: 'Av. dos Esportes, 1500 - Arena Central',
    operatingHours: 'Segunda a Sábado, das 07h às 21h',
  });

  const handleAddModality = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModalityName) return;

    setModalities([
      ...modalities,
      {
        id: `mod-${Date.now()}`,
        name: newModalityName,
        status: 'active'
      }
    ]);
    setNewModalityName('');
  };

  const handleSaveConfigs = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Configurações da Escolinha ⚙️
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Parâmetros operacionais, modalidades ativas, planos de mensalidade e dados da unidade.
        </p>
      </div>

      {savedSettings && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
          <CheckCircle size={20} />
          <p className="font-semibold text-sm">Configurações salvas com sucesso!</p>
        </div>
      )}

      {/* Grid de Configurações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados da Unidade */}
        <div className="lg:col-span-2 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Building2 className="text-emerald-400" size={20} />
            <h2 className="text-base font-bold text-white">Dados da Unidade Esportiva</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Nome da Escolinha</label>
              <input
                type="text"
                value={schoolInfo.name}
                onChange={e => setSchoolInfo({...schoolInfo, name: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">WhatsApp de Atendimento</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={schoolInfo.phone}
                  onChange={e => setSchoolInfo({...schoolInfo, phone: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Endereço dos Campos / Quadras</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={schoolInfo.address}
                  onChange={e => setSchoolInfo({...schoolInfo, address: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Horário de Funcionamento</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={schoolInfo.operatingHours}
                  onChange={e => setSchoolInfo({...schoolInfo, operatingHours: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modalidades Esportivas */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Layers className="text-emerald-400" size={20} />
            <h2 className="text-base font-bold text-white">Modalidades Oferecidas</h2>
          </div>

          <div className="space-y-2">
            {modalities.map(m => (
              <div key={m.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.description || 'Modalidade ativa'}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ativa
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddModality} className="pt-2 flex gap-2">
            <input
              type="text"
              placeholder="Nova modalidade (ex: Vôlei, Basquete)..."
              value={newModalityName}
              onChange={e => setNewModalityName(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
            >
              Adicionar
            </button>
          </form>
        </div>

        {/* Planos de Mensalidade */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Tag className="text-emerald-400" size={20} />
            <h2 className="text-base font-bold text-white">Planos & Valores Padrão</h2>
          </div>

          <div className="space-y-2">
            {plans.map(p => (
              <div key={p.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{p.name}</p>
                  <p className="text-xs text-slate-500">Cobrança mensal</p>
                </div>
                <span className="text-sm font-bold text-emerald-400">
                  {p.base_amount === 0 ? 'Bolsa Gratuita' : `R$ ${p.base_amount.toFixed(2)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          onClick={handleSaveConfigs}
          className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-500/10"
        >
          <Save size={18} /> Salvar Alterações
        </button>
      </div>
    </div>
  );
}
