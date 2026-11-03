import { LEAD_FILES_BUCKET, supabase } from "../lib/supabase.js";

const SIGNED_URL_SECONDS = 600;

export async function listLeads(status) {
  let query = supabase
    .from("leads")
    .select("id, created_at, name, phone, district, room_type, status, notified_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status && status !== "all") query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/** Заявка с фото. Ссылки на фото временные — закрытое хранилище. */
export async function getLead(id) {
  const { data, error } = await supabase
    .from("leads")
    .select("*, lead_files(id, storage_path, mime_type, size_bytes)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const files = data.lead_files || [];
  if (files.length) {
    const { data: signed, error: signError } = await supabase.storage
      .from(LEAD_FILES_BUCKET)
      .createSignedUrls(files.map((file) => file.storage_path), SIGNED_URL_SECONDS);
    if (signError) throw signError;
    files.forEach((file, index) => {
      file.url = signed[index]?.signedUrl || null;
    });
  }
  return { ...data, lead_files: files };
}

export async function updateLead(id, fields) {
  const { error } = await supabase.from("leads").update(fields).eq("id", id);
  if (error) throw error;
}

export async function deleteLead(lead) {
  const paths = (lead.lead_files || []).map((file) => file.storage_path);
  if (paths.length) {
    const { error } = await supabase.storage.from(LEAD_FILES_BUCKET).remove(paths);
    if (error) throw error;
  }
  const { error } = await supabase.from("leads").delete().eq("id", lead.id);
  if (error) throw error;
}
