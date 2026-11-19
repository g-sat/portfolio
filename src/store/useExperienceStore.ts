import { create } from 'zustand'

/**
 * Mutable, non-reactive frame state. Read/write directly inside
 * useFrame / gsap.ticker — never subscribe React components to this.
 */
export const live = {
  scroll: {
    y: 0,
    limit: 1,
    /** 0 → 1 across the whole document */
    progress: 0,
    /** Lenis velocity (px / frame-ish) */
    velocity: 0,
  },
  /** Raw pointer in [-1, 1] */
  pointer: { x: 0, y: 0 },
  /** 0 → 1 camera dolly-in + artifact inflate after the curtain lifts */
  intro: 0,
}

type ExperienceState = {
  live: typeof live
  /** WebGL programs compiled + first frame ready */
  sceneReady: boolean
  /** Curtain lifted — DOM entrance can play */
  revealed: boolean
  setSceneReady: () => void
  setRevealed: () => void
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  live,
  sceneReady: false,
  revealed: false,
  setSceneReady: () => set({ sceneReady: true }),
  setRevealed: () => set({ revealed: true }),
}))
