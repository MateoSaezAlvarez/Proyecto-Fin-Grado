const API_URL = 'http://localhost:8000/api';

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

export const api = {
  login: async (credentials: any) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  register: async (userData: any) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  getCampaigns: async () => {
    const response = await fetch(`${API_URL}/campaigns`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch campaigns');
    return response.json();
  },

  getCampaign: async (id: number) => {
    const response = await fetch(`${API_URL}/campaigns/${id}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch campaign');
    return response.json();
  },

  getCampaignCharacters: async (id: number) => {
    const response = await fetch(`${API_URL}/campaigns/${id}/characters`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch campaign characters');
    return response.json();
  },

  createCampaign: async (data: any) => {
    const response = await fetch(`${API_URL}/campaigns`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create campaign');
    return response.json();
  },

  getCharacter: async (id: number) => {
    const response = await fetch(`${API_URL}/characters/${id}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch character');
    return response.json();
  },

  getMyCharacters: async () => {
    const response = await fetch(`${API_URL}/my-characters`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch my characters');
    return response.json();
  },

  createCharacter: async (data: any) => {
    const response = await fetch(`${API_URL}/characters`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to create character');
    return result;
  },

  updateStat: async (characterId: number, statName: string, score: number) => {
    const response = await fetch(`${API_URL}/characters/${characterId}/stats`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ name: statName, score }),
    });
    if (!response.ok) throw new Error('Failed to update stat');
    return response.json();
  },

  joinCampaign: async (id: number) => {
    const response = await fetch(`${API_URL}/campaigns/${id}/join`, {
        method: 'POST',
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to join campaign');
    return response.json();
  },

  getMyCharacterInCampaign: async (campaignId: number) => {
      const response = await fetch(`${API_URL}/campaigns/${campaignId}/my-character`, {
          headers: getHeaders(),
      });
      if (!response.ok) return null; // Character might not exist yet
      return response.json();
  },

  submitRoll: async (data: any) => {
    const response = await fetch(`${API_URL}/rolls`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit roll');
    return response.json();
  },
};
