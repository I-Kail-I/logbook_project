export function createRefreshHandler(
  setRefreshing: (value: boolean) => void,
  onComplete: () => Promise<void> | void,
  delayMs = 900,
) {
  return () => {
    setRefreshing(true);
    setTimeout(async () => {
      setRefreshing(false);
      await onComplete();
    }, delayMs);
  };
}
