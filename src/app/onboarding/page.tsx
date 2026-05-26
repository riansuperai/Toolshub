"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Info,
  Lock,
  Mail,
  MapPin,
  Percent,
  Phone,
  Receipt,
  Rocket,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
  Wallet
} from "lucide-react";
import { Shell } from "@/components/shell";
import { useMarketplace } from "@/lib/marketplace-store";

type Step = 0 | 1 | 2 | 3;

const stepMeta = [
  {
    id: "verification" as const,
    title: "Verificatie",
    subtitle: "Snelle veilige identiteitsverificatie",
    icon: ShieldCheck,
    eyebrowDesc: "Verifieer je identiteit",
    bodyDesc: "Snelle verificatie zodat je direct kunt verkopen"
  },
  {
    id: "business" as const,
    title: "Bedrijfsgegevens",
    subtitle: "KvK & factuurgegevens (optioneel als particulier)",
    icon: Building2,
    eyebrowDesc: "Bedrijfsgegevens",
    bodyDesc: "Voor BTW-facturen en correcte uitbetaling"
  },
  {
    id: "commission" as const,
    title: "Commissie",
    subtitle: "Bekijk de marketplace-voorwaarden",
    icon: Percent,
    eyebrowDesc: "Commissiestructuur",
    bodyDesc: "Transparant verdienmodel — 90% voor jou, 10% Hazenco"
  },
  {
    id: "get-started" as const,
    title: "Klaar om te starten",
    subtitle: "Bevestig je aanmelding",
    icon: Rocket,
    eyebrowDesc: "Aan de slag",
    bodyDesc: "Direct na bevestiging gaat je profiel naar admin voor review"
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { activeUser, submitSellerApplication, setActiveUser } = useMarketplace();

  const [step, setStep] = useState<Step>(0);
  const [showPwd, setShowPwd] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Verification
  const [email, setEmail] = useState(activeUser.email || "");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState(activeUser.name === "Bezoeker" ? "" : activeUser.name);
  const [phone, setPhone] = useState(activeUser.phone ?? "");

  // Step 2 — Bedrijfsgegevens
  const [businessType, setBusinessType] = useState<"individual" | "company">("individual");
  const [companyName, setCompanyName] = useState(activeUser.company ?? "");
  const [kvk, setKvk] = useState("");
  const [vatNumber, setVatNumber] = useState(activeUser.vatNumber ?? "");
  const [street, setStreet] = useState(activeUser.billingAddress?.street ?? "");
  const [postalCode, setPostalCode] = useState(activeUser.billingAddress?.postalCode ?? "");
  const [city, setCity] = useState(activeUser.billingAddress?.city ?? "");
  const [country, setCountry] = useState(activeUser.billingAddress?.country ?? "Nederland");
  const [iban, setIban] = useState("");

  // Step 3 — Commission
  const [acceptedCommission, setAcceptedCommission] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Step 4 — Get Started
  const [business, setBusiness] = useState("");
  const [experience, setExperience] = useState("");

  const step1Valid =
    email.includes("@") &&
    password.length >= 8 &&
    password === confirmPwd &&
    username.trim().length >= 3 &&
    fullName.trim().length >= 2;
  const step2Valid =
    businessType === "individual"
      ? street.trim().length > 0 && postalCode.trim().length > 0 && city.trim().length > 0 && iban.trim().length >= 15
      : companyName.trim().length >= 2 &&
        kvk.trim().length >= 6 &&
        street.trim().length > 0 &&
        postalCode.trim().length > 0 &&
        city.trim().length > 0 &&
        iban.trim().length >= 15;
  const step3Valid = acceptedCommission && acceptedTerms;
  const step4Valid = business.trim().length >= 3 && experience.trim().length >= 10;

  function next() {
    if (step === 0 && !step1Valid) return;
    if (step === 1 && !step2Valid) return;
    if (step === 2 && !step3Valid) return;
    if (step < 3) setStep((s) => (s + 1) as Step);
  }
  function back() {
    if (step > 0) setStep((s) => (s - 1) as Step);
  }

  function submit() {
    if (!step4Valid) return;
    // Demo: als de bezoeker nog niet is ingelogd, switchen we naar de buyer-account
    // zodat de submitSellerApplication store-actie een gekoppelde user vindt.
    if (activeUser.role === "visitor") {
      setActiveUser("user_buyer");
    }
    submitSellerApplication({
      name: fullName.trim(),
      email: email.trim(),
      business: business.trim(),
      experience: experience.trim()
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Shell>
        <div className="onboarding-page">
          <div className="onboarding-success">
            <div className="onboarding-success-icon">
              <CheckCircle2 size={48} />
            </div>
            <h1>Aanmelding ontvangen!</h1>
            <p>
              Bedankt {fullName.split(" ")[0]} — Hazenco admin bekijkt je aanvraag binnen <strong>48 uur</strong>.
              Je krijgt direct een e-mail zodra je profiel is goedgekeurd. Daarna kun je je eerste tool uploaden.
            </p>
            <div className="onboarding-success-cta">
              <Link className="button" href="/account">Naar mijn account</Link>
              <Link className="button secondary" href="/creators">Meer over Creator zijn</Link>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  const current = stepMeta[step];
  const progress = ((step + 1) / stepMeta.length) * 100;

  return (
    <Shell>
      <div className="onboarding-page">
        <div className="onboarding-top">
          <Link className="onboarding-exit" href="/creators">
            <ArrowLeft size={14} /> Exit aanmelding
          </Link>
          <button type="button" className="onboarding-reset" onClick={() => { setStep(0); setSubmitted(false); }}>
            <Sparkles size={13} /> Opnieuw beginnen
          </button>
        </div>

        <header className="onboarding-header">
          <h1>{current.title === "Verificatie" ? "Verifieer jezelf" : current.title === "Commissie" ? "Commissiestructuur" : "Klaar om te starten"}</h1>
          <p>{current.subtitle}</p>
          <div className="onboarding-progress-bar">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="onboarding-stepper-row">
            <div className="onboarding-meta-pill">
              <ShieldCheck size={12} /> Beveiligd & geverifieerd
            </div>
            <div className="onboarding-meta-pill ghost">
              <Info size={12} /> {stepMeta.length - step - 1} {stepMeta.length - step - 1 === 1 ? "stap" : "stappen"} te gaan
            </div>
          </div>
        </header>

        <div className="onboarding-stepper">
          {stepMeta.map((s, i) => {
            const Icon = s.icon;
            const isCurrent = i === step;
            const isDone = i < step;
            return (
              <div key={s.id} className="onboarding-step-block">
                <button
                  type="button"
                  className={`onboarding-step${isCurrent ? " current" : ""}${isDone ? " done" : ""}`}
                  onClick={() => {
                    if (i < step) setStep(i as Step);
                  }}
                  disabled={i > step}
                >
                  <span className="onboarding-step-icon">
                    {isDone ? <Check size={16} /> : <Icon size={16} />}
                  </span>
                  <small>{s.title}</small>
                </button>
                {i < stepMeta.length - 1 ? <span className="onboarding-step-line" /> : null}
              </div>
            );
          })}
        </div>

        <div className="onboarding-card">
          <div className="onboarding-card-hero">
            <div className="onboarding-card-icon">
              <current.icon size={24} />
            </div>
            <h2>{current.eyebrowDesc}</h2>
            <p>{current.bodyDesc}</p>
            <div className="onboarding-card-dots">
              {[0, 1, 2, 3, 4].map((d) => <span key={d} />)}
            </div>
          </div>

          {step === 0 ? (
            <div className="onboarding-form">
              <div className="onboarding-form-head">
                <span className="onboarding-form-eyebrow"><Sparkles size={12} /> Snelle verificatie</span>
                <p>Vul de verplichte velden in om verder te gaan</p>
              </div>

              <FormRow
                icon={Mail}
                label="E-mailadres"
                required
                hint="We sturen belangrijke updates hierheen"
              >
                <input type="email" placeholder="jij@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </FormRow>

              <FormRow
                icon={Lock}
                label="Wachtwoord"
                required
                hint="Minimaal 8 tekens — gebruik letters, cijfers en symbolen"
              >
                <div className="onboarding-pwd-wrap">
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Sterk wachtwoord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPwd((v) => !v)} aria-label="Toon wachtwoord">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div className="onboarding-pwd-wrap" style={{ marginTop: 8 }}>
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Bevestig wachtwoord"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    required
                  />
                </div>
                {confirmPwd && password !== confirmPwd ? (
                  <small style={{ color: "#dc2626" }}>Wachtwoorden komen niet overeen.</small>
                ) : null}
              </FormRow>

              <FormRow
                icon={AtSign}
                label="Gebruikersnaam"
                required
                hint="Je publieke creator-naam"
              >
                <input type="text" placeholder="janjansen123" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <small className="onboarding-field-help">Wordt getoond op je creator-profielpagina</small>
              </FormRow>

              <FormRow
                icon={UserIcon}
                label="Volledige naam"
                required
                hint="Je officiële naam voor uitbetalingen"
              >
                <input type="text" placeholder="Jan Jansen" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </FormRow>

              <FormRow
                icon={Phone}
                label="Telefoonnummer"
                hint="Voor extra account-beveiliging"
                optional
              >
                <input type="tel" placeholder="+31 6 12 34 56 78" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </FormRow>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="onboarding-form">
              <div className="onboarding-form-head">
                <span className="onboarding-form-eyebrow"><Building2 size={12} /> Bedrijfsgegevens</span>
                <p>Voor BTW-facturen en correcte uitbetalingen</p>
              </div>

              <div className="onboarding-segmented">
                <button
                  type="button"
                  className={businessType === "individual" ? "active" : ""}
                  onClick={() => setBusinessType("individual")}
                >
                  <UserIcon size={14} /> Particulier
                </button>
                <button
                  type="button"
                  className={businessType === "company" ? "active" : ""}
                  onClick={() => setBusinessType("company")}
                >
                  <Building2 size={14} /> Bedrijf (KvK)
                </button>
              </div>

              {businessType === "company" ? (
                <>
                  <FormRow icon={Building2} label="Bedrijfsnaam" required hint="Officieel ingeschreven bij KvK">
                    <input type="text" placeholder="Hazenco Studio BV" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                  </FormRow>

                  <div className="onboarding-grid-2">
                    <FormRow icon={FileText} label="KvK-nummer" required hint="8 cijfers">
                      <input type="text" placeholder="12345678" maxLength={8} value={kvk} onChange={(e) => setKvk(e.target.value.replace(/\D/g, ""))} required />
                    </FormRow>

                    <FormRow icon={Receipt} label="BTW-nummer" optional hint="Bijv. NL123456789B01">
                      <input type="text" placeholder="NL123456789B01" value={vatNumber} onChange={(e) => setVatNumber(e.target.value.toUpperCase())} />
                    </FormRow>
                  </div>
                </>
              ) : null}

              <FormRow icon={MapPin} label="Straat & huisnummer" required>
                <input type="text" placeholder="Hoofdstraat 12" value={street} onChange={(e) => setStreet(e.target.value)} required />
              </FormRow>

              <div className="onboarding-grid-2">
                <FormRow icon={MapPin} label="Postcode" required>
                  <input type="text" placeholder="1234 AB" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                </FormRow>

                <FormRow icon={MapPin} label="Plaats" required>
                  <input type="text" placeholder="Amsterdam" value={city} onChange={(e) => setCity(e.target.value)} required />
                </FormRow>
              </div>

              <FormRow icon={Globe} label="Land" required>
                <select value={country} onChange={(e) => setCountry(e.target.value)} required>
                  <option>Nederland</option>
                  <option>België</option>
                  <option>Duitsland</option>
                  <option>Luxemburg</option>
                  <option>Frankrijk</option>
                  <option>Verenigd Koninkrijk</option>
                </select>
              </FormRow>

              <FormRow icon={Wallet} label="IBAN-rekeningnummer" required hint="Hierop ontvang je maandelijkse uitbetalingen">
                <input
                  type="text"
                  placeholder="NL00 ABCD 0123 4567 89"
                  value={iban}
                  onChange={(e) => setIban(e.target.value.toUpperCase())}
                  required
                />
                <small className="onboarding-field-help">SEPA-format · we slaan dit versleuteld op</small>
              </FormRow>

              <div className="onboarding-info-note">
                <Info size={16} />
                <p>
                  Particulieren kunnen verkopen zonder KvK, maar bij meer dan ~€500 omzet per maand raden we
                  een KvK-inschrijving sterk aan voor belastingaangifte.
                </p>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="onboarding-form">
              <div className="onboarding-commission-card">
                <div className="onboarding-commission-row">
                  <div>
                    <span className="onboarding-commission-label">Voor jou</span>
                    <strong>90%</strong>
                  </div>
                  <div className="onboarding-commission-bar">
                    <span style={{ width: "90%" }} />
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className="onboarding-commission-label">Hazenco</span>
                    <strong>10%</strong>
                  </div>
                </div>
                <p className="onboarding-commission-note">
                  Voorbeeld: verkoop je tool voor <strong>€99</strong> → ontvang <strong>€89,10</strong> netto.
                  Geen abonnement, geen verborgen kosten.
                </p>
              </div>

              <div className="onboarding-perks">
                <div className="onboarding-perk">
                  <Wallet size={18} />
                  <div>
                    <strong>Zelf opnemen wanneer je wilt</strong>
                    <small>Vanaf €50 saldo — SEPA gratis (5 werkdagen) of Instant (1,5% fee, 30 min)</small>
                  </div>
                </div>
                <div className="onboarding-perk">
                  <BadgeCheck size={18} />
                  <div>
                    <strong>Automatische BTW-facturen</strong>
                    <small>Hazenco genereert per opname een factuur voor jou en de koper</small>
                  </div>
                </div>
                <div className="onboarding-perk">
                  <ShieldCheck size={18} />
                  <div>
                    <strong>Geen verborgen kosten</strong>
                    <small>10% platform-fee per verkoop — geen iDEAL/CC-kosten doorbelast</small>
                  </div>
                </div>
              </div>

              <label className="onboarding-checkbox">
                <input type="checkbox" checked={acceptedCommission} onChange={(e) => setAcceptedCommission(e.target.checked)} />
                <span>Ik ga akkoord met de <strong>10% Hazenco commissie</strong> per verkoop.</span>
              </label>
              <label className="onboarding-checkbox">
                <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
                <span>Ik accepteer de <Link href="#" style={{ color: "var(--orange-700)", fontWeight: 800 }}>Algemene Voorwaarden</Link> en de <Link href="#" style={{ color: "var(--orange-700)", fontWeight: 800 }}>Privacy Policy</Link>.</span>
              </label>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="onboarding-form">
              <div className="onboarding-form-head">
                <span className="onboarding-form-eyebrow"><Sparkles size={12} /> Vertel over jouw werk</span>
                <p>Admin gebruikt deze info om je aanvraag te beoordelen</p>
              </div>

              <FormRow
                icon={Sparkles}
                label="Specialisatie"
                required
                hint="Wat bouw je en voor wie?"
              >
                <input
                  type="text"
                  placeholder="Bijv. n8n workflows voor webshops"
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  required
                />
              </FormRow>

              <FormRow
                icon={Info}
                label="Ervaring & portfolio"
                required
                hint="Vertel wat je hebt gebouwd, voor welke klanten, hoe je support levert"
              >
                <textarea
                  rows={6}
                  placeholder="Beschrijf je ervaring met automatiseringen, je doelgroep en wat kopers van je kunnen verwachten..."
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                />
              </FormRow>

              <div className="onboarding-summary">
                <strong>Klaar om in te dienen</strong>
                <ul>
                  <li><Check size={13} /> Verificatie compleet — {email}</li>
                  <li><Check size={13} /> {businessType === "company" ? `Bedrijf: ${companyName || "—"}` : "Particulier"} · IBAN ingevuld</li>
                  <li><Check size={13} /> Commissie & voorwaarden geaccepteerd</li>
                  <li><Check size={13} /> Specialisatie & portfolio ingevuld</li>
                </ul>
                <small>Na bevestiging komt je profiel in de admin-reviewqueue. Binnen 48u krijg je een e-mail met de uitslag.</small>
              </div>
            </div>
          ) : null}

          <div className="onboarding-foot">
            {step > 0 ? (
              <button type="button" className="button secondary" onClick={back}>
                <ArrowLeft size={14} /> Terug
              </button>
            ) : <span />}

            {step < 3 ? (
              <button
                type="button"
                className="button"
                disabled={step === 0 ? !step1Valid : step === 1 ? !step2Valid : !step3Valid}
                onClick={next}
              >
                Verder <ArrowRight size={14} />
              </button>
            ) : (
              <button type="button" className="button" disabled={!step4Valid} onClick={submit}>
                <CheckCircle2 size={14} /> Aanmelding indienen
              </button>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function FormRow({
  icon: Icon,
  label,
  required,
  optional,
  hint,
  children
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="onboarding-field">
      <div className="onboarding-field-icon">
        <Icon size={16} />
      </div>
      <div className="onboarding-field-body">
        <label>
          {label}
          {required ? <span className="onboarding-required">*</span> : null}
          {optional ? <span className="onboarding-optional">Optioneel</span> : null}
        </label>
        {hint ? <small>{hint}</small> : null}
        <div className="onboarding-field-input">{children}</div>
      </div>
    </div>
  );
}
