export const formatNumber = (num: number) => {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(num);
};
