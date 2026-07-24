# Product Requirements Document: Study Platform — Caching Layer + AI Features (Phase 2)

**Version:** 1.0
**Status:** Draft
**Base Product:** Existing full-stack study material platform (login, subject/syllabus/PYQ browsing already built)
**Scope of this PRD:** (1) Frontend subject-data caching (LRU, capacity 2), (2) RAG-based doubt-solving chatbot, (3) AI-generated practice quizzes/flashcards from notes

---

## 1. Overview

### 1.1 Purpose
This phase adds two things on top of the existing platform: a lightweight frontend caching layer to reduce redundant loads when students bounce between subjects, and two AI features that turn the platform from a static content repository into an interactive study tool — a doubt-solving chatbot grounded in the platform's own notes (RAG), and auto-generated practice quizzes/flashcards from that same content.

### 1.2 Problem Statement
- Students frequently switch between 2–3 subjects in a single session (e.g. checking DBMS notes, then OS PYQs, then back to DBMS) — currently every switch re-fetches data from the server even if nothing changed.
- Students want quick answers to specific doubts without manually searching through PDFs; a chatbot grounded in the platform's actual notes is more trustworthy and relevant than a generic AI chatbot.
- Passive reading (notes/PYQs) has no active recall component — quizzes/flashcards generated from the same notes give students a way to self-test without anyone manually authoring questions.

### 1.3 Goals
- Reduce redundant network requests for subject data using a small in-memory frontend cache (capacity: 2 subjects, LRU eviction).
- Let students ask natural-language questions and get answers grounded in the platform's own notes, with source attribution.
- Let students generate a quiz or flashcard set on demand from a subject/topic's notes.

### 1.4 Non-Goals (this phase)
- Redis or any server-side caching (explicitly out of scope here — frontend-only, per current data volume).
- Cross-session cache persistence (cache is in-memory, cleared on page refresh/tab close — not localStorage).
- General-purpose/open-domain chatbot (must stay grounded in platform content; not a substitute for ChatGPT).
- Adaptive/personalized quiz difficulty based on student performance history (flagged as a future phase).
- Contributor/moderator roles and content-tagging pipeline (mentioned in prior discussion, but not part of this PRD).

---

## 2. Feature 1: Frontend Subject Data Caching

### 2.1 Requirement
Cache the data (notes, syllabus, PYQs — whatever bundle constitutes "subject data") for the **last 2 distinct subjects accessed**. When a 3rd distinct subject is accessed, evict the **least recently accessed** of the two cached subjects and cache the new one. Re-accessing an already-cached subject should serve from cache and refresh its recency, not evict anything.

This is a capacity-2 LRU (Least Recently Used) cache, not a simple FIFO — accessing a cached subject again should count as a "use" and move it to most-recently-used, not just insertion order. (The original phrasing — "3rd replaces the first accessed one" — is FIFO behavior for the specific case where you never revisit a subject; LRU is the more correct/standard generalization since it also handles the revisit case correctly. Flagging this so you can confirm which is intended — see Open Questions.)

### 2.2 Behavior Spec

| Sequence of subject visits | Cache state after each visit |
|---|---|
| Visit DBMS | `[DBMS]` |
| Visit OS | `[DBMS, OS]` |
| Visit DBMS again | `[OS, DBMS]` (DBMS refreshed to most-recent) |
| Visit CN (3rd distinct) | `[DBMS, CN]` (OS evicted — it was least recently used) |
| Visit DBMS again | `[CN, DBMS]` |

- Cache key: `subjectId` (or `subjectSlug`).
- Cache value: the full data bundle needed to render the subject page (syllabus, notes list/content refs, PYQ list) — whatever the existing subject-detail API returns.
- Cache scope: per browser tab/session, in-memory only (JS variable / React state / a small store) — no `localStorage`/`sessionStorage` (per your existing constraint of no browser storage in this kind of state, and because it doesn't need to survive a refresh).

### 2.3 Implementation Approach
- Implement as a small custom hook (e.g. `useSubjectCache`) backed by a `Map` (Maps preserve insertion order in JS, and re-inserting a key moves it to the end — this maps naturally onto LRU: on cache hit, delete + re-set the key to bump its recency; on miss with a full cache, delete the first/oldest key before inserting the new one).
- On subject page load: check cache → if hit, render immediately from cache (no network call) and bump recency; if miss, show loading state, fetch from API, store in cache, evict oldest if cache size > 2.
- If using React Query/SWR already (recommended from earlier discussion) for other read-heavy data, this custom LRU layer can sit **in addition to** it — React Query's own cache is time/staleness-based and per-query, not capacity-bounded to "2 subjects," so it doesn't by itself satisfy this specific requirement. Simplest path: keep this as a small standalone hook rather than trying to force React Query's cache config to mimic capacity-2 LRU.
- Cache invalidation: if a subject's content is edited/updated server-side while cached client-side, the cached copy could go stale within the session. Given this is a study-materials site (content doesn't change minute-to-minute), a short `staleTime` check (e.g. re-fetch if cached entry is older than N minutes) is a reasonable safeguard — see Open Questions.

