import {
  Briefcase,
  Building2,
  Container,
  Cpu,
  GraduationCap,
  HardHat,
  Landmark,
  Layers,
  Radio,
  Stethoscope,
  Store,
  UtensilsCrossed
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Branche } from "./types";

export const brancheIcons: Record<Branche, LucideIcon> = {
  general: Layers,
  retail: Store,
  horeca: UtensilsCrossed,
  construction: HardHat,
  healthcare: Stethoscope,
  financial: Landmark,
  marketing_media: Radio,
  ict: Cpu,
  logistics: Container,
  professional_services: Briefcase,
  education: GraduationCap,
  government: Building2
};
