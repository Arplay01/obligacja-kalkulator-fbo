import { useState, useEffect, useRef } from "react";

// ─── Data & Constants ─────────────────────────────────────────────
const BELKA_TAX = 0.19;

const BONDS = {
  OTS: {
    name: "OTS",
    fullName: "3-miesięczne",
    period: 0.25,
    periodLabel: "3 miesiące",
    type: "fixed",
    rate: 0.025,
    description: "Najkrótsza obligacja. Stałe, niskie oprocentowanie. Pieniądze wracają szybko.",
    howItWorks: "Pożyczasz państwu pieniądze na 3 miesiące. Z góry wiesz ile zarobisz. Po 3 miesiącach dostajesz pieniądze z odsetkami.",
    pros: ["Najkrótszy czas - pieniądze szybko wracają", "Zero niespodzianek - stawka znana z góry"],
    cons: ["Bardzo niskie oprocentowanie (2,5%)", "Często gorsze niż konto oszczędnościowe"],
    earlyFee: 0,
    color: "#94a3b8",
  },
  ROR: {
    name: "ROR",
    fullName: "Roczne",
    period: 1,
    periodLabel: "1 rok",
    type: "variable_nbp",
    firstRate: 0.0425,
    margin: 0.0,
    description: "Odsetki co miesiąc na konto. Oprocentowanie podąża za stopami NBP.",
    howItWorks: "Pierwszy miesiąc: stałe 4,25%. Potem co miesiąc oprocentowanie zmienia się ze stopą NBP. Odsetki wpływają co miesiąc na Twoje konto.",
    pros: ["Odsetki co miesiąc - widzisz jak pieniądze pracują", "Gdy stopy NBP rosną - zarabiasz więcej"],
    cons: ["Gdy stopy NBP spadają - zarabiasz mniej", "Brak ochrony przed inflacją"],
    earlyFee: 0.5,
    color: "#60a5fa",
  },
  DOR: {
    name: "DOR",
    fullName: "2-letnie",
    period: 2,
    periodLabel: "2 lata",
    type: "variable_nbp",
    firstRate: 0.044,
    margin: 0.0015,
    description: "Jak roczne, ale z lekko wyższą marżą. Odsetki co miesiąc.",
    howItWorks: "Pierwszy miesiąc: 4,40%. Potem oprocentowanie = stopa NBP + 0,15%. Odsetki co miesiąc na konto. Trwa 2 lata.",
    pros: ["Odsetki co miesiąc", "Nieco wyższa marża niż roczne (+0,15%)"],
    cons: ["Pieniądze związane na 2 lata", "Brak ochrony przed inflacją", "Wcześniejszy wykup kosztuje"],
    earlyFee: 0.5,
    color: "#818cf8",
  },
  TOS: {
    name: "TOS",
    fullName: "3-letnie",
    period: 3,
    periodLabel: "3 lata",
    type: "fixed",
    rate: 0.0465,
    description: "Stałe oprocentowanie przez 3 lata. Najpopularniejsza obligacja w Polsce.",
    howItWorks: "Przez 3 lata dostajesz stałe 4,65% rocznie. Zero niespodzianek - z góry wiesz ile zarobisz. Odsetki wypłacane przy wykupie.",
    pros: ["Najpopularniejsza - Polacy kupują ich najwięcej", "Stałe oprocentowanie - pełna przewidywalność", "Wyższe niż typowa lokata bez warunków"],
    cons: ["Pieniądze związane na 3 lata", "Nie chroni przed inflacją - jeśli ceny wzrosną, realna wartość spada", "Wcześniejszy wykup kosztuje 1 zł/szt."],
    earlyFee: 1.0,
    color: "#a78bfa",
  },
  COI: {
    name: "COI",
    fullName: "4-letnie",
    period: 4,
    periodLabel: "4 lata",
    type: "inflation",
    firstRate: 0.05,
    margin: 0.015,
    description: "Od 2. roku chroni przed inflacją. Oprocentowanie = inflacja + 1,5%.",
    howItWorks: "Pierwszy rok: stałe 5%. Od 2. roku: ile wynosi inflacja + 1,5% marży. Jeśli inflacja rośnie - Twoje odsetki też rosną. Odsetki wypłacane co rok.",
    pros: ["Ochrona przed inflacją od 2. roku", "Odsetki wypłacane co rok", "Bezpieczna przystań na dłużej"],
    cons: ["Pieniądze związane na 4 lata", "Przy niskiej inflacji - oprocentowanie też niskie", "Wcześniejszy wykup: 2 zł/szt."],
    earlyFee: 2.0,
    color: "#f59e0b",
  },
  EDO: {
    name: "EDO",
    fullName: "10-letnie",
    period: 10,
    periodLabel: "10 lat",
    type: "inflation_compound",
    firstRate: 0.056,
    margin: 0.02,
    description: "Najwyższa marża + procent składany. Twoje odsetki zarabiają kolejne odsetki.",
    howItWorks: "Pierwszy rok: 5,6%. Od 2. roku: inflacja + 2% marży. Kluczowa różnica: odsetki nie trafiają na konto, tylko są dopisywane do kapitału (kapitalizacja). Dzięki temu w kolejnym roku zarabiasz odsetki od odsetek. To tzw. procent składany - potężna siła na przestrzeni 10 lat.",
    pros: ["Najwyższa marża nad inflacją (+2%)", "Procent składany - odsetki od odsetek", "Najlepsza długoterminowa ochrona wartości pieniędzy"],
    cons: ["Pieniądze związane na 10 lat", "Wcześniejszy wykup kosztuje 2 zł/szt.", "Podatek Belki płacony od skumulowanych odsetek na końcu"],
    earlyFee: 2.0,
    color: "#10b981",
  },
};

