"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, MessageCircleQuestion, Send, ThumbsUp } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useToast } from "@/components/toast";

function formatAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400_000);
  if (days < 1) return "vandaag";
  if (days < 7) return `${days}d geleden`;
  if (days < 30) return `${Math.floor(days / 7)}w geleden`;
  return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
}

export function ToolQA({ listingId, sellerId }: { listingId: string; sellerId: string }) {
  const { state, activeUser, askQuestion, answerQuestion, toggleHelpfulQuestion } = useMarketplace();
  const toast = useToast();
  const [question, setQuestion] = useState("");
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [helpfulVoted, setHelpfulVoted] = useState<Set<string>>(new Set());

  const questions = useMemo(
    () => (state.toolQuestions ?? [])
      .filter((q) => q.listingId === listingId)
      .sort((a, b) => (b.helpfulCount ?? 0) - (a.helpfulCount ?? 0) || +new Date(b.createdAt) - +new Date(a.createdAt)),
    [state.toolQuestions, listingId]
  );

  const isOwner = activeUser.sellerId === sellerId;
  const canAsk = activeUser.role !== "visitor";

  function submitQuestion() {
    if (question.trim().length < 5) {
      toast.error("Vraag te kort", "Stel een vraag van minimaal 5 tekens.");
      return;
    }
    askQuestion(listingId, question);
    setQuestion("");
    toast.success("Vraag geplaatst", "De creator krijgt direct een notificatie.");
  }

  function submitAnswer(qId: string) {
    if (answerText.trim().length < 5) return;
    answerQuestion(qId, answerText);
    setAnsweringId(null);
    setAnswerText("");
    toast.success("Antwoord geplaatst");
  }

  function helpful(qId: string) {
    if (helpfulVoted.has(qId)) return;
    toggleHelpfulQuestion(qId);
    setHelpfulVoted((s) => new Set(s).add(qId));
  }

  return (
    <section className="tool-qa">
      <div className="tool-qa-head">
        <div>
          <span className="eyebrow"><MessageCircleQuestion size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Vragen & antwoorden</span>
          <h2>Wat anderen vroegen ({questions.length})</h2>
        </div>
      </div>

      {canAsk ? (
        <div className="tool-qa-form">
          <textarea
            rows={2}
            placeholder="Stel je vraag over deze tool — bijv. werkt dit met n8n cloud?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={400}
          />
          <button type="button" className="button" onClick={submitQuestion} disabled={question.trim().length < 5}>
            <Send size={14} /> Plaats vraag
          </button>
        </div>
      ) : (
        <p className="tool-qa-login">
          Log in om een vraag te stellen.
        </p>
      )}

      {questions.length === 0 ? (
        <div className="tool-qa-empty">
          <MessageCircleQuestion size={28} />
          <strong>Nog geen vragen</strong>
          <small>Wees de eerste om iets te vragen — anderen profiteren mee.</small>
        </div>
      ) : (
        <div className="tool-qa-list">
          {questions.map((q) => {
            const hasVoted = helpfulVoted.has(q.id);
            return (
              <article className="tool-qa-item" key={q.id}>
                <div className="tool-qa-item-head">
                  <strong>{q.userName}</strong>
                  <small>{formatAgo(q.createdAt)}</small>
                </div>
                <p className="tool-qa-question">{q.question}</p>

                {q.answer ? (
                  <div className="tool-qa-answer">
                    <div className="tool-qa-answer-head">
                      <strong>
                        Antwoord
                        {q.answer.bySeller ? (
                          <span className="tool-qa-creator-pill"><CheckCircle2 size={11} /> Creator</span>
                        ) : null}
                      </strong>
                      <small>{formatAgo(q.answer.answeredAt)}</small>
                    </div>
                    <p>{q.answer.text}</p>
                  </div>
                ) : isOwner ? (
                  answeringId === q.id ? (
                    <div className="tool-qa-answer-form">
                      <textarea
                        rows={2}
                        placeholder="Geef een helder antwoord — kort en concreet."
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        autoFocus
                      />
                      <div style={{ display: "flex", gap: 6 }}>
                        <button type="button" className="button" onClick={() => submitAnswer(q.id)} disabled={answerText.trim().length < 5}>
                          <Send size={13} /> Antwoorden
                        </button>
                        <button type="button" className="button secondary" onClick={() => { setAnsweringId(null); setAnswerText(""); }}>
                          Annuleren
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" className="button secondary tool-qa-answer-btn" onClick={() => setAnsweringId(q.id)}>
                      <Send size={13} /> Beantwoord deze vraag
                    </button>
                  )
                ) : (
                  <p className="tool-qa-pending">Wacht op antwoord van de creator...</p>
                )}

                <div className="tool-qa-actions">
                  <button type="button" className={`tool-qa-helpful${hasVoted ? " voted" : ""}`} onClick={() => helpful(q.id)} disabled={hasVoted}>
                    <ThumbsUp size={12} /> {hasVoted ? "Bedankt!" : "Nuttig"}
                    {(q.helpfulCount ?? 0) > 0 ? <small>{q.helpfulCount}</small> : null}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
