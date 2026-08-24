import api from './api';

// ---------------------------------------------------------------------------
// Credentials / Certificates — frontend service layer (placeholder).
//
// The public portfolio renders a certificates carousel. Today there is no
// dedicated data model or public endpoint for certificates, so this service
// gracefully returns an empty list. When the backend exposes e.g.
// `GET /api/credentials`, it will start rendering automatically — no
// presentation-layer changes required.
// ---------------------------------------------------------------------------

export interface Credential {
  id: string;
  title: string;
  issuer: string;
  url?: string | null;
  issueDate?: string | null;
}

const endpoint = '/credentials';

export async function getCredentials(): Promise<Credential[]> {
  try {
    const { data } = await api.get(endpoint);
    return data.data as Credential[];
  } catch {
    // Endpoint not available yet — render nothing rather than fabricate data.
    return [];
  }
}