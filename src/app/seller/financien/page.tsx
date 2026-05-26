"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Wallet,
  X
} from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useSellerData } from "@/lib/seller-data";
import { formatPrice } from "@/lib/marketplace-data";
import { useToast } from "@/components/toast";

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
}

const MIN_WITHDRAW_CENTS = 5000; // €50 drempel

export default function SellerFinancienPage() {
  const { activeUser } = useMarketplace();
  const data = useSellerData();
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  if (activeUser.role !== "seller" || !data.seller) return null;

  const { revenue, paidPayouts, upcomingPayouts, pendingPayout } = data;
  const totalPaidOut = paidPayouts.reduce((s, p) => s + p.net, 0);
  const pendingPayoutCents = upcomingPayouts.reduce((s, p) => s + p.net, 0) || pendingPayout;
  const allPayouts = useMemo(() =>
    [...paidPayouts, ...upcomingPayouts].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [paidPayouts, upcomingPayouts]
  );

  const canWithdraw = pendingPayoutCents >= MIN_WITHDRAW_CENTS;

  return (
    <>
      {/* Summary cards */}
      <div className="financien-summary">
        <div className="financien-card">
          <div className="financien-card-head">
            <span><TrendingUp size={13} /> Totaal omzet</span>
          </div>
          <strong>{formatPrice(revenue)}</strong>
          <small>Bruto omzet sinds start</small>
        </div>

        <div className="financien-card success">
          <div className="financien-card-head">
            <span><CheckCircle2 size={13} /> Uitbetaald</span>
          </div>
          <strong>{formatPrice(totalPaidOut)}</strong>
          <small>{paidPayouts.length} uitbetaling{paidPayouts.length === 1 ? "" : "en"} verwerkt</small>
        </div>

        <div className="financien-card highlight">
          <div className="financien-card-head">
            <span><Clock size={13} /> Nog uit te betalen</span>
            <span className="financien-card-pill">Beschikbaar</span>
          </div>
          <strong>{formatPrice(pendingPayoutCents)}</strong>
          <small>{canWithdraw ? "Klaar om op te nemen" : `Drempel ${formatPrice(MIN_WITHDRAW_CENTS)} — nog ${formatPrice(MIN_WITHDRAW_CENTS - pendingPayoutCents)} te gaan`}</small>
          <button
            type="button"
            className="button financien-withdraw-btn"
            onClick={() => setWithdrawOpen(true)}
            disabled={!canWithdraw}
          >
            <ArrowDownToLine size={14} /> Geld opnemen
          </button>
        </div>
      </div>

      {/* Hoe het werkt */}
      <div className="widget" style={{ marginTop: 18, padding: 22 }}>
        <div className="widget-head">
          <div>
            <span className="eyebrow"><ShieldCheck size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Veilig & transparant</span>
            <h3>Zo werkt uitbetalen op Hazenco</h3>
          </div>
        </div>
        <div className="financien-howto">
          <div className="financien-howto-step">
            <span className="financien-howto-num">1</span>
            <strong>Verkoop een tool</strong>
            <small>Koper betaalt via Hazenco. Bedrag komt in je "Nog uit te betalen" pot.</small>
          </div>
          <div className="financien-howto-step">
            <span className="financien-howto-num">2</span>
            <strong>Vraag uitbetaling aan</strong>
            <small>Vanaf €50 saldo kun je je geld opnemen via een veilige 4-staps procedure.</small>
          </div>
          <div className="financien-howto-step">
            <span className="financien-howto-num">3</span>
            <strong>SEPA-overboeking</strong>
            <small>Binnen 5 werkdagen op je IBAN. Automatische BTW-factuur in je inbox.</small>
          </div>
        </div>
      </div>

      {/* Transactietabel */}
      <div className="widget" style={{ marginTop: 18 }}>
        <div className="widget-head">
          <div>
            <span className="eyebrow"><Receipt size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Transacties</span>
            <h3>Uitbetalingen ({allPayouts.length})</h3>
          </div>
          <small style={{ color: "var(--green-500)", fontSize: 12, fontWeight: 700 }}>Inclusief komende uitbetalingen</small>
        </div>
        {allPayouts.length ? (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Type</th>
                <th>Status</th>
                <th>Bruto</th>
                <th>Fee (10%)</th>
                <th style={{ textAlign: "right" }}>Netto uitbetaald</th>
                <th style={{ textAlign: "right" }}>Factuur</th>
              </tr>
            </thead>
            <tbody>
              {allPayouts.map((p) => (
                <tr key={p.id}>
                  <td><strong>{formatDate(p.date)}</strong></td>
                  <td>SEPA</td>
                  <td>
                    <span className={`status-badge ${p.status === "paid" ? "paid" : "pending"}`}>
                      {p.status === "paid" ? "Uitbetaald" : "Komend"}
                    </span>
                  </td>
                  <td>{formatPrice(p.gross)}</td>
                  <td style={{ color: "var(--green-500)" }}>−{formatPrice(p.gross - p.net)}</td>
                  <td className="amount"><strong>{formatPrice(p.net)}</strong></td>
                  <td style={{ textAlign: "right" }}>
                    {p.status === "paid" ? (
                      <button type="button" className="button secondary" style={{ minHeight: 28, padding: "0 10px", fontSize: 11 }}>
                        <Download size={11} /> PDF
                      </button>
                    ) : <span style={{ opacity: 0.4, fontSize: 12 }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--green-500)" }}>Nog geen uitbetalingen.</p>
        )}
      </div>

      {withdrawOpen ? (
        <WithdrawModal
          available={pendingPayoutCents}
          seller={data.seller}
          onClose={() => setWithdrawOpen(false)}
        />
      ) : null}
    </>
  );
}

type WithdrawStep = 0 | 1 | 2 | 3;

function WithdrawModal({
  available,
  seller,
  onClose
}: {
  available: number;
  seller: ReturnType<typeof useSellerData>["seller"];
  onClose: () => void;
}) {
  const [step, setStep] = useState<WithdrawStep>(0);
  const [amount, setAmount] = useState((available / 100).toString());
  const [iban, setIban] = useState(seller?.payoutMethod ?? "");
  const [method, setMethod] = useState<"sepa" | "instant">("sepa");
  const [accepted, setAccepted] = useState(false);
  const [done, setDone] = useState(false);
  const toast = useToast();

  const amountCents = Math.round(parseFloat(amount.replace(",", ".") || "0") * 100);
  const fee = method === "instant" ? Math.round(amountCents * 0.015) : 0;
  const netAmount = amountCents - fee;

  const step1Valid = amountCents >= MIN_WITHDRAW_CENTS && amountCents <= available;
  const step2Valid = iban.replace(/\s/g, "").length >= 15;
  const step3Valid = accepted;

  function next() {
    if (step === 0 && !step1Valid) return;
    if (step === 1 && !step2Valid) return;
    if (step === 2 && !step3Valid) return;
    if (step < 3) setStep((s) => (s + 1) as WithdrawStep);
  }

  function back() {
    if (step > 0) setStep((s) => (s - 1) as WithdrawStep);
  }

  function confirm() {
    setDone(true);
    toast.success("Opname verstuurd", `€${(netAmount / 100).toFixed(2)} wordt overgemaakt naar je IBAN.`);
    setTimeout(() => onClose(), 2400);
  }

  if (done) {
    return (
      <div className="withdraw-backdrop" onClick={onClose}>
        <div className="withdraw-modal withdraw-done" onClick={(e) => e.stopPropagation()}>
          <div className="withdraw-done-icon"><CheckCircle2 size={48} /></div>
          <h2>Aanvraag verstuurd!</h2>
          <p><strong>{formatPrice(netAmount)}</strong> wordt binnen 5 werkdagen overgemaakt naar je IBAN.</p>
          <small>Je krijgt direct een bevestiging per e-mail.</small>
        </div>
      </div>
    );
  }

  const steps = ["Bedrag", "Rekening", "Bevestigen", "Klaar"];

  return (
    <div className="withdraw-backdrop" onClick={onClose}>
      <div className="withdraw-modal" onClick={(e) => e.stopPropagation()}>
        <div className="withdraw-head">
          <div>
            <span className="eyebrow"><Wallet size={11} /> Geld opnemen</span>
            <h2>Stap {step + 1} van 3 · {steps[step]}</h2>
          </div>
          <button type="button" className="composer-icon-btn" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div className="withdraw-progress">
          {[0, 1, 2].map((i) => (
            <span key={i} className={i <= step ? "active" : ""} />
          ))}
        </div>

        <div className="withdraw-body">
          {step === 0 ? (
            <>
              <div className="withdraw-available">
                <small>Beschikbaar saldo</small>
                <strong>{formatPrice(available)}</strong>
              </div>

              <label className="withdraw-amount-input">
                <span>Hoeveel wil je opnemen?</span>
                <div className="withdraw-amount-wrap">
                  <span className="withdraw-currency">€</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    autoFocus
                  />
                  <button type="button" onClick={() => setAmount((available / 100).toFixed(2))}>Alles</button>
                </div>
                {amountCents > available ? (
                  <small className="withdraw-err"><AlertCircle size={12} /> Bedrag overschrijdt je beschikbare saldo.</small>
                ) : amountCents > 0 && amountCents < MIN_WITHDRAW_CENTS ? (
                  <small className="withdraw-err"><AlertCircle size={12} /> Minimaal opname-bedrag is {formatPrice(MIN_WITHDRAW_CENTS)}.</small>
                ) : (
                  <small className="withdraw-hint">Drempel: {formatPrice(MIN_WITHDRAW_CENTS)} · Max: {formatPrice(available)}</small>
                )}
              </label>

              <div className="withdraw-methods">
                <button
                  type="button"
                  className={`withdraw-method ${method === "sepa" ? "active" : ""}`}
                  onClick={() => setMethod("sepa")}
                >
                  <div className="withdraw-method-head">
                    <strong>SEPA standaard</strong>
                    <span className="withdraw-method-fee">Gratis</span>
                  </div>
                  <small>Op je rekening binnen 5 werkdagen.</small>
                </button>
                <button
                  type="button"
                  className={`withdraw-method ${method === "instant" ? "active" : ""}`}
                  onClick={() => setMethod("instant")}
                >
                  <div className="withdraw-method-head">
                    <strong>Instant payout</strong>
                    <span className="withdraw-method-fee">1,5%</span>
                  </div>
                  <small>Binnen 30 minuten op je rekening.</small>
                </button>
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <label className="withdraw-iban-label">
                <span>IBAN-rekeningnummer</span>
                <input
                  type="text"
                  placeholder="NL00 ABCD 0123 4567 89"
                  value={iban}
                  onChange={(e) => setIban(e.target.value.toUpperCase())}
                  autoFocus
                />
                <small className="withdraw-hint">SEPA-format · we slaan dit versleuteld op voor toekomstige opnames.</small>
                {iban && iban.replace(/\s/g, "").length < 15 ? (
                  <small className="withdraw-err"><AlertCircle size={12} /> IBAN te kort.</small>
                ) : null}
              </label>

              <div className="withdraw-info-box">
                <ShieldCheck size={16} />
                <div>
                  <strong>Veilig opgeslagen</strong>
                  <small>Je rekeninggegevens worden versleuteld bewaard. Alleen jij ziet ze.</small>
                </div>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div className="withdraw-summary">
                <div className="withdraw-summary-row">
                  <span>Opname</span>
                  <strong>{formatPrice(amountCents)}</strong>
                </div>
                <div className="withdraw-summary-row">
                  <span>Methode</span>
                  <strong>{method === "instant" ? "Instant payout" : "SEPA standaard"}</strong>
                </div>
                <div className="withdraw-summary-row">
                  <span>Servicekosten</span>
                  <strong style={{ color: fee > 0 ? "var(--green-700)" : "#16a34a" }}>
                    {fee > 0 ? `−${formatPrice(fee)}` : "Gratis"}
                  </strong>
                </div>
                <div className="withdraw-summary-row total">
                  <span>Je ontvangt</span>
                  <strong>{formatPrice(netAmount)}</strong>
                </div>
                <div className="withdraw-summary-row">
                  <span>Op IBAN</span>
                  <strong>{iban}</strong>
                </div>
                <div className="withdraw-summary-row">
                  <span><Calendar size={12} /> Verwachte aankomst</span>
                  <strong>{method === "instant" ? "Binnen 30 min" : "Binnen 5 werkdagen"}</strong>
                </div>
              </div>

              <label className="onboarding-checkbox">
                <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
                <span>Ik bevestig dat de bovenstaande gegevens kloppen en ga akkoord met de <strong>Hazenco uitbetalingsvoorwaarden</strong>.</span>
              </label>

              <div className="withdraw-info-box info">
                <FileText size={16} />
                <div>
                  <strong>Automatische BTW-factuur</strong>
                  <small>Na opname genereren we direct een factuur die je in je e-mail én op /seller/financien terugvindt.</small>
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className="withdraw-foot">
          {step > 0 ? (
            <button type="button" className="button secondary" onClick={back}>
              <ArrowLeft size={14} /> Terug
            </button>
          ) : <span />}

          {step < 2 ? (
            <button
              type="button"
              className="button"
              disabled={step === 0 ? !step1Valid : !step2Valid}
              onClick={next}
            >
              Verder <ArrowRight size={14} />
            </button>
          ) : (
            <button type="button" className="button" disabled={!step3Valid} onClick={confirm}>
              <Check size={14} /> Opname bevestigen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
