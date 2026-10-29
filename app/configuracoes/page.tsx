'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Layers, 
  Tag, 
  Save, 
  CheckCircle,
  Phone,
  MapPin,
  Clock,
  Upload,
  Trash2,
  QrCode,
  Mail,
  User,
  Shield,
  FileCheck
} from 'lucide-react';
import { mockModalities, mockPlans } from '@/lib/mock-data';

export default function ConfiguracoesPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalities, setModalities] = useState(mockModalities);
  const [plans] = useState(mockPlans);
  const [newModalityName, setNewModalityName] = useState('');
  const [newModalityDesc, setNewModalityDesc] = useState('');
  const [savedSettings, setSavedSettings] = useState(false);

  // Estado geral de configurações da escolinha
  const [config, setConfig] = useState({
    // Identidade Visual
    logoUrl: '',
    schoolName: 'Escolinha de Futebol Craques Pro',
    tradeName: 'Craques Pro',
    documentNumber: '12.345.678/0001-90',
    directorName: 'Prof. Carlos Eduardo Silveira',
    
    // Contato
    phone: '(11) 98765-4321',
    email: 'contato@escolinhacraquespro.com.br',
    
    // Endereço e Instalações
    postalCode: '04571-010',
    addressStreet: 'Av. dos Esportes',
    addressNumber: '1500',
    addressComplement: 'Complexo Arena Central - Portão 2',
    addressNeighborhood: 'Jardim Esportivo',
    addressCity: 'São Paulo',
    addressState: 'SP',
    operatingHours: 'Segunda a Sábado, das 07h às 21h',
    numberOfFields: 3,

    // Financeiro & Chave Pix
    pixKeyType: 'CNPJ',
    pixKey: '12.345.678/0001-90',
    pixHolderName: 'Escola de Formação Esportiva Craques Pro Ltda',
    pixBank: 'Banco Inter (077)',
    defaultDueDay: 10,
    gracePeriodDays: 3,

    // Pedagógico & Turmas
    maxStudentsPerCoach: 18,
    minAttendanceRatePct: 75,
  });

  // Carregar dados salvos do localStorage ao montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem('escolinha_pro_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfig(prev => ({ ...prev, ...parsed }));
      }
    } catch {
      // Ignora erro de parsing
    }
  }, []);

  // Upload da Logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setConfig(prev => ({ ...prev, logoUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setConfig(prev => ({ ...prev, logoUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Salvar configurações
  const handleSaveConfigs = () => {
    try {
      localStorage.setItem('escolinha_pro_settings', JSON.stringify(config));
    } catch {
      // localStorage indisponível ou cheio
    }
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
  };

  const handleAddModality = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModalityName.trim()) return;

    setModalities([
      ...modalities,
      {
        id: `mod-${Date.now()}`,
        name: newModalityName,
        description: newModalityDesc || 'Nova modalidade esportiva cadastrada',
        status: 'active'
      }
    ]);
    setNewModalityName('');
    setNewModalityDesc('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Configurações da Escolinha ⚙️
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Logotipo, dados da entidade, dados bancários/PIX, endereço das quadras e regras de funcionamento.
          </p>
        </div>

        <button
          onClick={handleSaveConfigs}
          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <Save size={18} /> Salvar Todas as Configurações
        </button>
      </div>

      {savedSettings && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 flex items-center gap-3 animate-fadeIn">
          <CheckCircle size={20} />
          <div>
            <p className="font-bold text-sm">Configurações salvas com sucesso!</p>
            <p className="text-xs text-emerald-400">Os dados foram atualizados e serão refletidos nos relatórios, chamadas e carteirinhas.</p>
          </div>
        </div>
      )}

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ======================================================== */}
        {/* COLUNA 1: IDENTIDADE VISUAL & LOGOTIPO DA ESCOLINHA */}
        {/* ======================================================== */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Shield className="text-emerald-400" size={20} />
            <h2 className="text-base font-bold text-white">Logotipo da Escolinha</h2>
          </div>

          <p className="text-xs text-slate-400">
            A imagem da logo será exibida na barra lateral, no cabeçalho das fichas de alunos, relatórios de scout e carteirinhas digitais.
          </p>

          {/* Área de Preview da Logo */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-900/60 border-2 border-dashed border-slate-800 rounded-2xl">
            {config.logoUrl ? (
              <div className="space-y-3 text-center">
                <div className="w-28 h-28 mx-auto rounded-2xl bg-slate-950 border border-slate-700 p-2 flex items-center justify-center overflow-hidden shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={config.logoUrl} 
                    alt="Logo da Escolinha" 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                  <CheckCircle size={14} /> Logo Personalizada Ativa
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20">
                  ⚽
                </div>
                <p className="text-xs text-slate-400 font-medium">Nenhuma logo personalizada.</p>
                <span className="text-[11px] text-slate-500 block">Exibindo emblema padrão</span>
              </div>
            )}

            {/* Input escondido */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
              onChange={handleLogoUpload}
              className="hidden"
            />

            {/* Botões de Ação */}
            <div className="flex items-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
              >
                <Upload size={14} /> {config.logoUrl ? 'Trocar Imagem' : 'Enviar Logo'}
              </button>
              {config.logoUrl && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 transition"
                  title="Remover e usar padrão"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <span className="text-[10px] text-slate-500 mt-3 text-center">
              Recomendado: imagem quadrada ou brasão transparente (PNG/SVG, máx. 2MB).
            </span>
          </div>

          {/* Mini Preview de como fica na Sidebar */}
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
              Pré-visualização na Barra de Menus:
            </span>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-xl overflow-hidden">
                {config.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={config.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  '⚽'
                )}
              </div>
              <div className="truncate">
                <span className="font-black text-slate-100 text-sm block leading-tight truncate">
                  {config.tradeName || 'Escolinha Pro'}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">Gestão & Performance</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUNA 2 & 3: DADOS CADASTRAIS, INSTALAÇÕES & PIX */}
        {/* ======================================================== */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* BLOCO 1: DADOS INSTITUCIONAIS */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Building2 className="text-emerald-400" size={20} />
              <h2 className="text-base font-bold text-white">Dados Cadastrais da Unidade</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nome Oficial da Escolinha / Razão Social</label>
                <input
                  type="text"
                  value={config.schoolName}
                  onChange={e => setConfig({ ...config, schoolName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nome Fantasia (Aparece no App)</label>
                <input
                  type="text"
                  value={config.tradeName}
                  onChange={e => setConfig({ ...config, tradeName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">CNPJ ou CPF do Responsável</label>
                <input
                  type="text"
                  value={config.documentNumber}
                  onChange={e => setConfig({ ...config, documentNumber: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Diretor / Coordenador Técnico</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={config.directorName}
                    onChange={e => setConfig({ ...config, directorName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">WhatsApp de Atendimento da Secretaria</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={config.phone}
                    onChange={e => setConfig({ ...config, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">E-mail Institucional</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={config.email}
                    onChange={e => setConfig({ ...config, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BLOCO 2: ENDEREÇO & ESTRUTURA DOS CAMPOS */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <MapPin className="text-emerald-400" size={20} />
              <h2 className="text-base font-bold text-white">Endereço & Estrutura das Quadras</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">CEP</label>
                <input
                  type="text"
                  value={config.postalCode}
                  onChange={e => setConfig({ ...config, postalCode: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">Logradouro / Avenida / Rua</label>
                <input
                  type="text"
                  value={config.addressStreet}
                  onChange={e => setConfig({ ...config, addressStreet: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Número</label>
                <input
                  type="text"
                  value={config.addressNumber}
                  onChange={e => setConfig({ ...config, addressNumber: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">Complemento / Arena</label>
                <input
                  type="text"
                  value={config.addressComplement}
                  onChange={e => setConfig({ ...config, addressComplement: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Bairro</label>
                <input
                  type="text"
                  value={config.addressNeighborhood}
                  onChange={e => setConfig({ ...config, addressNeighborhood: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Cidade</label>
                <input
                  type="text"
                  value={config.addressCity}
                  onChange={e => setConfig({ ...config, addressCity: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Estado (UF)</label>
                <input
                  type="text"
                  value={config.addressState}
                  onChange={e => setConfig({ ...config, addressState: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Horário de Funcionamento Geral</label>
                <div className="relative">
                  <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={config.operatingHours}
                    onChange={e => setConfig({ ...config, operatingHours: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Quantidade de Quadras / Campos</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={config.numberOfFields}
                  onChange={e => setConfig({ ...config, numberOfFields: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* BLOCO 3: COBRANÇA, PIX & POLÍTICA FINANCEIRA */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <QrCode className="text-emerald-400" size={20} />
              <h2 className="text-base font-bold text-white">Configurações Financeiras & Chave PIX</h2>
            </div>

            <p className="text-xs text-slate-400">
              Esses dados são gerados nos links de pagamento via WhatsApp e na área do responsável para recebimento das mensalidades.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tipo de Chave PIX</label>
                <select
                  value={config.pixKeyType}
                  onChange={e => setConfig({ ...config, pixKeyType: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="CNPJ">CNPJ</option>
                  <option value="Celular">Telefone Celular</option>
                  <option value="E-mail">E-mail</option>
                  <option value="Aleatória">Chave Aleatória (EVP)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Chave PIX Oficial</label>
                <input
                  type="text"
                  value={config.pixKey}
                  onChange={e => setConfig({ ...config, pixKey: e.target.value })}
                  placeholder="Informe a chave exata para recebimento"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nome do Titular da Conta</label>
                <input
                  type="text"
                  value={config.pixHolderName}
                  onChange={e => setConfig({ ...config, pixHolderName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Banco / Instituição Financeira</label>
                <input
                  type="text"
                  value={config.pixBank}
                  onChange={e => setConfig({ ...config, pixBank: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Dia Padrão de Vencimento</label>
                <select
                  value={config.defaultDueDay}
                  onChange={e => setConfig({ ...config, defaultDueDay: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value={5}>Dia 05 de cada mês</option>
                  <option value={10}>Dia 10 de cada mês</option>
                  <option value={15}>Dia 15 de cada mês</option>
                  <option value={20}>Dia 20 de cada mês</option>
                  <option value={25}>Dia 25 de cada mês</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Dias de Carência pós-vencimento</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={config.gracePeriodDays}
                  onChange={e => setConfig({ ...config, gracePeriodDays: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* BLOCO 4: PARÂMETROS PEDAGÓGICOS E TURMAS */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <FileCheck className="text-emerald-400" size={20} />
              <h2 className="text-base font-bold text-white">Parâmetros Pedagógicos & Metodologia</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Lotação Máxima Recomendada por Turma</label>
                <input
                  type="number"
                  min="10"
                  max="35"
                  value={config.maxStudentsPerCoach}
                  onChange={e => setConfig({ ...config, maxStudentsPerCoach: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Alerta quando a turma atingir este limite de inscritos.</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Presença Mínima para Destaque/Graduação (%)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={config.minAttendanceRatePct}
                  onChange={e => setConfig({ ...config, minAttendanceRatePct: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Abaixo desta porcentagem aciona o radar de busca ativa contra evasão.</span>
              </div>
            </div>
          </div>

          {/* BLOCO 5: MODALIDADES E PLANOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Modalidades */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Layers className="text-emerald-400" size={18} />
                <h3 className="text-sm font-bold text-white">Modalidades Oferecidas</h3>
              </div>

              <div className="space-y-2">
                {modalities.map(m => (
                  <div key={m.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{m.name}</p>
                      <p className="text-[11px] text-slate-400">{m.description || 'Modalidade ativa'}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 text-[10px]">
                      Ativa
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddModality} className="space-y-2 pt-2 border-t border-slate-800/80">
                <input
                  type="text"
                  placeholder="Nome (ex: Basquete, Futevôlei)..."
                  value={newModalityName}
                  onChange={e => setNewModalityName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Descrição breve..."
                    value={newModalityDesc}
                    onChange={e => setNewModalityDesc(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Adicionar
                  </button>
                </div>
              </form>
            </div>

            {/* Planos */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Tag className="text-emerald-400" size={18} />
                <h3 className="text-sm font-bold text-white">Planos de Mensalidade</h3>
              </div>

              <div className="space-y-2">
                {plans.map(p => (
                  <div key={p.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{p.name}</p>
                      <p className="text-[11px] text-slate-400">Cobrança mensal</p>
                    </div>
                    <span className="font-black text-emerald-400">
                      {p.base_amount === 0 ? 'Bolsista' : `R$ ${p.base_amount.toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Flutuante / Fixo para Salvar */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={handleSaveConfigs}
          className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition flex items-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-95"
        >
          <Save size={18} /> Salvar Todas as Configurações
        </button>
      </div>
    </div>
  );
}
