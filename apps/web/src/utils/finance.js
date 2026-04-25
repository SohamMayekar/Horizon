/**
 * finance.js — Pure financial simulation engine for Indian demographics.
 * Zero React, zero side-effects. Every function is deterministic.
 *
 * Currency: ₹ (Indian Rupee) · Formatting: Lakh / Crore system
 *
 * Simulation order per year (t):
 *   1. balance  *= (1 + annualRate)          — compound growth on opening balance
 *   2. balance  += annualSavings(t)          — add yearly savings (grows with salary)
 *   3. balance  -= retirementSpend(t)        — subtract inflation-adjusted drawdown
 *   4. balance  -= sum(milestoneCosts[t])    — inflation-adjusted milestone drawdowns
 *   5. balance  += sum(incomeEvents[t])      — one-time income boosts
 *   6. balance  -= sum(expenseEvents[t])     — one-time expense hits
 */

export const AGE_MIN = 20;
export const AGE_MAX = 80;

// ─── Formatters (Indian Lakh/Crore system) ────────────────────────────────────

export const formatCurrency = (n) => {
  if (n === null || n === undefined || Number.isNaN(n)) return "₹0";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_00_00_000) return `${sign}₹${(abs / 1_00_00_000).toFixed(2)} Cr`;
  if (abs >= 1_00_000) return `${sign}₹${(abs / 1_00_000).toFixed(1)} L`;
  if (abs >= 1_000) return `${sign}₹${(abs / 1_000).toFixed(1)}K`;
  return `${sign}₹${abs.toFixed(0)}`;
};

export const formatCurrencyFull = (n) => {
  if (n === null || n === undefined || Number.isNaN(n)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
};

export const formatCompact = (n) => {
  if (n === null || n === undefined || Number.isNaN(n)) return "₹0";
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_00_00_000) return `${sign}₹${(abs / 1_00_00_000).toFixed(1)} Cr`;
  if (abs >= 1_00_000) return `${sign}₹${(abs / 1_00_000).toFixed(0)} L`;
  if (abs >= 1_000) return `${sign}₹${(abs / 1_000).toFixed(0)}K`;
  return `${sign}₹${abs.toFixed(0)}`;
};

// ─── Core simulation ──────────────────────────────────────────────────────────

export function simulateNetWorth({
  currentAge = 25,
  currentNetWorth = 0,
  monthlySavings = 25000,
  interestRate = 0.12,
  inflationRate = 0.06,
  salaryGrowth = 0.08,
  retirementAge = 60,
  retirementSpend = 6_00_000,
  milestones = [],
  events = [],
}) {
  const costByAge = new Map();
  for (const m of milestones) {
    if (m.cost > 0) {
      // Inflate milestone cost from today's value to future value
      const yearsAway = Math.max(0, m.age - currentAge);
      const inflatedCost = m.cost * Math.pow(1 + inflationRate, yearsAway);
      costByAge.set(m.age, (costByAge.get(m.age) ?? 0) + inflatedCost);
    }
  }

  const eventsByAge = new Map();
  for (const ev of events) {
    const list = eventsByAge.get(ev.age) ?? [];
    list.push(ev);
    eventsByAge.set(ev.age, list);
  }

  const baseAnnualSavings = monthlySavings * 12;
  const points = [];
  let balance = currentNetWorth;

  for (let age = AGE_MIN; age <= AGE_MAX; age++) {
    if (age < currentAge) {
      points.push({
        age,
        balance: currentNetWorth,
        annualSavings: 0,
        growthAmount: 0,
        milestoneCost: 0,
        inflationAdjustedCost: 0,
        isProjected: false,
        events: [],
      });
      continue;
    }

    const yearsFromNow = age - currentAge;
    const isWorking = age < retirementAge;

    // Salary grows each year — savings grow proportionally
    const yearSavings = isWorking
      ? baseAnnualSavings * Math.pow(1 + salaryGrowth, yearsFromNow)
      : 0;

    // Retirement spend inflates from today's value
    const yearSpend = isWorking
      ? 0
      : retirementSpend * Math.pow(1 + inflationRate, yearsFromNow);

    // Step 1 — compound growth
    const growthAmount = balance * interestRate;
    balance += growthAmount;

    // Step 2 — savings or retirement drawdown
    balance += yearSavings - yearSpend;

    // Step 3 — milestone drawdowns (already inflation-adjusted)
    const milestoneCost = costByAge.get(age) ?? 0;
    balance -= milestoneCost;

    // Step 4 — one-time events
    const yearEvents = eventsByAge.get(age) ?? [];
    for (const ev of yearEvents) {
      balance += ev.type === "income" ? ev.amount : -ev.amount;
    }

    points.push({
      age,
      balance: Math.round(balance),
      annualSavings: Math.round(yearSavings),
      growthAmount: Math.round(growthAmount),
      milestoneCost: Math.round(milestoneCost),
      retirementDraw: Math.round(yearSpend),
      isProjected: true,
      events: yearEvents,
    });
  }

  return points;
}

