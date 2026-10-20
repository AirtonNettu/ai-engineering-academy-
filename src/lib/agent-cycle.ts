/** Fronteira didática de uma ferramenta local. Não é um servidor MCP nem um LLM. */
export function executeReadTool(
  proposedCall: unknown,
  allowedTools: ReadonlySet<string>,
  documents: Readonly<Record<string, string>>,
): { ok: true; value: string } | { ok: false; reason: string } {
  // Uma sugestão do modelo nunca concede permissão de execução.
  if (
    !proposedCall ||
    typeof proposedCall !== 'object' ||
    Array.isArray(proposedCall)
  )
    return { ok: false, reason: 'Chamada inválida' };
  const call = proposedCall as Record<string, unknown>;
  if (call.name !== 'lookup' || !allowedTools.has('lookup'))
    return { ok: false, reason: 'Ação não autorizada' };
  if (
    !call.arguments ||
    typeof call.arguments !== 'object' ||
    Array.isArray(call.arguments)
  )
    return { ok: false, reason: 'Argumentos inválidos' };
  const args = call.arguments as Record<string, unknown>;
  if (
    Object.keys(call).some((k) => !['name', 'arguments'].includes(k)) ||
    Object.keys(args).some((k) => k !== 'term') ||
    typeof args.term !== 'string' ||
    args.term.length > 100
  )
    return { ok: false, reason: 'Argumentos inválidos' };
  if (!Object.hasOwn(documents, args.term))
    return { ok: false, reason: 'Documento não encontrado' };
  return { ok: true, value: documents[args.term] };
}