const CURRENT_NBP_RATE = 0.0375;
const CURRENT_INFLATION = 0.021;
const FORECAST_INFLATION = 0.025; // conservative forecast

// ─── Calculation Engine ───────────────────────────────────────────
function calcDeposit(amount, annualRate, years) {
  const gross = amount * annualRate * years;
  const tax = gross * BELKA_TAX;
  const net = gross - tax;
  return { gross, tax, net, total: amount + net };
}

function calcSavingsAccount(amount, annualRate, years) {
  // Monthly interest, taxed each month
  let total = amount;
  let totalInterest = 0;
  let totalTax = 0;
  const months = Math.round(years * 12);
  const monthlyRate = annualRate / 12;
  for (let i = 0; i < months; i++) {
    const interest = total * monthlyRate;
    const tax = interest * BELKA_TAX;
    totalInterest += interest;
    totalTax += tax;
    total += interest - tax;
  }
  return { gross: totalInterest, tax: totalTax, net: totalInterest - totalTax, total };
}

function calcBond(bondKey, amount, years, inflationAssumption) {
  const bond = BONDS[bondKey];
  const numBonds = Math.floor(amount / 100);
  const invested = numBonds * 100;
  const effectiveYears = Math.min(years, bond.period);
  
  if (bond.type === "fixed") {
    const gross = invested * bond.rate * effectiveYears;
    const tax = gross * BELKA_TAX;
    return { invested, gross, tax, net: gross - tax, total: invested + gross - tax, effectiveYears };
  }
  
  if (bond.type === "variable_nbp") {
    let totalGross = 0;
    const months = Math.round(effectiveYears * 12);
    for (let m = 0; m < months; m++) {
      const monthlyRate = m === 0 
        ? bond.firstRate / 12 
        : (CURRENT_NBP_RATE + bond.margin) / 12;
      totalGross += invested * monthlyRate;
    }
    const tax = totalGross * BELKA_TAX;
    return { invested, gross: totalGross, tax, net: totalGross - tax, total: invested + totalGross - tax, effectiveYears };
  }
  
  if (bond.type === "inflation") {
    let totalGross = 0;
    for (let y = 0; y < effectiveYears; y++) {
      const rate = y === 0 ? bond.firstRate : inflationAssumption + bond.margin;
      totalGross += invested * rate;
    }
    const tax = totalGross * BELKA_TAX;
    return { invested, gross: totalGross, tax, net: totalGross - tax, total: invested + totalGross - tax, effectiveYears };
  }
  
  if (bond.type === "inflation_compound") {
    let capital = invested;
    let totalGross = 0;
    for (let y = 0; y < effectiveYears; y++) {
      const rate = y === 0 ? bond.firstRate : inflationAssumption + bond.margin;
      const interest = capital * rate;
      totalGross += interest;
      capital += interest; // compounding
    }
    const tax = totalGross * BELKA_TAX;
    return { invested, gross: totalGross, tax, net: totalGross - tax, total: invested + totalGross - tax, effectiveYears };
  }
  
  return { invested, gross: 0, tax: 0, net: 0, total: invested, effectiveYears };
}

function calcEarlyRedemption(bondKey, amount) {
  const bond = BONDS[bondKey];
  const numBonds = Math.floor(amount / 100);
  return numBonds * bond.earlyFee;
}

