import { createClient } from "@supabase/supabase-js";

// Адрес и публичный ключ берутся из переменных окружения (.env.local или
// настройки хостинга), поэтому смена тестового проекта на рабочий не
// требует правок в коде. Секретных ключей в браузере нет.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(url && key);

export const supabase = isSupabaseConfigured ? createClient(url, key) : null;

export const PHOTO_BUCKET = "project-photos";
export const LEAD_FILES_BUCKET = "lead-files";

export function photoUrl(path) {
  if (!path || !supabase) return null;
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}
