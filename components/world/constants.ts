import { METRES_TO_UNITS } from "@/lib/geo/projection";

/** Vertical exaggeration of terrain relief. */
export const EXAGGERATION = 26;
/** metres → world Y */
export const M2Y = METRES_TO_UNITS * EXAGGERATION;

export const BG = "#03060c";
export const BG_DAY = "#efe8d6";