function formatPLN(val) {
  return val.toLocaleString("pl-PL", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " zł";
}

function formatPLN2(val) {
  return val.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " zł";
}

function formatPercent(val) {
  return (val * 100).toFixed(2) + "%";
}

// ─── Components ───────────────────────────────────────────────────

function StepIndicator({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: i === current ? 36 : 10,
            height: 10,
            borderRadius: 5,
            background: i <= current 
              ? "linear-gradient(135deg, #1e3a5f, #2d5a87)" 
              : "#dde5ed",
            transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }} />
        </div>
      ))}
    </div>
  );
}

function AmountInput({ value, onChange }) {
  const presets = [5000, 10000, 25000, 50000, 100000];
  return (
    <div>
      <div style={{ position: "relative", marginBottom: 24 }}>
        <input
          type="text"
          inputMode="numeric"
          value={value ? Number(value).toLocaleString("pl-PL") : ""}
          onChange={e => {
            const raw = e.target.value.replace(/\D/g, "");
            onChange(raw ? parseInt(raw) : 0);
          }}
          placeholder="np. 10 000"
          style={{
            width: "100%",
            boxSizing: "border-box",
            fontSize: 32,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 600,
            padding: "20px 60px 20px 24px",
            border: "2px solid #c8d6e5",
            borderRadius: 16,
            outline: "none",
            color: "#1e3a5f",
            background: "#f8fafc",
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = "#2d5a87"}
          onBlur={e => e.target.style.borderColor = "#c8d6e5"}
        />
        <span style={{
          position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)",
          fontSize: 20, color: "#8899aa", fontFamily: "'DM Sans', sans-serif",
        }}>zł</span>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {presets.map(p => (
          <button key={p} onClick={() => onChange(p)} style={{
            padding: "10px 18px",
            borderRadius: 10,
            border: value === p ? "2px solid #1e3a5f" : "1.5px solid #dde5ed",
            background: value === p ? "#1e3a5f" : "white",
            color: value === p ? "white" : "#4a6580",
            fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s",
          }}>
            {(p / 1000).toLocaleString("pl-PL")} tys.
          </button>
        ))}
      </div>
    </div>
  );
}

