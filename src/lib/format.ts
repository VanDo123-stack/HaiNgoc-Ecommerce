// 1. Currency formatter

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});



/**
 * Format a number as Vietnamese Dong (VND) currency string.
 * Returns "Lien he" if amount is null or undefined.
 *
 * @example formatVND(245000) => "245.000 ₫"
 * @example formatVND(null) => "Lien he"
 */
export function formatVND(amount: number | null | undefined): string {
  if (amount == null) return "Lien he";
  return vndFormatter.format(amount);
}
