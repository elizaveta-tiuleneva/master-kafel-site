import { isSupabaseConfigured, photoUrl, supabase } from "../lib/supabase.js";
import { DEMO_PROJECTS } from "../data/projects.js";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Связь указана явно: у projects две связи с project_photos (фото и обложка).
const SELECT =
  "*, project_photos!project_photos_project_id_fkey(id, kind, storage_path, thumb_path, position)";

// Без настроек Supabase (режим разработки) сайт показывает демо-данные.
export const usingDemoData = !isSupabaseConfigured;

function lines(text) {
  return (text || "")
    .split("\n")
    // Маркеры списка «- », «• », «1. » убираются; «300×600 …» остаётся как есть.
    .map((line) => line.replace(/^\s*(?:[-•*]|\d+[.)])\s+/, "").trim())
    .filter(Boolean);
}

function copy(row, lang) {
  return {
    title: row[`title_${lang}`],
    district: row[`district_${lang}`],
    summary: row[`summary_${lang}`],
    task: row[`task_${lang}`],
    work: lines(row[`work_${lang}`]),
    result: row[`result_${lang}`],
  };
}

/** Строка базы → модель проекта (lib/projectModel.js). */
export function fromRow(row) {
  const photos = { before: [], after: [], gallery: [] };
  [...(row.project_photos || [])]
    .sort((a, b) => a.position - b.position)
    .forEach((photo) => {
      const src = photoUrl(photo.storage_path);
      photos[photo.kind]?.push({
        id: photo.id,
        src,
        thumb: photo.thumb_path ? photoUrl(photo.thumb_path) : src,
      });
    });

  return {
    id: row.id,
    category: row.category,
    status: row.status,
    isDemo: false,
    areaM2: row.area_m2,
    completedAt: row.completed_on,
    coverId: row.cover_photo_id,
    photos,
    ru: copy(row, "ru"),
    ko: copy(row, "ko"),
  };
}

export async function fetchPublishedProjects() {
  if (usingDemoData) return DEMO_PROJECTS;
  // Фильтр по статусу обязателен: вошедший администратор по RLS видит и черновики.
  const { data, error } = await supabase
    .from("projects")
    .select(SELECT)
    .eq("status", "published")
    .order("completed_on", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(fromRow);
}

/** Проект по id. Черновик вернётся только администратору (RLS). */
export async function fetchProject(id) {
  if (usingDemoData) return DEMO_PROJECTS.find((project) => project.id === id) || null;
  if (!UUID.test(id)) return null;
  const { data, error } = await supabase
    .from("projects")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data) : null;
}
