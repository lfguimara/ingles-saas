import type { Chapter } from "./content";

export type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 20;
const MAX_CHARS = 2000;

export function buildSystemPrompt(ch: Chapter): string {
  return `Você é o Max, tutor de inglês da SpeakUp, uma plataforma para brasileiros.

O aluno está lendo o capítulo "${ch.title}" do e-book "${ch.ebook.title}", nível ${ch.level.cefr} (${ch.level.title}).

Como você trabalha:
- Fale com o aluno em português do Brasil, num tom leve e encorajador. Os exemplos e exercícios ficam em inglês.
- Mantenha o foco no conteúdo deste capítulo. Se o aluno puxar outro assunto, responda brevemente e traga a conversa de volta para o capítulo.
- Ajuste a dificuldade ao nível ${ch.level.cefr}: frases curtas e vocabulário simples nos níveis iniciais, nuances e naturalidade nos avançados.
- Quando pedirem exercícios, proponha de 3 a 5 itens numerados, baseados no capítulo, e espere o aluno responder.
- Ao corrigir, mostre o que estava certo, aponte cada erro e explique o porquê em uma frase, depois dê a versão corrigida.
- Não entregue a resposta de um exercício antes de o aluno tentar. Se ele travar, dê uma dica primeiro.
- Seja breve: no máximo uns 120 palavras por resposta, a menos que o aluno peça mais. Use **negrito** para destacar o inglês correto.

Texto do capítulo:
<capitulo>
${ch.content}
</capitulo>`;
}

/** Valida o histórico vindo do navegador: só user/assistant, texto, últimas 20, começando pelo aluno. */
export function sanitizeHistory(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  const clean = input
    .filter((m): m is ChatMessage => !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim() !== "")
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_MESSAGES);
  while (clean.length && clean[0].role !== "user") clean.shift();
  return clean;
}

/** Resposta usada quando não há ANTHROPIC_API_KEY configurada. */
export function demoReply(ch: Chapter, userText: string): string {
  const t = userText.toLowerCase();
  const phrases = [...ch.content.matchAll(/\*\*([A-Z][^*]{6,60}[.!?])\*\*/g)].map((m) => m[1]);
  const pick = phrases.slice(0, 3);

  if (t.includes("exerc")) {
    return [
      `Bora praticar **${ch.title}**! 💪`,
      "",
      "**Exercício:** escreva uma frase sua no mesmo estilo de cada exemplo abaixo:",
      ...pick.map((p, i) => `${i + 1}. *${p}*`),
      "",
      "Mande suas 3 frases que eu corrijo.",
    ].join("\n");
  }
  if (t.includes("corrij") || t.includes("corrig")) {
    return "Manda a frase que você quer que eu corrija! ✍️\n\n_(No modo demonstração eu ainda não corrijo de verdade. Com a chave da IA configurada, eu aponto cada erro e explico o porquê.)_";
  }
  if (t.includes("explique") || t.includes("de novo")) {
    return `Resumindo **${ch.title}** em uma linha: ${ch.content.split("\n").find((l) => l.trim() && !l.startsWith("#"))?.slice(0, 220) ?? ""}\n\nQuer que eu passe uns exercícios sobre isso?`;
  }
  return `Boa! 👏 Estou em **modo demonstração**, então ainda não entendo respostas livres. Assim que a chave da IA for configurada, eu converso de verdade, corrijo e explico.\n\nEnquanto isso, experimente o botão **"Me passe exercícios"**.`;
}
