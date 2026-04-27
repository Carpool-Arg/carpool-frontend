export function getMonthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return {
    fromDate: start.toISOString().split("T")[0],
    toDate: end.toISOString().split("T")[0],
  };
}

export function getPreviousMonthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const end = new Date(date.getFullYear(), date.getMonth(), 0);

  return {
    fromDate: start.toISOString().split("T")[0],
    toDate: end.toISOString().split("T")[0],
  };
}

export function getStatusDelta (delta: number) {
  if (delta > 0) return 'increase'
  if (delta < 0) return 'decrease'
  return 'default'
}

export function formatPercentageDelta (
  delta: number,
  previousValue: number
): number {
  if (!previousValue) return 0

  const value = (delta * 100) / previousValue

  return Number.isInteger(value)
    ? value
    : Number(value.toFixed(2))
}

export function formatFixedDouble ( value : number) {
  return Number.isInteger(value)
    ? value
    : Number(value.toFixed(2))
}