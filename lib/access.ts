import type { ChapterMeta } from "./content";
import type { Plan } from "./usage";

export const canRead = (plan: Plan, chapter: Pick<ChapterMeta, "free">) => plan === "pro" || chapter.free;
