import {
  User,
  WorkerProfile,
  ServiceCategory,
  JobRequest,
  BidOffer,
  ChatMessage,
  SosAlert,
  ReviewRecord,
} from '../types/index.ts';

const API_BASE = '/api/v1';

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    let errorMsg = `HTTP Error ${res.status}`;
    try {
      const errBody = await res.json();
      if (errBody.error) errorMsg = errBody.error;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Auth
  getMe: () => fetchJson<{ user: User }>(`${API_BASE}/auth/me`),
  setRole: (role: 'customer' | 'worker_pro') =>
    fetchJson<{ success: boolean; user: User }>(`${API_BASE}/auth/role`, {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),

  // Categories
  getCategories: () =>
    fetchJson<{ categories: ServiceCategory[]; total: number; activeSpecialistsCount: number }>(
      `${API_BASE}/services/categories`
    ),

  // Workers
  getNearbyWorkers: (lat = 44.0462, lng = -123.022, radius = 3.2, category = 'all') =>
    fetchJson<{ count: number; workers: WorkerProfile[] }>(
      `${API_BASE}/workers/nearby?lat=${lat}&lng=${lng}&radius=${radius}&category=${category}`
    ),
  getWorker: (id: string) => fetchJson<{ worker: WorkerProfile }>(`${API_BASE}/workers/${id}`),

  // Jobs
  getJobs: () => fetchJson<{ jobs: JobRequest[] }>(`${API_BASE}/jobs`),
  getJob: (id: string) => fetchJson<{ job: JobRequest }>(`${API_BASE}/jobs/${id}`),
  createJob: (payload: Partial<JobRequest>) =>
    fetchJson<{ job: JobRequest }>(`${API_BASE}/jobs`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Bids & Negotiation
  getBids: (jobId: string) => fetchJson<{ bids: BidOffer[] }>(`${API_BASE}/jobs/${jobId}/bids`),
  submitBid: (
    jobId: string,
    payload: { proposedAmount: number; proposingParty: 'WORKER' | 'CUSTOMER'; scopeNotes?: string; workerId?: string }
  ) =>
    fetchJson<{ bid: BidOffer }>(`${API_BASE}/jobs/${jobId}/bids`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  acceptBid: (jobId: string, bidId: string) =>
    fetchJson<{ success: boolean; message: string; job: JobRequest; bid: BidOffer }>(
      `${API_BASE}/jobs/${jobId}/bids/${bidId}/accept`,
      { method: 'POST' }
    ),

  // Phases
  updateJobPhase: (jobId: string, phase: number, status?: string) =>
    fetchJson<{ success: boolean; job: JobRequest }>(`${API_BASE}/jobs/${jobId}/phase`, {
      method: 'POST',
      body: JSON.stringify({ phase, status }),
    }),

  // Chat
  getMessages: (jobId: string) => fetchJson<{ messages: ChatMessage[] }>(`${API_BASE}/jobs/${jobId}/messages`),
  sendMessage: (jobId: string, payload: { senderRole: 'customer' | 'worker_pro'; content: string }) =>
    fetchJson<{ message: ChatMessage }>(`${API_BASE}/jobs/${jobId}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // SOS
  triggerSos: (jobId?: string, hazardType = 'fire') =>
    fetchJson<{ success: boolean; message: string; alert: SosAlert }>(`${API_BASE}/jobs/${jobId || 'emergency'}/sos`, {
      method: 'POST',
      body: JSON.stringify({ hazardType }),
    }),
  getSosStatus: (jobId: string) => fetchJson<{ alert: SosAlert | null }>(`${API_BASE}/jobs/${jobId}/sos/status`),

  // Ratings
  submitRating: (jobId: string, payload: { rating: number; comment: string; reviewerRole: string }) =>
    fetchJson<{ success: boolean; review: ReviewRecord }>(`${API_BASE}/jobs/${jobId}/ratings`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // MCP Endpoints
  getMcpResources: () => fetchJson<{ resources: any[] }>('/api/mcp/resources'),
  getMcpResource: (uri: string) => fetchJson<{ uri: string; data: any }>(`/api/mcp/resource?uri=${encodeURIComponent(uri)}`),
  getMcpTools: () => fetchJson<{ tools: any[] }>('/api/mcp/tools'),
  invokeMcpTool: (tool: string, args: Record<string, any>) =>
    fetchJson<{ tool: string; success: boolean; data?: any; error?: string }>('/api/mcp/invoke', {
      method: 'POST',
      body: JSON.stringify({ tool, arguments: args }),
    }),

  // Real-time Event Stream
  subscribeEvents: (onEvent: (event: { type: string; data: any }) => void) => {
    const eventSource = new EventSource(`${API_BASE}/events`);
    eventSource.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        onEvent(parsed);
      } catch (err) {
        console.error('Failed to parse SSE event:', err);
      }
    };
    return () => {
      eventSource.close();
    };
  },
};
