/**
 * MemoryVectorStore — лёгкий аналог Chroma / PGVector / Qdrant для PoC в браузере.
 * Интерфейс совместим по смыслу: addDocuments → similaritySearch.
 * В проде: заменить на @langchain/community Chroma / PGVector.
 */

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .split(/[^a-zа-я0-9]+/i)
    .filter((t) => t.length > 2);
}

/** Простой bag-of-words embedding (демо). В проде — text-embedding-3-small / bge. */
export function embedText(text, dim = 64) {
  const vec = new Float32Array(dim);
  const tokens = tokenize(text);
  tokens.forEach((tok, i) => {
    let h = 2166136261;
    for (let c = 0; c < tok.length; c++) {
      h ^= tok.charCodeAt(c);
      h = Math.imul(h, 16777619);
    }
    const idx = Math.abs(h) % dim;
    vec[idx] += 1 + (i % 3) * 0.1;
  });
  let norm = 0;
  for (let i = 0; i < dim; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < dim; i++) vec[i] /= norm;
  return vec;
}

function cosine(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

export class MemoryVectorStore {
  constructor(name = "memory") {
    this.name = name;
    this.docs = [];
  }

  async addDocuments(documents) {
    for (const doc of documents) {
      const pageContent = doc.pageContent || doc.text || "";
      this.docs.push({
        id: doc.id || `doc-${this.docs.length}`,
        pageContent,
        metadata: doc.metadata || {},
        embedding: embedText(pageContent),
      });
    }
    return this;
  }

  async similaritySearch(query, k = 4) {
    const q = embedText(query);
    return this.docs
      .map((d) => ({ ...d, score: cosine(q, d.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(({ embedding, ...rest }) => rest);
  }

  /** Alias как у LangChain retriever */
  asRetriever(k = 4) {
    const store = this;
    return {
      async invoke(query) {
        return store.similaritySearch(query, k);
      },
    };
  }
}

export function chunkDocument(doc, chunkSize = 220, overlap = 40) {
  const text = doc.text || doc.pageContent || "";
  const chunks = [];
  if (text.length <= chunkSize) {
    return [
      {
        id: `${doc.id}-0`,
        pageContent: text,
        metadata: { source: doc.source || doc.id, parentId: doc.id },
      },
    ];
  }
  let i = 0;
  let n = 0;
  while (i < text.length) {
    const slice = text.slice(i, i + chunkSize);
    chunks.push({
      id: `${doc.id}-${n}`,
      pageContent: slice.trim(),
      metadata: { source: doc.source || doc.id, parentId: doc.id, chunk: n },
    });
    n += 1;
    i += chunkSize - overlap;
  }
  return chunks;
}