function SourceSelector({ value, onChange, rate, onRateChange }) {
  const sources = [
    { id: "savings", label: "Konto oszczędnościowe", icon: "🏦", desc: "Pieniądze na koncie w banku", defaultRate: 0.04 },
    { id: "deposit", label: "Lokata", icon: "🔒", desc: "Mam założoną lokatę", defaultRate: 0.045 },
    { id: "cash", label: "Gotówka / Konto zwykłe", icon: "💵", desc: "Nie zarabiają nic", defaultRate: 0 },
  ];
  
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {sources.map(s => (
          <button key={s.id} onClick={() => { onChange(s.id); if(!rate && rate !== 0) onRateChange(s.defaultRate); else if (s.id === "cash") onRateChange(0); }}
            style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "18px 22px", borderRadius: 14,
              border: value === s.id ? "2px solid #1e3a5f" : "1.5px solid #dde5ed",
              background: value === s.id ? "#f0f5fa" : "white",
              cursor: "pointer", textAlign: "left", transition: "all 0.2s",
            }}>
            <span style={{ fontSize: 28 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#1e3a5f", fontFamily: "'DM Sans', sans-serif" }}>{s.label}</div>
              <div style={{ fontSize: 13, color: "#7a8fa3", fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</div>
            </div>
          </button>
        ))}
      </div>
      
      {value && value !== "cash" && (
        <div style={{
          padding: "18px 22px", background: "#f8fafc", borderRadius: 14,
          border: "1.5px solid #e8eff6",
        }}>
          <label style={{ fontSize: 14, color: "#5a7189", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 8 }}>
            Jakie masz teraz oprocentowanie? (w skali roku)
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="number"
              step="0.1"
              min="0"
              max="15"
              value={rate !== null && rate !== undefined ? (rate * 100).toFixed(1) : ""}
              onChange={e => onRateChange(parseFloat(e.target.value) / 100 || 0)}
              style={{
                width: 90, fontSize: 22, fontWeight: 600, padding: "10px 14px",
                border: "1.5px solid #c8d6e5", borderRadius: 10, fontFamily: "'DM Sans', sans-serif",
                color: "#1e3a5f", textAlign: "center",
              }}
            />
            <span style={{ fontSize: 18, color: "#7a8fa3" }}>%</span>
            <span style={{ fontSize: 13, color: "#99aabb", fontFamily: "'DM Sans', sans-serif" }}>
              Nie wiesz? Typowa stawka to ok. 3–5%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function HorizonSelector({ value, onChange }) {
  const options = [
    { months: 3, label: "3 mies.", years: 0.25 },
    { months: 12, label: "1 rok", years: 1 },
    { months: 24, label: "2 lata", years: 2 },
    { months: 36, label: "3 lata", years: 3 },
    { months: 48, label: "4 lata", years: 4 },
    { months: 120, label: "10 lat", years: 10 },
  ];
  
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
      {options.map(o => (
        <button key={o.months} onClick={() => onChange(o.years)} style={{
          padding: "22px 16px", borderRadius: 14, border: value === o.years ? "2px solid #1e3a5f" : "1.5px solid #dde5ed",
          background: value === o.years ? "#1e3a5f" : "white",
          color: value === o.years ? "white" : "#1e3a5f",
          cursor: "pointer", transition: "all 0.25s",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        }}>
          <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif" }}>{o.label}</span>
          <span style={{ fontSize: 11, opacity: 0.6, fontFamily: "'DM Sans', sans-serif" }}>
            {o.months <= 12 ? "krótki termin" : o.months <= 48 ? "średni termin" : "długi termin"}
          </span>
        </button>
      ))}
    </div>
  );
}

function ResultCard({ bond, result, currentResult, amount, isBest, inflationAssumption, horizon }) {
  const [expanded, setExpanded] = useState(false);
  const diff = result.net - currentResult.net;
  const isWorse = diff < 0;
  const bondData = BONDS[bond];
  const matchesHorizon = bondData.period <= horizon || bondData.period === horizon;
  const earlyRedeem = bondData.period > horizon;
  const earlyFee = earlyRedeem ? calcEarlyRedemption(bond, amount) : 0;
  const adjustedNet = result.net - earlyFee;
  const adjustedDiff = adjustedNet - currentResult.net;
  const adjustedIsWorse = adjustedDiff < 0;
  
  const displayNet = earlyRedeem ? adjustedNet : result.net;
  const displayDiff = earlyRedeem ? adjustedDiff : diff;
  const displayIsWorse = earlyRedeem ? adjustedIsWorse : isWorse;
  
  return (
    <div style={{
      borderRadius: 18, overflow: "hidden", transition: "all 0.3s",
      border: isBest ? `2px solid ${bondData.color}` : "1.5px solid #e8eff6",
      background: "white",
      boxShadow: isBest ? `0 4px 24px ${bondData.color}22` : "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      {isBest && (
        <div style={{
          background: `linear-gradient(135deg, ${bondData.color}, ${bondData.color}dd)`,
          color: "white", padding: "8px 20px", fontSize: 12, fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5,
          textTransform: "uppercase",
        }}>
          ✦ Najkorzystniejsza opcja dla Twojego scenariusza
        </div>
      )}
      
      <div style={{ padding: "22px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{
                display: "inline-block", width: 10, height: 10, borderRadius: "50%",
                background: bondData.color,
              }} />
              <span style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", fontFamily: "'Playfair Display', Georgia, serif" }}>
                {bondData.name}
              </span>
              <span style={{ fontSize: 14, color: "#7a8fa3", fontFamily: "'DM Sans', sans-serif" }}>
                {bondData.fullName}
              </span>
            </div>
            <p style={{ fontSize: 14, color: "#5a7189", margin: 0, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>
              {bondData.description}
            </p>
          </div>
          <div style={{ textAlign: "right", minWidth: 130 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: displayIsWorse ? "#dc2626" : "#059669", fontFamily: "'Playfair Display', Georgia, serif" }}>
              {displayDiff >= 0 ? "+" : ""}{formatPLN(displayDiff)}
            </div>
            <div style={{ fontSize: 12, color: "#8899aa", fontFamily: "'DM Sans', sans-serif" }}>
              vs Twoja obecna opcja
            </div>
          </div>
        </div>
        
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
          padding: "14px 0", borderTop: "1px solid #f0f4f8", borderBottom: "1px solid #f0f4f8",
          marginBottom: 12,
        }}>
          <div>
            <div style={{ fontSize: 11, color: "#8899aa", fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>Zarobisz netto</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#1e3a5f", fontFamily: "'DM Sans', sans-serif" }}>
              {formatPLN(displayNet)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#8899aa", fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>Wypłacisz łącznie</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#1e3a5f", fontFamily: "'DM Sans', sans-serif" }}>
              {formatPLN(result.invested + displayNet)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#8899aa", fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>Podatek Belki</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#dc2626", fontFamily: "'DM Sans', sans-serif" }}>
              -{formatPLN(result.tax)}
            </div>
          </div>
        </div>
        
        {earlyRedeem && (
          <div style={{
            padding: "10px 14px", background: "#fef3c7", borderRadius: 10, marginBottom: 12,
            fontSize: 13, color: "#92400e", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5,
          }}>
            ⚠️ Ta obligacja trwa {bondData.periodLabel}, ale Twój horyzont jest krótszy.
            Wcześniejszy wykup kosztuje {formatPLN2(earlyFee)}.
            Powyższe wyliczenie już to uwzględnia.
          </div>
        )}
        
        <button onClick={() => setExpanded(!expanded)} style={{
          display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
          color: "#2d5a87", fontSize: 14, fontWeight: 500, cursor: "pointer", padding: "4px 0",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          <span style={{ transform: expanded ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s", display: "inline-block" }}>▸</span>
          {expanded ? "Zwiń szczegóły" : "Jak to działa? Wady i zalety"}
        </button>
        
        {expanded && (
          <div style={{ marginTop: 14, animation: "fadeIn 0.3s ease" }}>
            <div style={{
              background: "#f8fafc", borderRadius: 12, padding: "16px 18px", marginBottom: 14,
              fontSize: 14, color: "#3d5a73", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif",
            }}>
              {bondData.howItWorks}
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#059669", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>✓ Zalety</div>
                {bondData.pros.map((p, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#3d5a73", marginBottom: 6, paddingLeft: 12, borderLeft: "2px solid #bbf7d0", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>
                    {p}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#dc2626", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>✗ Wady</div>
                {bondData.cons.map((c, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#3d5a73", marginBottom: 6, paddingLeft: 12, borderLeft: "2px solid #fecaca", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InflationContext({ amount, horizon }) {
  const futureNeeded = amount * Math.pow(1 + FORECAST_INFLATION, horizon);
  const loss = futureNeeded - amount;
  
  return (
    <div style={{
      background: "linear-gradient(135deg, #1e293b, #334155)",
      borderRadius: 18, padding: "24px 28px", color: "white", marginBottom: 24,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 22 }}>📉</span>
        <span style={{ fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", opacity: 0.9 }}>
          Co się stanie, jeśli nic nie zrobisz?
        </span>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, fontFamily: "'DM Sans', sans-serif", opacity: 0.85 }}>
        Przy prognozowanej inflacji ~{(FORECAST_INFLATION * 100).toFixed(1)}% rocznie, za{" "}
        {horizon >= 1 ? `${horizon} ${horizon === 1 ? "rok" : horizon < 5 ? "lata" : "lat"}` : "3 miesiące"}{" "}
        Twoje <strong>{formatPLN(amount)}</strong> będzie warte tyle, co dzisiejsze <strong style={{ color: "#fbbf24" }}>{formatPLN(Math.round(amount / Math.pow(1 + FORECAST_INFLATION, horizon)))}</strong>.
        {" "}To utrata siły nabywczej o <strong style={{ color: "#f87171" }}>{formatPLN(Math.round(loss))}</strong>.
      </p>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────

export default function App() {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(10000);
  const [source, setSource] = useState(null);
  const [currentRate, setCurrentRate] = useState(0.04);
  const [horizon, setHorizon] = useState(null);
  const [inflAssumption, setInflAssumption] = useState(FORECAST_INFLATION);
  const [showSettings, setShowSettings] = useState(false);
  const resultsRef = useRef(null);
  
  const canProceed = [
    amount > 0,
    source !== null,
    horizon !== null,
  ];
  
  function goNext() {
    if (step < 2 && canProceed[step]) setStep(step + 1);
    else if (step === 2 && canProceed[2]) setStep(3);
  }
  
  function goBack() { if (step > 0) setStep(step - 1); }
  
  // Calculate results
  const currentResult = source === "savings"
    ? calcSavingsAccount(amount, currentRate, horizon || 1)
    : source === "deposit"
      ? calcDeposit(amount, currentRate, horizon || 1)
      : { gross: 0, tax: 0, net: 0, total: amount };
  
  const bondResults = {};
  const relevantBonds = [];
  
  if (horizon) {
    Object.keys(BONDS).forEach(key => {
      const bond = BONDS[key];
      // Only show bonds that make sense for this horizon
      // Show if bond period <= horizon, OR if bond period is within reasonable range
      const show = bond.period <= horizon * 1.5 || (horizon >= 3 && key === "EDO");
      // Always show if period matches exactly
      const exactMatch = bond.period === horizon || Math.abs(bond.period - horizon) < 0.5;
      
      if (show || exactMatch) {
        bondResults[key] = calcBond(key, amount, horizon, inflAssumption);
        relevantBonds.push(key);
      }
    });
  }
  
  // Sort by net gain (adjusted for early redemption)
  const sorted = [...relevantBonds].sort((a, b) => {
    const aNet = bondResults[a].net - (BONDS[a].period > horizon ? calcEarlyRedemption(a, amount) : 0);
    const bNet = bondResults[b].net - (BONDS[b].period > horizon ? calcEarlyRedemption(b, amount) : 0);
    return bNet - aNet;
  });
  
  const bestBond = sorted[0];
  const bestBondNet = bestBond ? bondResults[bestBond].net - (BONDS[bestBond].period > horizon ? calcEarlyRedemption(bestBond, amount) : 0) : 0;
  const currentBetter = currentResult.net > bestBondNet;
  
  // Bar chart max for visual comparison
  const allNets = [currentResult.net, ...sorted.map(k => bondResults[k].net - (BONDS[k].period > horizon ? calcEarlyRedemption(k, amount) : 0))];
  const maxNet = Math.max(...allNets, 1);

  const stepTitles = [
    "Ile pieniędzy chcesz ulokować?",
    "Gdzie trzymasz je teraz?",
    "Na jak długo możesz je odłożyć?",
  ];
  
  const stepSubtitles = [
    "Minimalna kwota zakupu obligacji to 100 zł (1 sztuka).",
    "To pomoże nam uczciwie porównać opcje.",
    "Wybierz okres, przez który nie będziesz potrzebować tych pieniędzy.",
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f5f8fc 0%, #edf2f7 100%)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
      
      {/* Header */}
      <header style={{
        padding: "20px 24px", borderBottom: "1px solid #e2e8f0",
        background: "white", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: -0.3 }}>
              Przewodnik po obligacjach
            </div>
            <div style={{ fontSize: 11, color: "#8899aa", marginTop: 1 }}>
              Narzędzie edukacyjne · Nie stanowi rekomendacji inwestycyjnej
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#aabbcc", textAlign: "right" }}>
            Dane: marzec 2026<br/>
            Źródło: obligacjeskarbowe.pl
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 60px" }}>
        
        {/* ─── WIZARD STEPS ─── */}
        {step < 3 && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <StepIndicator current={step} total={3} />
            
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h1 style={{
                fontSize: 28, fontWeight: 700, color: "#1e3a5f", margin: "0 0 8px",
                fontFamily: "'Playfair Display', Georgia, serif", lineHeight: 1.3,
              }}>
                {stepTitles[step]}
              </h1>
              <p style={{ fontSize: 15, color: "#7a8fa3", margin: 0, lineHeight: 1.5 }}>
                {stepSubtitles[step]}
              </p>
            </div>
            
            <div style={{
              background: "white", borderRadius: 20, padding: "32px 28px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1px solid #e8eff6",
              marginBottom: 28,
            }}>
              {step === 0 && <AmountInput value={amount} onChange={setAmount} />}
              {step === 1 && <SourceSelector value={source} onChange={setSource} rate={currentRate} onRateChange={setCurrentRate} />}
              {step === 2 && <HorizonSelector value={horizon} onChange={setHorizon} />}
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              {step > 0 ? (
                <button onClick={goBack} style={{
                  padding: "14px 28px", borderRadius: 12, border: "1.5px solid #dde5ed",
                  background: "white", color: "#5a7189", fontSize: 15, fontWeight: 500,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}>
                  ← Wstecz
                </button>
              ) : <div />}
              
              <button onClick={goNext} disabled={!canProceed[step]} style={{
                padding: "14px 36px", borderRadius: 12, border: "none",
                background: canProceed[step] ? "linear-gradient(135deg, #1e3a5f, #2d5a87)" : "#c8d6e5",
                color: "white", fontSize: 15, fontWeight: 600,
                cursor: canProceed[step] ? "pointer" : "not-allowed",
                fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                boxShadow: canProceed[step] ? "0 4px 12px rgba(30,58,95,0.3)" : "none",
              }}>
                {step === 2 ? "Pokaż wyniki →" : "Dalej →"}
              </button>
            </div>
          </div>
        )}
        
        {/* ─── RESULTS ─── */}
        {step === 3 && (
          <div ref={resultsRef} style={{ animation: "slideUp 0.5s ease" }}>
            
            {/* Back & Edit */}
            <button onClick={() => setStep(2)} style={{
              display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
              color: "#5a7189", fontSize: 14, cursor: "pointer", padding: "0 0 16px",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              ← Zmień założenia
            </button>
            
            {/* Summary of inputs */}
            <div style={{
              display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap",
            }}>
              {[
                { label: "Kwota", value: formatPLN(amount) },
                { label: "Teraz", value: source === "cash" ? "Gotówka" : source === "savings" ? `Konto ${(currentRate * 100).toFixed(1)}%` : `Lokata ${(currentRate * 100).toFixed(1)}%` },
                { label: "Horyzont", value: horizon < 1 ? "3 mies." : horizon === 1 ? "1 rok" : `${horizon} ${horizon < 5 ? "lata" : "lat"}` },
              ].map((tag, i) => (
                <span key={i} style={{
                  padding: "8px 16px", background: "white", borderRadius: 10,
                  border: "1px solid #e2e8f0", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                  color: "#3d5a73",
                }}>
                  <span style={{ color: "#99aabb" }}>{tag.label}:</span> <strong>{tag.value}</strong>
                </span>
              ))}
            </div>
            
            <h2 style={{
              fontSize: 26, fontWeight: 700, color: "#1e3a5f", margin: "0 0 6px",
              fontFamily: "'Playfair Display', Georgia, serif",
            }}>
              Twoje opcje - uczciwe porównanie
            </h2>
            <p style={{ fontSize: 14, color: "#7a8fa3", margin: "0 0 20px", lineHeight: 1.5 }}>
              Wszystkie kwoty po potrąceniu 19% podatku Belki. Inflacja w projekcji: {(inflAssumption * 100).toFixed(1)}%.
            </p>
            
            {/* Inflation context */}
            <InflationContext amount={amount} horizon={horizon} />
            
            {/* Assumption controls */}
            <button onClick={() => setShowSettings(!showSettings)} style={{
              display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
              color: "#7a8fa3", fontSize: 13, cursor: "pointer", padding: "0 0 16px",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              <span>⚙️</span> {showSettings ? "Ukryj" : "Zmień"} założenia dotyczące inflacji
            </button>
            
            {showSettings && (
              <div style={{
                background: "white", borderRadius: 14, padding: "18px 22px",
                border: "1px solid #e8eff6", marginBottom: 20, animation: "fadeIn 0.3s ease",
              }}>
                <label style={{ fontSize: 13, color: "#5a7189", display: "block", marginBottom: 8 }}>
                  Prognozowana średnia inflacja (%):
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="range" min="0" max="10" step="0.1"
                    value={inflAssumption * 100}
                    onChange={e => setInflAssumption(parseFloat(e.target.value) / 100)}
                    style={{ flex: 1, accentColor: "#1e3a5f" }}
                  />
                  <span style={{ fontSize: 18, fontWeight: 600, color: "#1e3a5f", minWidth: 50, textAlign: "right" }}>
                    {(inflAssumption * 100).toFixed(1)}%
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "#99aabb", margin: "8px 0 0", lineHeight: 1.5 }}>
                  Aktualna inflacja: {(CURRENT_INFLATION * 100).toFixed(1)}%. Prognozy ekonomistów na 2026: ok. 2,2–3,0%. Wyższa inflacja = wyższe odsetki z COI/EDO.
                </p>
              </div>
            )}
            
            {/* VISUAL BAR COMPARISON */}
            <div style={{
              background: "white", borderRadius: 18, padding: "24px 28px",
              border: "1px solid #e8eff6", marginBottom: 24,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1e3a5f", marginBottom: 18, fontFamily: "'DM Sans', sans-serif" }}>
                Ile zarobisz netto - porównanie wizualne
              </div>
              
              {/* Current option bar */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: "#5a7189" }}>
                    {source === "cash" ? "Gotówka (0%)" : source === "savings" ? `Konto (${(currentRate*100).toFixed(1)}%)` : `Lokata (${(currentRate*100).toFixed(1)}%)`}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1e3a5f" }}>{formatPLN(Math.round(currentResult.net))}</span>
                </div>
                <div style={{ height: 28, background: "#f1f5f9", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 8,
                    width: `${Math.max(2, (currentResult.net / maxNet) * 100)}%`,
                    background: "linear-gradient(90deg, #94a3b8, #b0bec5)",
                    transition: "width 0.6s ease",
                    display: "flex", alignItems: "center", paddingLeft: 10,
                  }}>
                    <span style={{ fontSize: 11, color: "white", fontWeight: 600, whiteSpace: "nowrap" }}>Twoja obecna opcja</span>
                  </div>
                </div>
              </div>
              
              {/* Bond bars */}
              {sorted.map((key, i) => {
                const net = bondResults[key].net - (BONDS[key].period > horizon ? calcEarlyRedemption(key, amount) : 0);
                const bondData = BONDS[key];
                return (
                  <div key={key} style={{ marginBottom: i < sorted.length - 1 ? 12 : 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: "#5a7189" }}>
                        {bondData.name} ({bondData.fullName})
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: net > currentResult.net ? "#059669" : "#dc2626" }}>
                        {formatPLN(Math.round(net))}
                      </span>
                    </div>
                    <div style={{ height: 28, background: "#f1f5f9", borderRadius: 8, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 8,
                        width: `${Math.max(2, (Math.max(0, net) / maxNet) * 100)}%`,
                        background: `linear-gradient(90deg, ${bondData.color}, ${bondData.color}cc)`,
                        transition: "width 0.6s ease",
                        transitionDelay: `${i * 0.1}s`,
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Verdict */}
            {currentBetter && (
              <div style={{
                background: "linear-gradient(135deg, #fef3c7, #fde68a44)",
                borderRadius: 18, padding: "22px 26px", marginBottom: 24,
                border: "1.5px solid #fbbf2444",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 22 }}>💡</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#92400e", fontFamily: "'Playfair Display', Georgia, serif" }}>
                    W tym scenariuszu Twoja obecna opcja jest lepsza
                  </span>
                </div>
                <p style={{ fontSize: 14, color: "#78350f", margin: 0, lineHeight: 1.6 }}>
                  Przy {(currentRate * 100).toFixed(1)}% na {source === "savings" ? "koncie oszczędnościowym" : "lokacie"}{" "}
                  i horyzoncie {horizon < 1 ? "3 miesięcy" : `${horizon} ${horizon === 1 ? "roku" : horizon < 5 ? "lat" : "lat"}`},{" "}
                  żadna z obligacji nie daje lepszego wyniku netto. To się może zmienić przy dłuższym horyzoncie lub zmianie stóp procentowych.
                </p>
              </div>
            )}
            
            {/* Bond cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              {sorted.map(key => (
                <ResultCard
                  key={key}
                  bond={key}
                  result={bondResults[key]}
                  currentResult={currentResult}
                  amount={amount}
                  isBest={key === bestBond && !currentBetter}
                  inflationAssumption={inflAssumption}
                  horizon={horizon}
                />
              ))}
            </div>
            
            {/* Educational footer */}
            <div style={{
              background: "white", borderRadius: 18, padding: "28px 28px",
              border: "1px solid #e8eff6",
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", margin: "0 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>
                Zanim podejmiesz decyzję
              </h3>
              <div style={{ display: "grid", gap: 14 }}>
                {[
                  {
                    icon: "🔒",
                    title: "Obligacje są bezpieczne, ale nie płynne",
                    text: "Gwarantem jest Skarb Państwa - to silniejsza gwarancja niż BFG dla lokat. Ale wcześniejszy wykup kosztuje. Nie lokuj tu pieniędzy, które możesz potrzebować nagle.",
                  },
                  {
                    icon: "📊",
                    title: "To projekcja, nie gwarancja",
                    text: "Oprocentowanie obligacji zmiennych (ROR, DOR, COI, EDO) zależy od przyszłej inflacji i stóp NBP. Nikt nie zna przyszłości - dlatego pokazujemy założenia, które możesz zmienić.",
                  },
                  {
                    icon: "💰",
                    title: "Podatek Belki zjada część zysków",
                    text: "Od każdej złotówki odsetek, 19 groszy zabiera fiskus. Wyjątek: konto IKE-Obligacje - tam po 60. roku życia podatku nie ma. Limit wpłat IKE w 2026: 28 260 zł.",
                  },
                  {
                    icon: "🧩",
                    title: "Nie musisz wybierać jednej opcji",
                    text: "Możesz podzielić pieniądze - część na koncie (szybki dostęp), część w obligacjach 3-letnich (stały zysk), część w 10-letnich (ochrona przed inflacją). To często najmądrzejsze podejście.",
                  },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 22, lineHeight: 1 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1e3a5f", marginBottom: 3 }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: "#5a7189", lineHeight: 1.6 }}>{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Disclaimer */}
            <div style={{
              marginTop: 28, padding: "18px 22px",
              background: "#f8fafc", borderRadius: 14,
              border: "1px solid #e8eff6",
            }}>
              <p style={{ fontSize: 11, color: "#99aabb", margin: 0, lineHeight: 1.7 }}>
                <strong>Ważne:</strong> To narzędzie ma charakter wyłącznie edukacyjny i nie stanowi rekomendacji inwestycyjnej
                w rozumieniu obowiązujących przepisów prawa. Obliczenia opierają się na aktualnych parametrach obligacji
                (marzec 2026) i przyjętych założeniach dotyczących inflacji i stóp procentowych, które mogą się zmienić.
                Decyzje finansowe podejmujesz na własną odpowiedzialność. Przed zakupem obligacji zapoznaj się z listami
                emisyjnymi na obligacjeskarbowe.pl.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
