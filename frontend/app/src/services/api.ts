const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080/api';

export const getAuthToken = () => sessionStorage.getItem('token');
export const setAuthToken = (token: string) => sessionStorage.setItem('token', token);
export const removeAuthToken = () => sessionStorage.removeItem('token');

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

/** Safely parse JSON — if the server returns HTML (error page), throw a readable error */
const safeJson = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(`Server returned non-JSON response (${response.status}): ${text.slice(0, 120)}`);
  }
  return response.json();
};

export const api = {
  login: async (credentials: any) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return safeJson(response);
  },

  register: async (userData: any) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Registration failed');
    return safeJson(response);
  },

  getCampaigns: async () => {
    const response = await fetch(`${API_URL}/campaigns`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch campaigns');
    return safeJson(response);
  },

  getCampaign: async (id: number) => {
    const response = await fetch(`${API_URL}/campaigns/${id}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch campaign');
    return safeJson(response);
  },

  getCampaignCharacters: async (id: number) => {
    const response = await fetch(`${API_URL}/campaigns/${id}/characters`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch campaign characters');
    return safeJson(response);
  },

  createCampaign: async (data: any) => {
    const response = await fetch(`${API_URL}/campaigns`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await safeJson(response);
    if (!response.ok) throw new Error(result.error || 'Failed to create campaign');
    return result;
  },

  getCharacter: async (id: number) => {
    const response = await fetch(`${API_URL}/characters/${id}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch character');
    return safeJson(response);
  },

  getMyCharacters: async () => {
    const response = await fetch(`${API_URL}/my-characters`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch my characters');
    return safeJson(response);
  },

  createCharacter: async (data: any) => {
    const response = await fetch(`${API_URL}/characters`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await safeJson(response);
    if (!response.ok) throw new Error(result.error || 'Failed to create character');
    return result;
  },

  updateStat: async (characterId: number, statName: string, score?: number, saveProficient?: boolean) => {
    const response = await fetch(`${API_URL}/characters/${characterId}/stats`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ name: statName, score, saveProficient }),
    });
    if (!response.ok) throw new Error('Failed to update stat');
    return safeJson(response);
  },

  updateAbility: async (abilityId: number, isProficient: boolean) => {
    const response = await fetch(`${API_URL}/abilities/${abilityId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ isProficient }),
    });
    if (!response.ok) throw new Error('Failed to update ability');
    return safeJson(response);
  },

  updateCharacter: async (id: number, data: any) => {
    const response = await fetch(`${API_URL}/characters/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update character');
    return safeJson(response);
  },

  joinCampaign: async (id: number) => {
    const response = await fetch(`${API_URL}/campaigns/${id}/join`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to join campaign');
    return safeJson(response);
  },

  getMyCharacterInCampaign: async (campaignId: number) => {
    const response = await fetch(`${API_URL}/campaigns/${campaignId}/my-character`, {
      headers: getHeaders(),
    });
    if (!response.ok) return null;
    return safeJson(response);
  },

  submitRoll: async (data: any) => {
    const response = await fetch(`${API_URL}/rolls`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit roll');
    return safeJson(response);
  },

  getCampaignRolls: async (campaignId: number) => {
    const response = await fetch(`${API_URL}/campaigns/${campaignId}/rolls`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch campaign rolls');
    return safeJson(response);
  },

  createAttack: async (characterId: number, data: any) => {
    const response = await fetch(`${API_URL}/characters/${characterId}/attacks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await safeJson(response);
    if (!response.ok) throw new Error(result.error || 'Failed to create attack');
    return result;
  },

  updateAttack: async (attackId: number, data: any) => {
    const response = await fetch(`${API_URL}/attacks/${attackId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update attack');
    return safeJson(response);
  },

  deleteAttack: async (attackId: number) => {
    const response = await fetch(`${API_URL}/attacks/${attackId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete attack');
    return safeJson(response);
  },
};
