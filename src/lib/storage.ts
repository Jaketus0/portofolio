import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const BUCKET = 'portfolio';

export async function uploadToStorage(
  file: { arrayBuffer: () => Promise<ArrayBuffer>; name: string; type: string },
  folder: string
): Promise<string | null> {
  if (!supabase) {
    console.warn('[Storage] Supabase not configured — falling back to no-op');
    return null;
  }

  const buffer = await file.arrayBuffer();
  const ext = file.name.split('.').pop() || '';
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const path = `${folder}/${filename}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    console.error('[Storage] Upload failed:', error.message);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function createUploadUrl(path: string): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(path, { upsert: false });
  if (error) {
    console.error('[Storage] Signed upload failed:', error.message);
    return null;
  }
  return data.signedUrl;
}

export function getPublicUrl(path: string): string | null {
  if (!supabase) return null;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
