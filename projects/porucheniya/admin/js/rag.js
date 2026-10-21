import { KNOWLEDGE_DOCS } from "./data/knowledge-base.js";
import { MemoryVectorStore, chunkDocument } from "./vector-store.js";

let storePromise = null;

/** Индексация корпуса (один раз за сессию) — аналог load → split → embed → upsert */
export async function getKnowledgeStore() {
  if (!storePromise) {
    storePromise = (async () => {
      const store = new MemoryVectorStore("porucheniya-policy");
      const chunks = KNOWLEDGE_DOCS.flatMap((d) => chunkDocument(d));
      await store.addDocuments(chunks);
      return { store, chunkCount: chunks.length, docCount: KNOWLEDGE_DOCS.length };
    })();
  }
  return storePromise;
}

export async function retrieve(query, k = 4) {
  const { store } = await getKnowledgeStore();
  const hits = await store.similaritySearch(query, k);
  return {
    hits,
    wire: `RAG_CONTEXT:${hits
      .map((h) => `(${h.metadata?.source}) ${h.pageContent}`)
      .join("\n---\n")}END_RAG`,
  };
}
