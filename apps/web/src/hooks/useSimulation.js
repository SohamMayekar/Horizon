import { useMemo } from "react";
import { useSimulationStore } from "../features/simulation/store";
import { useMilestoneStore } from "../features/milestones/milestoneStore";
import {
  simulateNetWorth,
  summarize,
  AGE_MIN,
  AGE_MAX,
} from "../utils/finance";

/**
 * useSimulation — pulls every input from Zustand stores, merges milestone costs,
 * memoizes the result. Now includes inflation and salary growth.
 */
export function useSimulation() {
  const currentAge = useSimulationStore((s) => s.currentAge);
  const currentNetWorth = useSimulationStore((s) => s.currentNetWorth);
  const monthlySavings = useSimulationStore((s) => s.monthlySavings);
  const interestRate = useSimulationStore((s) => s.interestRate);
  const inflationRate = useSimulationStore((s) => s.inflationRate);
  const salaryGrowth = useSimulationStore((s) => s.salaryGrowth);
  const retirementAge = useSimulationStore((s) => s.retirementAge);
  const retirementSpend = useSimulationStore((s) => s.retirementSpend);
  const events = useSimulationStore((s) => s.events);
  const milestones = useMilestoneStore((s) => s.milestones);

  const points = useMemo(
    () =>
      simulateNetWorth({
        currentAge,
        currentNetWorth,
        monthlySavings,
        interestRate,
        inflationRate,
        salaryGrowth,
        retirementAge,
        retirementSpend,
        milestones,
        events,
      }),
    [
      currentAge, currentNetWorth, monthlySavings, interestRate,
      inflationRate, salaryGrowth, retirementAge, retirementSpend,
      milestones, events,
    ],
  );

  const summary = useMemo(
    () => summarize(points, currentAge),
    [points, currentAge],
  );

  return { points, summary };
}

export function useSelectedPoint() {
  const selectedAge = useSimulationStore((s) => s.selectedAge);
  const { points } = useSimulation();
  return points.find((p) => p.age === selectedAge) ?? null;
}
