import type { Plan } from "./usage";

/** Não existe teste grátis: só assinante lê os capítulos. */
export const canRead = (plan: Plan) => plan === "pro";
