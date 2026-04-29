import { useSyncExternalStore } from 'react';

// Module-scoped event emitter for hero interactivity state.
// Avoids adding a new dependency (Zustand etc.) and keeps the
// HeroScene → HeroOverlay communication layer minimal.

type Listener = () => void;

interface HeroState {
  headlineOverride: string | null;
  // Monotonically increasing counter so consumers can react to a
  // "restart animation" event even when headlineOverride is unchanged.
  restartTick: number;
}

let state: HeroState = {
  headlineOverride: null,
  restartTick: 0,
};

const listeners = new Set<Listener>();
let revertTimer: ReturnType<typeof setTimeout> | null = null;

const emit = (): void => {
  for (const listener of listeners) listener();
};

const subscribe = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = (): HeroState => state;

export const setHeadlineOverride = (text: string, ttlMs = 5000): void => {
  if (revertTimer !== null) {
    clearTimeout(revertTimer);
    revertTimer = null;
  }
  state = { ...state, headlineOverride: text };
  emit();
  revertTimer = setTimeout(() => {
    state = { ...state, headlineOverride: null };
    revertTimer = null;
    emit();
  }, ttlMs);
};

export const clearHeadlineOverride = (): void => {
  if (revertTimer !== null) {
    clearTimeout(revertTimer);
    revertTimer = null;
  }
  if (state.headlineOverride === null) return;
  state = { ...state, headlineOverride: null };
  emit();
};

// Bumping the tick is observed by the Skeleton via a hook that calls
// reset+play on every tracked AnimationAction. Extensible to clip cycling
// later by extending state with a clip name/index.
export const requestRestart = (): void => {
  state = { ...state, restartTick: state.restartTick + 1 };
  emit();
};

export const useHeadlineOverride = (): string | null =>
  useSyncExternalStore(
    subscribe,
    () => getSnapshot().headlineOverride,
    () => null,
  );

export const useRestartTick = (): number =>
  useSyncExternalStore(
    subscribe,
    () => getSnapshot().restartTick,
    () => 0,
  );