### 2.4 Success Criteria
- Switching back to one of the last 2 visited subjects shows content with no visible loading spinner / no network request (verifiable in devtools Network tab).
- Visiting a 3rd distinct subject correctly evicts the right one per the LRU rule above.
- No memory growth issue — cache never holds more than 2 subject bundles at once.

---

## 3. Feature 2: RAG-Based Doubt-Solving Chatbot

### 3.1 Requirement
A chatbot where a student types a question (e.g. "explain normalization in DBMS") and receives an answer generated from the platform's own indexed notes for that subject — not a generic LLM answer — with a reference back to the source note/page it drew from.

### 3.2 User Flow
1. Student opens the chatbot (subject-scoped — launched from within a subject's page, so retrieval is naturally narrowed to that subject's content; or global with subject auto-detected from the question).
2. Student asks a question.
3. Backend retrieves the most relevant chunks from that subject's indexed notes (vector similarity search).
4. Backend sends the question + retrieved chunks to an LLM with a prompt constraining it to answer using only the provided context.
5. Response is streamed back to the student with a citation (e.g. "From: DBMS Unit 3 Notes, p.12") linking to the source material.
6. If no sufficiently relevant chunks are found (low similarity scores), the bot should say it doesn't have enough material on that topic rather than falling back to ungrounded general knowledge — this is what keeps it trustworthy and on-brand for the platform.

### 3.3 Architecture

**Ingestion pipeline (one-time / on content upload):**
- Extract text from existing notes (PDFs) → chunk into passages (e.g. ~500-token chunks with slight overlap) → generate embeddings for each chunk → store in a vector store, tagged with `subjectId`, source file, and page/section reference.

**Query-time pipeline:**
- Embed the student's question → similarity search (top-k, e.g. k=4–6) scoped to the relevant `subjectId` → construct a prompt with the retrieved chunks as context → call the LLM → stream response → attach source citations from the retrieved chunks' metadata.

### 3.4 Data Model Additions
```
NoteChunk {
  _id, subjectId, sourceFileId, sourceFileName,
  pageOrSection, text, embedding (vector),
  createdAt
}

ChatSession {
  _id, userId, subjectId, createdAt
}

ChatMessage {
  _id, sessionId, role [user|assistant], content,
  citedChunkIds[], createdAt
}
```

### 3.5 API Endpoints (Representative)
```
POST   /api/chat/sessions                  (start a session, scoped to subjectId)
POST   /api/chat/sessions/:id/messages     (send a question, get streamed answer)
GET    /api/chat/sessions/:id              (retrieve history)
POST   /api/admin/ingest/:subjectId        (trigger re-indexing of a subject's notes)
```

### 3.6 Tech Additions
- **Vector store**: given your current stack, either a dedicated vector DB (Qdrant/Weaviate/pgvector) or Redis Stack's vector search if you'd rather not add another service — reasonable to pick based on what's simplest to run alongside what you already host.
- **Embeddings model**: any standard embedding API (e.g. OpenAI `text-embedding-3-small`, or an open-source alternative if cost is a concern for a student project).
- **LLM for answer generation**: a cost-effective model (e.g. a smaller/cheaper hosted model) is likely sufficient here since answers are grounded/constrained by retrieved context rather than requiring deep unaided reasoning.
- **Caching consideration (from earlier discussion)**: cache LLM responses for near-identical (subjectId, normalized question) pairs — likely in Redis if you introduce it for this feature, since many students will ask overlapping doubts. This directly controls per-request cost.

### 3.7 Non-Functional Requirements
- Answers must be traceable to source content (no hallucinated citations — only cite chunks actually retrieved and used).
- Response streaming so the student sees output progressively rather than waiting for the full answer.
- Rate limiting per user to control LLM API cost abuse.
- Graceful degradation: if the LLM API is down/rate-limited, show a clear error rather than a silent failure.

---

## 4. Feature 3: AI-Generated Practice Quizzes / Flashcards from Notes

### 4.1 Requirement
Student selects a subject (and optionally a specific unit/topic), clicks "Generate Quiz" or "Generate Flashcards," and receives an AI-generated set of questions drawn from that subject's notes.

