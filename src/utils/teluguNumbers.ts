const TELUGU_DIGITS = ['౦', '౧', '౨', '౩', '౪', '౫', '౬', '౭', '౮', '౯'];

export function toTeluguNumber(num: number | string): string {
  const str = num.toString();
  return str
    .split('')
    .map((char) => {
      const n = parseInt(char, 10);
      return isNaN(n) ? char : TELUGU_DIGITS[n];
    })
    .join('');
}

export function formatDayDisplay(num: number, useTelugu: boolean): string {
  return useTelugu ? toTeluguNumber(num) : num.toString();
}
