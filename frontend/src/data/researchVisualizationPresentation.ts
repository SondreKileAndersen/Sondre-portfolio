// Presentation only. Canonical research data and provenance remain unchanged.
export const momentColors: Record<string, string> = {
  M_DEV: '#437F99', M_FORM: '#70C6B7', M_PRESS: '#ECC5AF', M_PROJ: '#D1665E',
}
export const momentCardColors: Record<string, { background: string; text: string }> = {
  M_FORM: { background: momentColors.M_FORM, text: '#163564' },
  M_PROJ: { background: momentColors.M_PROJ, text: '#FFFFFF' },
  M_DEV: { background: '#407B95', text: '#FFFFFF' },
  M_PRESS: { background: momentColors.M_PRESS, text: '#163564' },
}
export const processMomentIds: Record<string, string> = {
  FIT: 'M_FORM', PROJECT: 'M_PROJ', DEV: 'M_DEV', ASSET: 'M_PRESS',
}

// Stable node centers in the approved reference composition (1180 × 557).
// These are display coordinates, independent of active relations or their counts.
export const networkLayout = {
  width: 1180,
  height: 557,
  centers: {
    M_DEV: { x: 570, y: 30 },
    M_FORM: { x: 141, y: 332 },
    M_PRESS: { x: 1042, y: 252 },
    M_PROJ: { x: 560, y: 507 },
    P_PROJECTWEB: { x: 295, y: 131 },
    P_DEVELOPERWEB: { x: 513, y: 202 },
    P_EMAIL: { x: 327, y: 253 },
    P_PRESSKIT: { x: 597, y: 292 },
    P_ACTIVITY: { x: 843, y: 351 },
    P_TRAILER: { x: 337, y: 413 },
    P_STEAM: { x: 770, y: 449 },
  } as Record<string, { x: number; y: number }>,
}

export const overviewSourceOrder = ['P_EMAIL', 'P_STEAM', 'P_TRAILER', 'P_DEVELOPERWEB', 'P_ACTIVITY', 'P_PRESSKIT'] as const
