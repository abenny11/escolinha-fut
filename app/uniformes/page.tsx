'use client';

import { useState } from 'react';
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  Plus, 
  Search, 
  Clock, 
  Filter, 
  X,
  Shirt
} from 'lucide-react';
import { mockUniformItems, mockUniformSales, mockStudents } from '@/lib/mock-data';
import { UniformItem, UniformSale, PaymentMethod } from '@/lib/types';

export default function UniformesPage() {
  const [items, setItems] = useState<UniformItem[]>(mockUniformItems);
  const [sales, setSales] = useState<UniformSale[]>(mockUniformSales);
  const [activeTab, setActiveTab] = useState<'estoque' | 'vendas'>('estoque');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');

  // Modais
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);

  // Form Venda
  const [saleStudentName, setSaleStudentName] = useState(mockStudents[0]?.full_name || '');
  const [saleItemId, setSaleItemId] = useState(items[0]?.id || '');
  const [saleQuantity, setSaleQuantity] = useState(1);
  const [salePaymentMethod, setSalePaymentMethod] = useState<PaymentMethod>('pix');

  // Form Novo Item / Reposição
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'kit_completo' | 'camisa' | 'calcao' | 'meiao' | 'agasalho' | 'colete_treino'>('kit_completo');
  const [newItemSize, setNewItemSize] = useState('Sub-11 (10 anos)');
  const [newItemCost, setNewItemCost] = useState(60);
  const [newItemPrice, setNewItemPrice] = useState(130);
  const [newItemQuantity, setNewItemQuantity] = useState(20);
  const [newItemMinStock, setNewItemMinStock] = useState(5);

  // Métricas
  const totalStockUnits = items.reduce((acc, curr) => acc + curr.stock_quantity, 0);
  const lowStockCount = items.filter(i => i.status === 'estoque_baixo' || i.status === 'esgotado').length;
  const totalSalesRevenue = sales.reduce((acc, curr) => acc + curr.total_amount, 0);
  const pendingDeliveryCount = sales.filter(s => s.delivery_status === 'pendente_retirada').length;

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    const item = items.find(i => i.id === saleItemId);
    if (!item) return;

    if (item.stock_quantity < saleQuantity) {
      alert('Estoque insuficiente para esta quantidade!');
      return;
    }

    const totalAmount = item.sale_price * saleQuantity;
    const newSale: UniformSale = {
      id: `sale-${Date.now()}`,
      student_name: saleStudentName,
      item_name: item.name,
      size: item.size,
      quantity: saleQuantity,
      total_amount: totalAmount,
      payment_method: salePaymentMethod,
      sale_date: new Date().toISOString().split('T')[0],
      delivery_status: 'pendente_retirada',
    };

    // Atualiza estoque
    const updatedItems = items.map(i => {
      if (i.id === item.id) {
        const newQty = i.stock_quantity - saleQuantity;
        let newStatus: UniformItem['status'] = 'em_estoque';
        if (newQty <= 0) newStatus = 'esgotado';
        else if (newQty <= i.min_stock_alert) newStatus = 'estoque_baixo';
        return { ...i, stock_quantity: newQty, status: newStatus };
      }
      return i;
    });

    setItems(updatedItems);
    setSales([newSale, ...sales]);
    setShowSaleModal(false);
    alert(`Venda de R$ ${totalAmount.toFixed(2)} registrada com sucesso para ${saleStudentName}!`);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    let status: UniformItem['status'] = 'em_estoque';
    if (newItemQuantity <= 0) status = 'esgotado';
    else if (newItemQuantity <= newItemMinStock) status = 'estoque_baixo';

    const newItem: UniformItem = {
      id: `uni-${Date.now()}`,
      name: newItemName,
      category: newItemCategory,
      size: newItemSize,
      cost_price: Number(newItemCost),
      sale_price: Number(newItemPrice),
      stock_quantity: Number(newItemQuantity),
      min_stock_alert: Number(newItemMinStock),
      status,
    };

    setItems([...items, newItem]);
    setShowAddItemModal(false);
    setNewItemName('');
    alert('Item/Lote de uniforme adicionado com sucesso!');
  };

  const handleMarkDelivered = (saleId: string) => {
    setSales(sales.map(s => s.id === saleId ? { ...s, delivery_status: 'entregue' } : s));
  };

  const filteredItems = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.size.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'todos' || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Shirt size={12} /> Materiais & Uniformes
            </span>
            <span className="text-xs text-slate-400">Sportdesk Estoque</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Uniformes & Estoque 👕
          </h1>
          <p className="text-sm text-slate-400">
            Controle modelos, tamanhos, pedidos de reposição e vendas de kits oficiais para os alunos.
          </p>
        </div>

        <div className="flex gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowSaleModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
          >
            <ShoppingCart size={16} /> Nova Venda
          </button>
          <button
            onClick={() => setShowAddItemModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition"
          >
            <Plus size={16} /> Adicionar Produto
          </button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Peças em Estoque</span>
            <Package size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white mt-1">{totalStockUnits} un</p>
          <span className="text-[11px] text-emerald-400 font-medium">Pronto para entrega</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Alerta de Reposição</span>
            <AlertTriangle size={16} className="text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 mt-1">{lowStockCount} itens</p>
          <span className="text-[11px] text-slate-400 font-medium">Estoque baixo ou esgotado</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Vendas Realizadas</span>
            <ShoppingCart size={16} className="text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white mt-1">R$ {totalSalesRevenue.toFixed(2)}</p>
          <span className="text-[11px] text-blue-400 font-medium">Total arrecadado</span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Aguardando Retirada</span>
            <Clock size={16} className="text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white mt-1">{pendingDeliveryCount} pedidos</p>
          <span className="text-[11px] text-purple-400 font-medium">Entregar aos pais no treino</span>
        </div>
      </div>

      {/* Abas Estoque vs Histórico de Vendas */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('estoque')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'estoque' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          📦 Catálogo & Níveis de Estoque ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('vendas')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'vendas' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          🧾 Histórico de Vendas & Entregas ({sales.length})
        </button>
      </div>

      {/* ABA 1: ESTOQUE */}
      {activeTab === 'estoque' && (
        <div className="space-y-4">
          {/* Barra de Filtro */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por produto ou tamanho..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <Filter size={14} className="text-slate-500 mr-1 hidden sm:block" />
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'kit_completo', label: 'Kits Oficiais' },
                { id: 'camisa', label: 'Camisas' },
                { id: 'calcao', label: 'Calções' },
                { id: 'meiao', label: 'Meiões' },
                { id: 'agasalho', label: 'Agasalhos' },
                { id: 'colete_treino', label: 'Coletes' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    categoryFilter === cat.id 
                      ? 'bg-emerald-500 text-slate-950' 
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabela de Produtos */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Produto</th>
                    <th className="py-3 px-4">Tamanho</th>
                    <th className="py-3 px-4">Custo</th>
                    <th className="py-3 px-4">Venda</th>
                    <th className="py-3 px-4">Margem</th>
                    <th className="py-3 px-4">Em Estoque</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredItems.map(item => {
                    const margin = item.sale_price - item.cost_price;
                    const marginPercent = Math.round((margin / item.sale_price) * 100);

                    return (
                      <tr key={item.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                          <Shirt size={16} className="text-emerald-400 shrink-0" />
                          <span>{item.name}</span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-200">
                          {item.size}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          R$ {item.cost_price.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          R$ {item.sale_price.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-emerald-400 font-semibold">
                          +{marginPercent}% (R$ {margin.toFixed(2)})
                        </td>
                        <td className="py-3.5 px-4 font-bold">
                          <span className={`text-sm ${
                            item.stock_quantity === 0 
                              ? 'text-rose-400' 
                              : item.stock_quantity <= item.min_stock_alert 
                              ? 'text-amber-400' 
                              : 'text-white'
                          }`}>
                            {item.stock_quantity} un
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            item.status === 'em_estoque' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : item.status === 'estoque_baixo' 
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {item.status === 'em_estoque' && '✓ Em Estoque'}
                            {item.status === 'estoque_baixo' && '⚠️ Repor Estoque'}
                            {item.status === 'esgotado' && '✕ Esgotado'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSaleItemId(item.id);
                              setShowSaleModal(true);
                            }}
                            disabled={item.stock_quantity === 0}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Vender
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: HISTÓRICO DE VENDAS */}
      {activeTab === 'vendas' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">Aluno / Família</th>
                  <th className="py-3 px-4">Item & Tamanho</th>
                  <th className="py-3 px-4">Qtd</th>
                  <th className="py-3 px-4">Valor Total</th>
                  <th className="py-3 px-4">Pagamento</th>
                  <th className="py-3 px-4">Entrega</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sales.map(sale => (
                  <tr key={sale.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3 px-4 text-slate-400">{sale.sale_date}</td>
                    <td className="py-3 px-4 font-bold text-white">{sale.student_name}</td>
                    <td className="py-3 px-4 text-slate-200">
                      {sale.item_name} <span className="text-slate-400">({sale.size})</span>
                    </td>
                    <td className="py-3 px-4">{sale.quantity}x</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      R$ {sale.total_amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 uppercase text-[11px] text-slate-400">
                      {sale.payment_method}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        sale.delivery_status === 'entregue'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}>
                        {sale.delivery_status === 'entregue' ? '✓ Entregue' : '⏳ Aguardando Retirada'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {sale.delivery_status === 'pendente_retirada' && (
                        <button
                          onClick={() => handleMarkDelivered(sale.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition"
                        >
                          Confirmar Entrega
                        </button>
                      )}
                      {sale.delivery_status === 'entregue' && (
                        <span className="text-slate-500 text-xs">Concluído</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Registrar Venda */}
      {showSaleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Registrar Venda de Uniforme 👕</h3>
                <p className="text-xs text-slate-400">Gera lançamento financeiro e baixa automática no estoque</p>
              </div>
              <button onClick={() => setShowSaleModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSale} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Aluno / Comprador *</label>
                <select
                  value={saleStudentName}
                  onChange={(e) => setSaleStudentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {mockStudents.map(s => (
                    <option key={s.id} value={s.full_name}>
                      {s.full_name} ({s.current_class?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Item do Uniforme *</label>
                <select
                  value={saleItemId}
                  onChange={(e) => setSaleItemId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {items.map(i => (
                    <option key={i.id} value={i.id} disabled={i.stock_quantity === 0}>
                      {i.name} - {i.size} | R$ {i.sale_price.toFixed(2)} ({i.stock_quantity} em estoque)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Quantidade *</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={saleQuantity}
                    onChange={(e) => setSaleQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Forma de Pagamento *</label>
                  <select
                    value={salePaymentMethod}
                    onChange={(e) => setSalePaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="pix">PIX Instantâneo</option>
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="debit_card">Cartão de Débito</option>
                    <option value="cash">Dinheiro em Espécie</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSaleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20"
                >
                  Concluir Venda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Adicionar Produto */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Novo Produto / Reposição 📦</h3>
                <p className="text-xs text-slate-400">Cadastre novo uniforme ou registre lote recebido da fábrica</p>
              </div>
              <button onClick={() => setShowAddItemModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Kit Jogo Oficial 2026"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Categoria *</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as UniformItem['category'])}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="kit_completo">Kit Completo</option>
                    <option value="camisa">Camisa</option>
                    <option value="calcao">Calção</option>
                    <option value="meiao">Meião</option>
                    <option value="agasalho">Agasalho</option>
                    <option value="colete_treino">Colete de Treino</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Tamanho *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sub-11 ou Tam 10"
                    value={newItemSize}
                    onChange={(e) => setNewItemSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Preço de Custo (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Preço de Venda (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Quantidade Entrando *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Alerta Mínimo *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newItemMinStock}
                    onChange={(e) => setNewItemMinStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20"
                >
                  Salvar no Estoque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
