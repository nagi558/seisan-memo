// 自分の負担額を四捨五入し、相手の負担額は総額との差分で求める。
// これにより selfShare + partnerShare は必ず amount と一致する。
export function splitExpense(amount: number, selfSharePercent: number) {
  const selfShare = Math.round((amount * selfSharePercent) / 100);
  const partnerShare = amount - selfShare;

  return { selfShare, partnerShare };
}