// ─── Derived analytics ────────────────────────────────────────────────────────

export function summarize(points, currentAge) {
  const empty = { peak: null, depletion: null, totalMilestoneCost: 0 };
  if (!points.length) return empty;

  const projected = points.filter((p) => p.isProjected);
  if (!projected.length) return empty;

  const peak = projected.reduce(
    (a, b) => (b.balance > a.balance ? b : a),
    projected[0],
  );
  const depletion = projected.find((p) => p.balance < 0) ?? null;
  const totalMilestoneCost = projected.reduce(
    (s, p) => s + (p.milestoneCost ?? 0),
    0,
  );

  return { peak, depletion, totalMilestoneCost };
}

// ─── Milestone Insights Engine ────────────────────────────────────────────────

export function computeMilestoneInsights({ points, milestones, simParams }) {
  if (!points.length || !milestones.length) return [];

  const {
    currentAge = 25,
    currentNetWorth = 0,
    monthlySavings = 25000,
    interestRate = 0.12,
    inflationRate = 0.06,
    salaryGrowth = 0.08,
    retirementAge = 60,
    retirementSpend = 6_00_000,
    events = [],
  } = simParams;

  const sorted = [...milestones].sort((a, b) => a.age - b.age);
  const insights = [];

  const baselinePoints = simulateNetWorth({
    currentAge, currentNetWorth, monthlySavings, interestRate, inflationRate, salaryGrowth,
    retirementAge, retirementSpend, milestones, events,
  });
  const baselineFinal = baselinePoints[baselinePoints.length - 1]?.balance ?? 0;

  for (const milestone of sorted) {
    const { age, cost, title, id, category } = milestone;
    if (cost <= 0) {
      insights.push({
        id, title, age, cost, category,
        onTrack: true, gap: 0, requiredMonthlySavings: 0,
        additionalMonthlySavings: 0,
        balanceAtMilestone: points.find((p) => p.age === age)?.balance ?? 0,
        impactOnFinalWealth: 0, status: "green",
      });
      continue;
    }

    const pointAtAge = points.find((p) => p.age === age);
    const balanceAtMilestone = pointAtAge?.balance ?? 0;
    const onTrack = balanceAtMilestone >= 0;
    const gap = onTrack ? 0 : Math.abs(balanceAtMilestone);

    let additionalMonthlySavings = 0;
    if (!onTrack && age > currentAge) {
      const yearsToSave = age - currentAge;
      const monthlyRate = interestRate / 12;
      const months = yearsToSave * 12;
      if (monthlyRate > 0) {
        const fvFactor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
        additionalMonthlySavings = Math.ceil(gap / fvFactor);
      } else {
        additionalMonthlySavings = Math.ceil(gap / months);
      }
    }

    const withoutThis = milestones.filter((m) => m.id !== id);
    const altPoints = simulateNetWorth({
      currentAge, currentNetWorth, monthlySavings, interestRate, inflationRate, salaryGrowth,
      retirementAge, retirementSpend, milestones: withoutThis, events,
    });
    const altFinal = altPoints[altPoints.length - 1]?.balance ?? 0;
    const impactOnFinalWealth = altFinal - baselineFinal;

    let status = "green";
    if (!onTrack) status = "red";
    else if (balanceAtMilestone < cost * 0.5) status = "amber";

    insights.push({
      id, title, age, cost, category, onTrack, gap,
      requiredMonthlySavings: monthlySavings + additionalMonthlySavings,
      additionalMonthlySavings, balanceAtMilestone, impactOnFinalWealth, status,
    });
  }

  return insights;
}

export function findBiggestBottleneck(insights) {
  if (!insights.length) return null;
  return insights.reduce((worst, curr) =>
    curr.impactOnFinalWealth > worst.impactOnFinalWealth ? curr : worst,
    insights[0],
  );
}

export function computeRequiredSavingsForSuccess({
  currentAge, currentNetWorth, interestRate, inflationRate = 0.06, salaryGrowth = 0.08,
  retirementAge, retirementSpend, milestones, events,
}) {
  let lo = 0;
  let hi = 10_00_000;
  let result = hi;

  for (let i = 0; i < 40; i++) {
    const mid = Math.floor((lo + hi) / 2);
    const pts = simulateNetWorth({
      currentAge, currentNetWorth, monthlySavings: mid, interestRate,
      inflationRate, salaryGrowth, retirementAge, retirementSpend, milestones, events,
    });
    const allPositive = pts.every((p) => !p.isProjected || p.balance >= 0);
    if (allPositive) { result = mid; hi = mid; }
    else { lo = mid + 1; }
  }

  return result;
}
