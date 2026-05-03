// Converte modelos do banco (inglês) para os tipos do frontend (português)

export function mapLead(lead: any) {
  return {
    id: lead.id,
    nome: lead.name,
    telefone: lead.phone,
    email: lead.email ?? undefined,
    nicho: lead.niche,
    status: lead.status,
    score: lead.score,
    resumoCaso: lead.aiSummary ?? '',
    criadoEm: lead.createdAt instanceof Date ? lead.createdAt.toISOString() : lead.createdAt,
    atualizadoEm: lead.updatedAt instanceof Date ? lead.updatedAt.toISOString() : lead.updatedAt,
    ultimaMensagem: lead.lastMessage ?? '',
  };
}

export function mapMessage(msg: any) {
  return {
    id: msg.id,
    leadId: msg.leadId,
    remetente: msg.sender,
    conteudo: msg.content,
    timestamp: msg.createdAt instanceof Date ? msg.createdAt.toISOString() : msg.createdAt,
  };
}
