'use client';

import { useState } from 'react';
import { getKanbanColumns } from '@/lib/mock-data';
import { NICHO_CONFIG, Lead } from '@/lib/types';
import { timeAgo, getInitials, getScoreColor, formatPhone } from '@/lib/utils';
import { GripVertical, MessageSquare, Clock, Phone } from 'lucide-react';

export default function KanbanPage() {
  const [columns, setColumns] = useState(getKanbanColumns());
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (targetColumnId: string) => {
    if (!draggedLead) return;

    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        leads:
          col.id === targetColumnId
            ? [...col.leads.filter((l) => l.id !== draggedLead.id), { ...draggedLead, status: targetColumnId as any }]
            : col.leads.filter((l) => l.id !== draggedLead.id),
      }))
    );

    setDraggedLead(null);
    setDragOverColumn(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dalva-text-primary">Kanban</h2>
          <p className="text-sm text-dalva-text-muted mt-1">
            Arraste os cards para mover leads entre etapas do funil
          </p>
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(NICHO_CONFIG).map(([key, config]) => (
            <span
              key={key}
              className="badge"
              style={{ background: config.corBg, color: config.cor }}
            >
              {config.icone} {config.label}
            </span>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`kanban-column transition-all duration-200 ${
              dragOverColumn === column.id ? 'ring-2 ring-dalva-gold/30 bg-dalva-gold-glow' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 px-3 py-3 mb-1">
              <span className="text-base">{column.icone}</span>
              <h3 className="text-sm font-semibold text-dalva-text-primary flex-1">
                {column.titulo}
              </h3>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-lg"
                style={{ background: `${column.cor}20`, color: column.cor }}
              >
                {column.leads.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2 px-1.5 pb-2 min-h-[120px]">
              {column.leads.map((lead) => {
                const nicho = NICHO_CONFIG[lead.nicho];
                return (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead)}
                    className="glass-card-hover p-3.5 cursor-grab active:cursor-grabbing group"
                  >
                    {/* Drag handle + Name */}
                    <div className="flex items-start gap-2 mb-2.5">
                      <GripVertical className="w-4 h-4 text-dalva-text-muted opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                            style={{
                              background: nicho.corBg,
                              color: nicho.cor,
                            }}
                          >
                            {getInitials(lead.nome)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-dalva-text-primary truncate">
                              {lead.nome}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                        style={{ background: nicho.corBg, color: nicho.cor }}
                      >
                        {nicho.icone} {nicho.label}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-md font-bold"
                        style={{
                          background: `${getScoreColor(lead.score)}15`,
                          color: getScoreColor(lead.score),
                        }}
                      >
                        Score {lead.score}
                      </span>
                    </div>

                    {/* Last message */}
                    <p className="text-xs text-dalva-text-muted line-clamp-2 mb-2.5">
                      {lead.ultimaMensagem}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-dalva-text-muted">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px]">{timeAgo(lead.atualizadoEm)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span className="text-[10px]">{formatPhone(lead.telefone)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {column.leads.length === 0 && (
                <div className="flex items-center justify-center h-[100px] text-dalva-text-muted text-xs border-2 border-dashed border-dalva-border rounded-xl">
                  Arraste leads aqui
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
