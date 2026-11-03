export class LeadSubmitError extends Error {
  constructor(code, message) {
    super(message || code);
    this.code = code;
  }
}

/**
 * Отправка заявки. Серверная часть (Supabase + Telegram) подключается
 * на этапе 5; до этого функция всегда сообщает, что отправка недоступна,
 * чтобы форма не показывала ложное подтверждение.
 */
// eslint-disable-next-line no-unused-vars
export async function submitLead(lead, files) {
  throw new LeadSubmitError("not_configured");
}
