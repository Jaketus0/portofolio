import api from './api';

export async function uploadFile(file: File) {
  let signed: { path: string; signedUrl: string } | null = null;
  try {
    const { data } = await api.post('/media/upload-url', {
      name: file.name,
      type: file.type,
      size: file.size,
    });
    signed = data.data;
  } catch {
    signed = null;
  }

  if (signed?.signedUrl) {
    const res = await fetch(signed.signedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'content-type': file.type, 'x-upsert': 'false' },
    });
    if (!res.ok) throw new Error('Storage upload failed');

    const { data: rec } = await api.post('/media/record', {
      name: file.name,
      type: file.type,
      size: file.size,
      path: signed.path,
    });
    return rec.data as { url: string; id: string };
  }

  const fd = new FormData();
  fd.append('file', file);
  const { data: legacy } = await api.post('/media/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return legacy.data as { url: string; id: string };
}
