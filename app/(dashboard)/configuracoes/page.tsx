'use client';

import { Bot, Settings, Zap, Shield, MessageSquare } from 'lucide-react';
import { NICHO_CONFIG } from '@/lib/types';

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-dalva-text-primary">Configurações</h2>
        <p className="text-sm text-dalva-text-muted mt-1">
          Gerencie os agentes de IA, integrações e preferências do sistema
        </p>
      </div>

      {/* AI Agents */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-dalva-gold-muted flex items-center justify-center">
            <Bot className="w-5 h-5 text-dalva-gold" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-dalva-text-primary">Agentes de IA</h3>
            <p className="text-xs text-dalva-text-muted">Configure os agentes por nicho jurídico</p>
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
                  <div className="w-4 h-4 rounded-full bg-green-400 ml-auto mr-0.5 transition-all" />
                </div>
              </div>
              <p className="text-xs text-dalva-text-muted mb-3">
                Agente ativo e respondendo leads de {config.label.toLowerCase()}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-1 rounded-md bg-dalva-surface text-dalva-text-muted">
                  Modelo IA
                </span>
                <span className="text-[10px] px-2 py-1 rounded-md bg-dalva-green-muted text-green-400">
                  Online
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-dalva-blue-muted flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-dalva-text-primary">Integrações</h3>
            <p className="text-xs text-dalva-text-muted">Conecte suas ferramentas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { nome: 'WhatsApp', desc: 'API de mensagens', status: 'Conectado', icon: MessageSquare, corStatus: '#22C55E' },
            { nome: 'Assinatura Digital', desc: 'ZapSign / Clicksign', status: 'Pendente', icon: Shield, corStatus: '#F59E0B' },
            { nome: 'Google Calendar', desc: 'Agendamento automático', status: 'Pendente', icon: Settings, corStatus: '#F59E0B' },
            { nome: 'Pagamentos', desc: 'Asaas / Stripe', status: 'Pendente', icon: Zap, corStatus: '#F59E0B' },
          ].map((integ, i) => {
            const Icon = integ.icon;
            return (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-dalva-border hover:border-dalva-border-hover transition-colors">
                <div className="w-10 h-10 rounded-xl bg-dalva-surface flex items-center justify-center">
                  <Icon className="w-5 h-5 text-dalva-text-muted" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dalva-text-primary">{integ.nome}</p>
                  <p className="text-xs text-dalva-text-muted">{integ.desc}</p>
                </div>
                <span
                  className="text-[10px] px-2 py-1 rounded-md font-medium"
                  style={{
                    background: `${integ.corStatus}15`,
                    color: integ.corStatus,
                  }}
                >
                  {integ.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security */}
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
            { label: 'Criptografia de dados (AES-256)', ativo: true },
            { label: 'IA proibida de dar aconselhamento jurídico', ativo: true },
            { label: 'IA se identifica como assistente virtual', ativo: true },
            { label: 'Bloqueio de captação ativa (compliance OAB)', ativo: true },
            { label: 'Backup automático diário', ativo: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-dalva-border">
              <span className="text-sm text-dalva-text-secondary">{item.label}</span>
              <div
                className={`w-9 h-5 rounded-full flex items-center transition-all cursor-pointer ${
                  item.ativo ? 'bg-dalva-green-muted' : 'bg-dalva-surface'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-all ${
                    item.ativo
                      ? 'bg-green-400 ml-auto mr-0.5'
                      : 'bg-dalva-text-muted ml-0.5'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
