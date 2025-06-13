const baseCurday = 1247;
const baseDate = new Date('2025-06-02');

export function getCurdayForToday(date: Date) {
  const diffTime = date.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return baseCurday + diffDays;
}