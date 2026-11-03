import { PHOTO_BUCKET, supabase } from "../lib/supabase.js";
import { extensionFor, prepareImage } from "../lib/imageResize.js";

// Связь указана явно: у projects две связи с project_photos (фото и обложка).
const SELECT =
  "*, project_photos!project_photos_project_id_fkey(id, kind, storage_path, thumb_path, position, width, height)";
export const TEXT_FIELDS = ["title", "district", "summary", "task", "work", "result"];

function sortPhotos(row) {
  return {
    ...row,
    project_photos: [...(row.project_photos || [])].sort((a, b) => a.position - b.position),
  };
}

export async function listProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select(SELECT)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data.map(sortPhotos);
}

export async function getProject(id) {
  const { data, error } = await supabase.from("projects").select(SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? sortPhotos(data) : null;
}

export async function createProject(fields) {
  const { data, error } = await supabase.from("projects").insert(fields).select("id").single();
  if (error) throw error;
  return data.id;
}

export async function updateProject(id, fields) {
  const { error } = await supabase.from("projects").update(fields).eq("id", id);
  if (error) throw error;
}

function photoPaths(photos) {
  return photos.flatMap((photo) => [photo.storage_path, photo.thumb_path]).filter(Boolean);
}

/** Сначала файлы, потом строка: если файлы не удалились, проект остаётся. */
export async function deleteProject(project) {
  const paths = photoPaths(project.project_photos || []);
  if (paths.length) {
    const { error } = await supabase.storage.from(PHOTO_BUCKET).remove(paths);
    if (error) throw error;
  }
  const { error } = await supabase.from("projects").delete().eq("id", project.id);
  if (error) throw error;
}

export async function uploadPhoto(projectId, kind, file, position) {
  const { full, thumb } = await prepareImage(file);
  const name = crypto.randomUUID();
  const fullPath = `projects/${projectId}/${name}.${extensionFor(full.blob)}`;
  const thumbPath = `projects/${projectId}/${name}-thumb.${extensionFor(thumb.blob)}`;
  const bucket = supabase.storage.from(PHOTO_BUCKET);

  const options = (blob) => ({ contentType: blob.type, cacheControl: "31536000", upsert: false });
  const first = await bucket.upload(fullPath, full.blob, options(full.blob));
  if (first.error) throw first.error;
  const second = await bucket.upload(thumbPath, thumb.blob, options(thumb.blob));
  if (second.error) {
    await bucket.remove([fullPath]);
    throw second.error;
  }

  const { error } = await supabase.from("project_photos").insert({
    project_id: projectId,
    kind,
    storage_path: fullPath,
    thumb_path: thumbPath,
    width: full.width,
    height: full.height,
    position,
  });
  if (error) {
    await bucket.remove([fullPath, thumbPath]);
    throw error;
  }
}

export async function deletePhoto(photo) {
  const { error: storageError } = await supabase.storage
    .from(PHOTO_BUCKET)
    .remove(photoPaths([photo]));
  if (storageError) throw storageError;
  const { error } = await supabase.from("project_photos").delete().eq("id", photo.id);
  if (error) throw error;
}

export async function swapPhotoPositions(a, b) {
  const results = await Promise.all([
    supabase.from("project_photos").update({ position: b.position }).eq("id", a.id),
    supabase.from("project_photos").update({ position: a.position }).eq("id", b.id),
  ]);
  const failed = results.find((result) => result.error);
  if (failed) throw failed.error;
}

export async function setCoverPhoto(projectId, photoId) {
  await updateProject(projectId, { cover_photo_id: photoId });
}
