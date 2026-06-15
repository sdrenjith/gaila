/** Normalize stored phone values to an E.164-style tel: href (digits with leading +). */
export function phoneTelHref(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const digits = trimmed.replace(/[^\d+]/g, "");
  if (!digits) return "";
  return digits.startsWith("+") ? digits : `+${digits}`;
}

/** Readable UAE display for +971 mobile numbers; falls back to the raw string. */
export function formatPhoneDisplay(raw: string): string {
  const tel = phoneTelHref(raw);
  const digits = tel.replace(/\D/g, "");
  if (digits.startsWith("971") && digits.length >= 11) {
    const local = digits.slice(3);
    if (local.length === 9) {
      return `+971 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
    }
  }
  return raw.trim() || tel;
}
