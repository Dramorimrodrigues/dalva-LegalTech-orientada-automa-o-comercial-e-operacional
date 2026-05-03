'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { NICHO_CONFIG, STATUS_CONFIG, NichoJuridico, LeadStatus, Lead } from '@/lib/types';
import { timeAgo, getInitials, getScoreColor, formatPhone, cn } from '@/lib/utils';
import {
  Search, ArrowUpDown, Eye, MessageSquare, MoreHorizontal, Download, SlidersHorizontal,
} from 'lucide-react';

const NICHO_VALUES = ['todos', 'consumidor', 'trabalhista', 'previdenciario'] as const;
const STATUS_VALUES = ['todos', 'novo', 'qualificando', 'qualificado', 'contrato_enviado', 'convertido', 'descartado'] as const;
type SortField = 'nome' | 'score' | 'criadoEm' | 'atualizadoEm';
type SortDir = 'asc' | 'desc';

function LeadsContent() {
  const searchParams = useSearchParams();
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [nichoFilter, setNichoFilter] = useState<NichoJuridico | 'todos'>('todos');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'todos'>('todos');
  const [sortField, setSortField] = useState<SortField>('atualizadoEm');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch('/api/leads')
      .then(r => r.json())
      .then(res => { if (res.success) setAllLeads(res.data.leads); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearch(q);
  }, [searchParams]);

  const filteredLeads = useMemo(() => {
    let result = [...allLeads];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.nome.toLowerCase().includes(q) || l.telefone.includes(q) || l.resumoCaso.toLowerCase().includes(q)
      );
    }
    if (nichoFilter !== 'todos') result = result.filter(l => l.nicho === nichoFilter);
    if (statusFilter !== 'todos') result = result.filter(l => l.status === statusFilter);
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'nome': cmp = a.nome.localeCompare(b.nome); break;
        case 'score': cmp = a.score - b.score; break;
        case 'criadoEm': cmp = new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime(); break;
        case 'atualizadoEm': cmp = new Date(a.atualizadoEm).getTime() - new Date(b.atualizadoEm).getTime(); break;
      }
      if (cmp === 0) cmp = a.id.localeCompare(b.id);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [allLeads, search, nichoFilter, statusFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-dalva-gold/30 border-t-dalva-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dalva-text-primary">Leads</h2>
          <p className="text-sm text-dalva-text-muted mt-1">{filteredLeads.length} leads encontrados</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-dalva-surface border border-dalva-border text-dalva-text-secondary hover:border-dalva-border-hover transition-colors">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dalva-text-muted" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou caso..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-dalva-surface border border-dalva-border text-dalva-text-primary placeholder:text-dalva-text-muted outline-none focus:border-dalva-gold/30 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn('flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm border transition-colors',
              showFilters ? 'bg-dalva-gold-muted border-dalva-gold/20 text-dalva-gold' : 'bg-dalva-surface border-dalva-border text-dalva-text-secondary hover:border-dalva-border-hover'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </button>
        </div>
        {showFilters && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-dalva-border animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-xs text-dalva-text-muted">Nicho:</span>
              <select value={nichoFilter} onChange={e => setNichoFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg text-xs bg-dalva-surface border border-dalva-border text-dalva-text-primary outline-none focus:border-dalva-gold/30">
                <option value="todos">Todos</option>
                <option value="consumidor">🛒 Consumidor</option>
                <option value="trabalhista">⚒️ Trabalhista</option>
                <option value="previdenciario">🏛️ Previdenciário</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-dalva-text-muted">Status:</span>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg text-xs bg-dalva-surface border border-dalva-border text-dalva-text-primary outline-none focus:border-dalva-gold/30">
                <option value="todos">Todos</option>
                <option value="novo">📥 Novo</option>
                <option value="qualificando">🤖 Qualificando</option>
                <option value="qualificado">✅ Qualificado</option>
                <option value="contrato_enviado">📄 Contrato Enviado</option>
                <option value="convertido">🤝 Convertido</option>
                <option value="descartado">❌ Descartado</option>
              </select>
            </div>
            {(nichoFilter !== 'todos' || statusFilter !== 'todos') && (
              <button onClick={() => { setNichoFilter('todos'); setStatusFilter('todos'); }}
                className="text-xs text-dalva-gold hover:text-dalva-gold-soft transition-colors">
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dalva-border">
                <th className="text-left px-5 py-3.5">
                  <button onClick={() => toggleSort('nome')} className="flex items-center gap-1 text-xs font-semibold text-dalva-text-muted uppercase tracking-wider hover:text-dalva-text-secondary transition-colors">
                    Lead <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left px-5 py-3.5"><span className="text-xs font-semibold text-dalva-text-muted uppercase tracking-wider">Nicho</span></th>
                <th className="text-left px-5 py-3.5"><span className="text-xs font-semibold text-dalva-text-muted uppercase tracking-wider">Status</span></th>
                <th className="text-center px-5 py-3.5">
                  <button onClick={() => toggleSort('score')} className="flex items-center gap-1 text-xs font-semibold text-dalva-text-muted uppercase tracking-wider hover:text-dalva-text-secondary transition-colors mx-auto">
                    Score <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left px-5 py-3.5"><span className="text-xs font-semibold text-dalva-text-muted uppercase tracking-wider">Caso</span></th>
                <th className="text-left px-5 py-3.5">
                  <button onClick={() => toggleSort('atualizadoEm')} className="flex items-center gap-1 text-xs font-semibold text-dalva-text-muted uppercase tracking-wider hover:text-dalva-text-secondary transition-colors">
                    Atualizado <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-center px-5 py-3.5"><span className="text-xs font-semibold text-dalva-text-muted uppercase tracking-wider">Ações</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => {
                const nicho = NICHO_CONFIG[lead.nicho as NichoJuridico];
                const status = STATUS_CONFIG[lead.status as LeadStatus];
                if (!nicho || !status) return null;
                return (
                  <tr key={lead.id} className="border-b border-dalva-border/50 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: nicho.corBg, color: nicho.cor }}>
                          {getInitials(lead.nome)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-dalva-text-primary">{lead.nome}</p>
                          <p className="text-[11px] text-dalva-text-muted">{formatPhone(lead.telefone)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="badge text-[10px]" style={{ background: nicho.corBg, color: nicho.cor }}>{nicho.icone} {nicho.label}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="badge text-[10px]" style={{ background: status.corBg, color: status.cor }}>{status.icone} {status.label}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="text-sm font-bold" style={{ color: getScoreColor(lead.score) }}>{lead.score}</span>
                    </td>
                    <td className="px-5 py-3.5 max-w-[280px]">
                      <p className="text-xs text-dalva-text-secondary truncate">{lead.resumoCaso}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-dalva-text-muted" suppressHydrationWarning>{timeAgo(lead.atualizadoEm)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors" title="Ver conversa"><MessageSquare className="w-3.5 h-3.5 text-dalva-text-muted" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors" title="Ver detalhes"><Eye className="w-3.5 h-3.5 text-dalva-text-muted" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors" title="Mais opções"><MoreHorizontal className="w-3.5 h-3.5 text-dalva-text-muted" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredLeads.length === 0 && !loading && (
          <div className="py-12 text-center">
            <p className="text-sm text-dalva-text-muted">Nenhum lead encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-dalva-gold/30 border-t-dalva-gold rounded-full animate-spin" /></div>}>
      <LeadsContent />
    </Suspense>
  );
}
