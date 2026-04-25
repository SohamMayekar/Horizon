import {
  Home,
  Briefcase,
  Plane,
  Heart,
  GraduationCap,
  Activity,
  TrendingUp,
  Car,
  Baby,
  Landmark,
  Umbrella,
  Star,
} from "lucide-react";

/**
 * Category definitions — single source of truth for colors, icons, labels.
 * color    : accent hex used for pin, card border, glow
 * dim      : muted background tint (color + low opacity)
 * Icon     : Lucide component
 * label    : display string
 */
export const CATEGORIES = {
  home: {
    label: "Home",
    color: "#3B82F6",
    dim: "rgba(59,130,246,0.12)",
    Icon: Home,
  },
  career: {
    label: "Career",
    color: "#8B5CF6",
    dim: "rgba(139,92,246,0.12)",
    Icon: Briefcase,
  },
  travel: {
    label: "Travel",
    color: "#06B6D4",
    dim: "rgba(6,182,212,0.12)",
    Icon: Plane,
  },
  family: {
    label: "Family",
    color: "#EC4899",
    dim: "rgba(236,72,153,0.12)",
    Icon: Baby,
  },
  education: {
    label: "Education",
    color: "#F59E0B",
    dim: "rgba(245,158,11,0.12)",
    Icon: GraduationCap,
  },
  health: {
    label: "Health",
    color: "#10B981",
    dim: "rgba(16,185,129,0.12)",
    Icon: Activity,
  },
  finance: {
    label: "Finance",
    color: "#34D399",
    dim: "rgba(52,211,153,0.12)",
    Icon: TrendingUp,
  },
  vehicle: {
    label: "Vehicle",
    color: "#F97316",
    dim: "rgba(249,115,22,0.12)",
    Icon: Car,
  },
  retirement: {
    label: "Retirement",
    color: "#A78BFA",
    dim: "rgba(167,139,250,0.12)",
    Icon: Umbrella,
  },
  giving: {
    label: "Giving",
    color: "#FB7185",
    dim: "rgba(251,113,133,0.12)",
    Icon: Heart,
  },
  government: {
    label: "Gov / Tax",
    color: "#64748B",
    dim: "rgba(100,116,139,0.12)",
    Icon: Landmark,
  },
  other: {
    label: "Other",
    color: "#94A3B8",
    dim: "rgba(148,163,184,0.12)",
    Icon: Star,
  },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES);

export function getCat(key) {
  return CATEGORIES[key] ?? CATEGORIES.other;
}
