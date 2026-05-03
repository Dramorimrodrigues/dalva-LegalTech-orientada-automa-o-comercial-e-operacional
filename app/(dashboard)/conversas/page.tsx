'use client';

import { useState, useEffect, useRef } from 'react';
import { NICHO_CONFIG, STATUS_CONFIG } from '@/lib/types';
import { timeAgo, getInitials, formatPhone, cn } from '@/lib/utils';
import { Search, Bot, User, Shield, Send, Phone, MoreVertical } from 'lucide-react';

export default function ConversasPage() {
  const [conversas, setConversas] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carrega lista de conversas
  useEffect(() => {
    const load = () => {
      fetch('/api/conversations')
        .then(r => r.json())
        .then(res => {
          if (res.success) {
            setConversas(res.data);
            if (!selectedId && res.data.length > 0) setSelectedId(res.data[0].leadId);
          }
        });
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [selectedId]);

  // Carrega mensagens da conversa selecionada (polling a cada 3s)
  useEffect(() => {
    if (!selectedId) return;
    const load = () => {
      fetch(`/api/conversations/${selectedId}/messages`)
        .then(r => r.json())
        .then(res => { if (res.success) setMessages(res.data); });
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [selectedId]);

  // Scroll automático para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selected = conversas.find(c => c.leadId === selectedId);
  const filtered = conversas.filter(c => c.lead.nome.toLowerCase().includes(search.toLowerCase()));

  const senderConfig: Record<string, { icon: React.ElementType; label: string; bubbleClass: string }> = {
    lead: { icon: User, label: 'Cliente', bubbleClass: 'chat-bubble-lead' },
    ia: { icon: Bot, label: 'Dalva IA', bubbleClass: 'chat-bubble-ia' },
    advogado: { icon: Shield, label: 'Advogado', bubbleClass: 'chat-bubble-advogado' },
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedId || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/conversations/${selectedId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        setMessage('');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-dalva-text-primary">Conversas</h2>
        <p className="text-sm text-dalva-text-muted mt-1">Acompanhe as conversas da IA com os leads em tempo real</p>
      </div>

      <div className="grid grid-cols-[380px_1fr] gap-4 h-[calc(100vh-220px)]">
        {/* Lista */}
        <div className="glass-card flex flex-col overflow-hidden">
          <div className="p-3 border-b border-dalva-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dalva-text-muted" />
              <input
                type="text"
                placeholder="Buscar conversas..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-sm bg-dalva-surface border border-dalva-border text-dalva-text-primary placeholder:text-dalva-text-muted outline-none focus:border-dalva-gold/30 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map(conversa => {
              const nicho = NICHO_CONFIG[conversa.lead.nicho as keyof typeof NICHO_CONFIG];
              if (!nicho) return null;
              const isSelected = conversa.leadId === selectedId;
              return (
                <button
                  key={conversa.leadId}
                  onClick={() => setSelectedId(conversa.leadId)}
                  className={cn('w-full flex items-start gap-3 p-3.5 text-left transition-colors border-b border-dalva-border/50',
                    isSelected ? 'bg-dalva-gold-glow border-l-2 border-l-dalva-gold' : 'hover:bg-white/[0.02]'
                  )}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: nicho.corBg, color: nicho.cor }}>
                    {getInitials(conversa.lead.nome)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-medium text-dalva-text-primary truncate">{conversa.lead.nome}</span>
                      <span className="text-[10px] text-dalva-text-muted flex-shrink-0 ml-2" suppressHydrationWarning>{timeAgo(conversa.lead.atualizadoEm)}</span>
                    </div>
                    <p className="text-xs text-dalva-text-muted truncate">{conversa.lead.ultimaMensagem}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md font-medium" style={{ background: nicho.corBg, color: nicho.cor }}>{nicho.label}</span>
                      {conversa.naoLidas > 0 && (
                        <span className="w-4.5 h-4.5 rounded-full bg-dalva-gold text-dalva-bg text-[9px] font-bold flex items-center justify-center px-1.5">{conversa.naoLidas}</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat */}
        {selected ? (
          <div className="glass-card flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-dalva-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold"
                  style={{ background: NICHO_CONFIG[selected.lead.nicho as keyof typeof NICHO_CONFIG]?.corBg, color: NICHO_CONFIG[selected.lead.nicho as keyof typeof NICHO_CONFIG]?.cor }}>
                  {getInitials(selected.lead.nome)}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-dalva-text-primary">{selected.lead.nome}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-dalva-text-muted flex items-center gap-1">
                      <Phone className="w-3 h-3" />{formatPhone(selected.lead.telefone)}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md font-medium"
                      style={{ background: STATUS_CONFIG[selected.lead.status as keyof typeof STATUS_CONFIG]?.corBg, color: STATUS_CONFIG[selected.lead.status as keyof typeof STATUS_CONFIG]?.cor }}>
                      {STATUS_CONFIG[selected.lead.status as keyof typeof STATUS_CONFIG]?.icone} {STATUS_CONFIG[selected.lead.status as keyof typeof STATUS_CONFIG]?.label}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-dalva-green-muted text-green-400 hover:bg-green-500/20 transition-colors">
                  Assumir Conversa
                </button>
                <button className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors">
                  <MoreVertical className="w-4 h-4 text-dalva-text-muted" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map(msg => {
                const config = senderConfig[msg.remetente];
                if (!config) return null;
                const Icon = config.icon;
                const isLead = msg.remetente === 'lead';
                return (
                  <div key={msg.id} className={cn('flex gap-2.5', isLead ? 'justify-start' : 'justify-end')}>
                    {isLead && (
                      <div className="w-7 h-7 rounded-lg bg-dalva-blue-muted flex items-center justify-center flex-shrink-0 mt-1">
                        <Icon className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                    )}
                    <div>
                      <div className={config.bubbleClass}>
                        <p className="text-dalva-text-primary whitespace-pre-line leading-relaxed">{msg.conteudo}</p>
                      </div>
                      <div className={cn('flex items-center gap-1 mt-1', isLead ? '' : 'justify-end')}>
                        <span className="text-[10px] text-dalva-text-muted">{config.label}</span>
                        <span className="text-[10px] text-dalva-text-muted">·</span>
                        <span className="text-[10px] text-dalva-text-muted" suppressHydrationWarning>{timeAgo(msg.timestamp)}</span>
                      </div>
                    </div>
                    {!isLead && (
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1',
                        msg.remetente === 'ia' ? 'bg-dalva-gold-muted' : 'bg-dalva-green-muted')}>
                        <Icon className={cn('w-3.5 h-3.5', msg.remetente === 'ia' ? 'text-dalva-gold' : 'text-green-400')} />
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-5 py-3.5 border-t border-dalva-border">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Responder como advogado..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-dalva-surface border border-dalva-border text-dalva-text-primary placeholder:text-dalva-text-muted outline-none focus:border-dalva-gold/30 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !message.trim()}
                  className="p-2.5 rounded-xl bg-dalva-gold hover:bg-dalva-gold-soft transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-dalva-bg" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card flex items-center justify-center">
            <p className="text-dalva-text-muted text-sm">Selecione uma conversa</p>
          </div>
        )}
      </div>
    </div>
  );
}
