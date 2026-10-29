'use client';

import { useState } from 'react';
import { 
  MessageSquare, 
  CheckSquare, 
  Send, 
  Copy, 
  Check, 
  Plus, 
  Clock, 
  Sparkles, 
  X 
} from 'lucide-react';
import { mockStaffAnnouncements, mockStaffTasks } from '@/lib/mock-data';
import { StaffAnnouncement, StaffTask } from '@/lib/types';

export default function ComunicacaoOrganizacaoPage() {
  const [announcements, setAnnouncements] = useState<StaffAnnouncement[]>(mockStaffAnnouncements);
  const [tasks, setTasks] = useState<StaffTask[]>(mockStaffTasks);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modais
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Form Comunicado
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAudience, setNewAudience] = useState<'equipe' | 'responsaveis' | 'todos'>('todos');
  const [newPriority, setNewPriority] = useState<StaffAnnouncement['priority']>('normal');

  // Form Tarefa
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'treino' | 'material' | 'secretaria' | 'financeiro'>('material');
  const [newTaskAssigned, setNewTaskAssigned] = useState('Prof. Marcos Vinícius');
  const [newTaskDueDate, setNewTaskDueDate] = useState('Hoje');

  const handleToggleTask = (index: number) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const handleCopyWhatsApp = (ann: StaffAnnouncement) => {
    const textToCopy = ann.whatsapp_ready_text || `${ann.title}\n\n${ann.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(ann.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnn: StaffAnnouncement = {
      id: `ann-${Date.now()}`,
      title: newTitle,
      content: newContent,
      author: 'Coordenação Sportdesk',
      target_audience: newAudience,
      priority: newPriority,
      created_at: new Date().toISOString().split('T')[0],
      whatsapp_ready_text: `⚽ *COMUNICADO SPORTDESK*: ${newTitle}\n\n${newContent}`,
    };
    setAnnouncements([newAnn, ...announcements]);
    setShowAnnModal(false);
    setNewTitle('');
    setNewContent('');
    alert('Comunicado publicado no mural!');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: StaffTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      category: newTaskCategory,
      assigned_to: newTaskAssigned,
      due_date: newTaskDueDate,
      completed: false,
      priority: 'media',
    };
    setTasks([...tasks, newTask]);
    setShowTaskModal(false);
    setNewTaskTitle('');
    alert('Tarefa adicionada à rotina da equipe!');
  };

  const completedTasksCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> Rotina & Alinhamento
            </span>
            <span className="text-xs text-slate-400">Sportdesk Equipe</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Comunicação & Organização 📢
          </h1>
          <p className="text-sm text-slate-400">
            Centralize comunicados para famílias no WhatsApp e gerencie tarefas internas entre professores e secretaria.
          </p>
        </div>

        <div className="flex gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowAnnModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
          >
            <Send size={16} /> Novo Comunicado
          </button>
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition"
          >
            <Plus size={16} /> Nova Tarefa
          </button>
        </div>
      </div>

      {/* Grid: Mural de Comunicados (Esquerda) + Tarefas Operacionais (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1: Mural de Comunicados & WhatsApp */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-400" />
              Mural de Comunicados & Avisos WhatsApp
            </h2>
            <span className="text-xs text-slate-400">{announcements.length} comunicados</span>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => {
              const isCopied = copiedId === ann.id;
              return (
                <div 
                  key={ann.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 transition hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          ann.priority === 'alta' || ann.priority === 'urgente'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {ann.priority === 'alta' ? '🚨 Importante' : '📌 Geral'}
                        </span>
                        <span className="text-xs text-slate-400">
                          Para: <strong className="text-slate-200 uppercase text-[10px]">{ann.target_audience}</strong>
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1.5">{ann.title}</h3>
                    </div>

                    <span className="text-[11px] text-slate-500 flex items-center gap-1 shrink-0">
                      <Clock size={12} /> {ann.created_at}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                    {ann.content}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">Por: {ann.author}</span>

                    <button
                      onClick={() => handleCopyWhatsApp(ann)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isCopied 
                          ? 'bg-emerald-500 text-slate-950' 
                          : 'bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {isCopied ? <Check size={14} /> : <Copy size={14} />}
                      {isCopied ? 'Texto Copiado!' : 'Copiar p/ WhatsApp'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna 2: Tarefas Internas da Equipe (Checklist) */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 self-start">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckSquare size={16} className="text-emerald-400" />
              Tarefas Operacionais
            </h3>
            <span className="text-xs font-bold text-emerald-400">
              {completedTasksCount}/{tasks.length} concluídas
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Acompanhe checklists diários de materiais, secretaria e preparação técnica dos treinos.
          </p>

          <div className="space-y-2.5 pt-1">
            {tasks.map((task, index) => (
              <div 
                key={task.id}
                onClick={() => handleToggleTask(index)}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                  task.completed 
                    ? 'bg-slate-900/30 border-slate-800/50 opacity-60' 
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {}} // tratado no onClick do container
                  className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                />

                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {task.category}
                    </span>
                    <span>Resp: {task.assigned_to}</span>
                    <span>• {task.due_date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowTaskModal(true)}
            className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition"
          >
            <Plus size={14} /> Adicionar Nova Tarefa
          </button>
        </div>
      </div>

      {/* Modal Novo Comunicado */}
      {showAnnModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Criar Comunicado 📢</h3>
                <p className="text-xs text-slate-400">Publica no mural da equipe e formata para envio aos pais</p>
              </div>
              <button onClick={() => setShowAnnModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Título do Comunicado *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Torneio no Sábado ou Reposição de Aulas"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Destinatário *</label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value as StaffAnnouncement['target_audience'])}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="todos">Todos (Famílias & Equipe)</option>
                    <option value="responsaveis">Somente Responsáveis (Pais)</option>
                    <option value="equipe">Apenas Equipe Técnica</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Prioridade *</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as StaffAnnouncement['priority'])}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="alta">Alta / Importante</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Mensagem Completa *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Escreva as instruções ou orientações..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAnnModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20"
                >
                  Publicar Comunicado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nova Tarefa */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Nova Tarefa Interna 📋</h3>
                <p className="text-xs text-slate-400">Atribua uma atividade para um professor ou para a secretaria</p>
              </div>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Descrição da Tarefa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Calibrar 20 bolas para o treino das 15h"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Categoria *</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as StaffTask['category'])}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="material">Materiais & Campo</option>
                    <option value="treino">Treino & Didática</option>
                    <option value="secretaria">Secretaria & Pais</option>
                    <option value="financeiro">Financeiro & Caixa</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Prazo *</label>
                  <input
                    type="text"
                    required
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Responsável *</label>
                <select
                  value={newTaskAssigned}
                  onChange={(e) => setNewTaskAssigned(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="Prof. Marcos Vinícius">Prof. Marcos Vinícius</option>
                  <option value="Prof. Carlos Eduardo">Prof. Carlos Eduardo</option>
                  <option value="Secretaria Ana">Secretaria Ana</option>
                  <option value="Coordenação Geral">Coordenação Geral</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20"
                >
                  Salvar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