### 4.2 Scope for This Phase
- **Quiz format**: multiple-choice questions (MCQs) — 4 options, 1 correct answer, generated with a brief explanation for the correct answer.
- **Flashcard format**: simple term/question front, answer/explanation back.
- Generation is **on-demand**, not pre-generated/stored in bulk for every subject upfront (keeps this scoped and avoids stale content if notes are updated) — though generated sets can optionally be cached/saved so repeated requests for the same subject+unit don't always re-hit the LLM (reuses the same infra pattern as chatbot response caching above).
- No adaptive difficulty, no performance tracking/analytics on quiz attempts in this phase — pure generate-and-attempt, score shown immediately client-side.

### 4.3 User Flow
1. Student picks subject (+ optional unit/topic) and quiz size (e.g. 5/10 questions) or flashcard count.
2. Backend retrieves relevant note chunks for that subject/unit (reuses the same retrieval infra as the chatbot — this is why building #2 before or alongside this one is efficient).
3. LLM is prompted to generate structured MCQs/flashcards **strictly from the provided note content**, in a fixed JSON schema.
4. Backend validates the JSON structure (retry once if malformed) before sending to frontend.
5. Frontend renders an interactive quiz/flashcard UI; student answers/flips through; score or completion shown at the end.

### 4.4 Data Model Additions
```
GeneratedQuiz {
  _id, subjectId, unit (optional), type [quiz|flashcards],
  questions[ {
    questionText, options[] (quiz only), correctAnswerIndex (quiz only),
    answerText (flashcards only), explanation, sourceChunkIds[]
  } ],
  createdBy, createdAt
}

QuizAttempt {
  _id, quizId, userId, score, answeredAt
}
```
*(`QuizAttempt` is optional for this phase — include only if you want basic "your last score" display; not required for core functionality.)*

### 4.5 API Endpoints (Representative)
```
POST   /api/quizzes/generate       (body: subjectId, unit?, type, count)
GET    /api/quizzes/:id
POST   /api/quizzes/:id/attempts   (optional - record a score)
```

### 4.6 Non-Functional Requirements
- Output must be validated against a strict schema before being shown to the student (a malformed or off-topic AI response should never silently reach the UI).
- Generated questions should not be presented as authoritative/exam-verified — clearly label as "AI-generated practice questions" so students calibrate trust appropriately.
- Reasonable generation latency (a few seconds); show a loading state, not a blocking spinner with no feedback.

---

## 5. Shared Infrastructure Note

Features 2 and 3 both depend on the same underlying pipeline: **notes → chunked, embedded, retrievable content**. Building the ingestion/retrieval layer once and reusing it for both the chatbot and the quiz generator is more efficient than building them as separate pipelines — this also matches the natural build order (retrieval infra first, then the two features that consume it).

---

## 6. Suggested Build Order

| Phase | Scope |
|---|---|
| **Phase 1** | Frontend LRU subject cache (capacity 2) — independent, ships fastest, no AI infra needed |
| **Phase 2** | Ingestion pipeline: chunk + embed existing notes, store in vector store, scoped by subject |
| **Phase 3** | RAG chatbot: retrieval + LLM answer generation + citations + streaming UI |
| **Phase 4** | Quiz/flashcard generator: reuse retrieval from Phase 2, add generation prompt + schema validation + UI |
| **Phase 5** | Cost/perf pass: response caching for repeated questions/quiz requests, rate limiting |

---

## 7. Success Metrics

- **Caching**: % reduction in subject-data network requests per session (before/after); measurable via devtools or basic frontend logging.
- **Chatbot**: % of questions answered with a grounded citation vs. "not enough material" fallback; session engagement (messages per session).
- **Quizzes**: quizzes generated per active user; completion rate (started vs. finished).

---

## 8. Open Questions

- **Caching**: is strict LRU (as specified above, handling revisits correctly) the intended behavior, or literally FIFO ("3rd always replaces the 1st regardless of revisits")? The spec above assumes LRU as the more standard/useful interpretation — worth confirming.
- **Caching staleness**: should cached subject data ever auto-refresh within a session (e.g. after N minutes), or is "stays cached until evicted or page refresh" acceptable given content doesn't change often?
- **Chatbot scope**: should the chatbot always be scoped to one subject at a time, or should it support cross-subject questions (harder to retrieve correctly, but more flexible)?
- **Cost control**: what's the budget/rate-limit per student per day for LLM-backed features (chatbot + quiz generation), given these are the first real per-request costs on the platform?
- **Vector store choice**: dedicated vector DB vs. Redis Stack vector search — depends on what's simplest to add to your current hosting setup.