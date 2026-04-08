export function useHaptics() {
  const tap = () => navigator.vibrate?.(10);
  const success = () => navigator.vibrate?.([10, 50, 20]);
  const error = () => navigator.vibrate?.([30, 30, 30]);
  const snap = () => navigator.vibrate?.(5);
  return { tap, success, error, snap };
}
