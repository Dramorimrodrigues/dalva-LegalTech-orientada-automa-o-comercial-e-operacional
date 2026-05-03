'use client';

import { useEffect, useState, useCallback } from 'react';
import { Bot, Settings, Zap, Shield, MessageSquare, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { NICHO_CONFIG } from '@/lib/types';

type WaStatus = 'not_configured' | 'disconnected' | 'connecting' | 'connected';

export default function ConfiguracoesPage() {
  const [waStatus, setWaStatus] = useState<WaStatus>('disconnected');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [waLoading, setWaLoading] = useState(false);
  const [polling, setPolling] = useState(false);

  const fetchWaStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/whatsapp');
      const data = await res.json();
      if (data.success) {
        setWaStatus(data.data.status);
        setQrCode(data.data.qrCode ?? null);
        return data.data.status;
      }
    } catch {}
    return 'disconnected';
  }, []);

  // Polling enquanto aguarda conexão
  useEffect(() => {
    fetchWaStatus();
  }, [fetchWaStatus]);

  useEffect(() => {
    if (waStatus !== 'connecting') return;
    const interval = setInterval(async () => {
      const status = await fetchWaStatus();
      if (status === 'connected') clearInterval(interval);
    }, 3000);
    return () => clearInterval(interval);
  }, [waStatus, fetchWaStatus]);

  const handleConnect = async () => {
    setWaLoading(true);
    try {
      await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect' }),
      });
      await fetchWaStatus();
    } finally {
      setWaLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setWaLoading(true);
    try {
      await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disconnect' }),
      });
      setWaStatus('disconnected');
      setQrCode(null);
    } finally {
      setWaLoading(false);
    }
  };

  const statusLabel: Record<WaStatus, string> = {
    not_configured: 'Não configurado',
    disconnected: 'Desconectado',
    connecting: 'Aguardando QR Code...',
    connected: 'Conectado',
  };

  const statusColor: Record<WaStatus, string> = {
    not_configured: '#6B7280',
    disconnected: '#EF4444',
    connecting: '#F59E0B',
    connected: '#22C55E',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-dalva-text-primary">Configurações</h2>
        <p className="text-sm text-dalva-text-muted mt-1">Gerencie os agentes de IA, integrações e preferências</p>
      </div>

      {/* WhatsApp */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-dalva-green-muted flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-dalva-text-primary">WhatsApp</h3>
            <p className="text-xs text-dalva-text-muted">Conecte seu número via QR Code</p>
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: `${statusColor[waStatus]}20`, color: statusColor[waStatus] }}>
            {waStatus === 'connected' ? <Wifi className="w-3 h-3 inline mr-1" /> : <WifiOff className="w-3 h-3 inline mr-1" />}
            {statusLabel[waStatus]}
          </span>
        </div>

        {waStatus === 'not_configured' && (
          <div className="p-4 rounded-xl bg-dalva-surface border border-dalva-border text-sm text-dalva-text-muted">
            Configure as variáveis <code className="text-dalva-gold">EVOLUTION_API_URL</code> e <code className="text-dalva-gold">EVOLUTION_API_KEY</code> no arquivo <code className="text-dalva-gold">.env.local</code> para usar o WhatsApp.
          </div>
        )}

        {(waStatus === 'disconnected' || waStatus === 'not_configured') && (
          <button
            onClick={handleConnect}
            disabled={waLoading || waStatus === 'not_configured'}
            className="mt-4 px-4 py-2 rounded-xl text-sm font-medium bg-dalva-gold text-dalva-bg hover:bg-dalva-gold-soft transition-colors disabled:opacity-50"
          >
            {waLoading ? 'Iniciando...' : 'Conectar WhatsApp'}
          </button>
        )}

        {waStatus === 'connecting' && (
          <div className="mt-4 flex flex-col items-center gap-4">
            {qrCode ? (
              <div className="p-3 bg-white rounded-2xl">
                <img src={qrCode} alt="QR Code WhatsApp" className="w-56 h-56" />
              </div>
            ) : (
              <div className="w-56 h-56 rounded-2xl bg-dalva-surface border-2 border-dashed border-dalva-border flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-dalva-text-muted animate-spin" />
              </div>
            )}
            <p className="text-sm text-dalva-text-muted text-center">
              Abra o WhatsApp no celular → <strong>Dispositivos conectados</strong> → <strong>Conectar dispositivo</strong>
            </p>
            <button onClick={fetchWaStatus} className="text-xs text-dalva-gold hover:underline flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Atualizar QR
            </button>
          </div>
        )}

        {waStatus === 'connected' && (
          <div className="mt-4 flex items-center justify-between p-4 rounded-xl bg-dalva-green-muted">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-green-400 font-medium">WhatsApp conectado e recebendo mensagens</span>
            </div>
            <button
              onClick={handleDisconnect}
              disabled={waLoading}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Desconectar
            </button>
          </div>
        )}
      </div>

      {/* Agentes IA */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-dalva-gold-muted flex items-center justify-center">
            <Bot className="w-5 h-5 text-dalva-gold" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-dalva-text-primary">Agentes de IA</h3>
            <p className="text-xs text-dalva-text-muted">Gemini 1.5 Flash — qualificação automática por nicho</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(NICHO_CONFIG).map(([key, config]) => (
            <div key={key} className="p-4 rounded-xl border border-dalva-border hover:border-dalva-border-hover transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{config.icone}</span>
                  <span className="text-sm font-medium text-dalva-text-primary">{config.label}</span>
                </div>
                <div className="w-9 h-5 rounded-full bg-dalva-green-muted flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-400 ml-auto mr-0.5" />
                </div>
              </div>
              <p className="text-xs text-dalva-text-muted mb-3">Qualificando leads de {config.label.toLowerCase()} automaticamente</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-1 rounded-md bg-dalva-surface text-dalva-text-muted">Gemini 1.5 Flash</span>
                <span className="text-[10px] px-2 py-1 rounded-md bg-dalva-green-muted text-green-400">Ativo</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Segurança */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-dalva-purple-muted flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-dalva-text-primary">Segurança & Compliance</h3>
            <p className="text-xs text-dalva-text-muted">LGPD e guardrails da OAB</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: 'IA proibida de dar aconselhamento jurídico', ativo: true },
            { label: 'IA se identifica como assistente virtual', ativo: true },
            { label: 'Bloqueio de captação ativa (compliance OAB)', ativo: true },
            { label: 'Dados armazenados no Railway (Brasil)', ativo: true },
            { label: 'Backup automático diário', ativo: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-dalva-border">
              <span className="text-sm text-dalva-text-secondary">{item.label}</span>
              <div className={`w-9 h-5 rounded-full flex items-center transition-all cursor-pointer ${item.ativo ? 'bg-dalva-green-muted' : 'bg-dalva-surface'}`}>
                <div className={`w-4 h-4 rounded-full transition-all ${item.ativo ? 'bg-green-400 ml-auto mr-0.5' : 'bg-dalva-text-muted ml-0.5'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
