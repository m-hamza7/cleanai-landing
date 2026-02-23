// API Client for CleanAI Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

// Helper to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ==================== Authentication APIs ====================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: 'citizen' | 'admin';
}

export interface User {
  user_id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  created_at: string;
  status: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export const authAPI = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const data = await fetchAPI<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const data = await fetchAPI<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Get current user info
  getCurrentUser: async (): Promise<User> => {
    return fetchAPI<User>('/auth/me');
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },

  // Get stored user data
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// ==================== Reports APIs ====================

export interface Report {
  report_id: number;
  user_id: number;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  gps_accuracy?: number;
  submitted_at?: string;
  status: string;
  // From JOIN with user table
  user_name?: string;
  user_email?: string;
  // From JOIN with ai_classification table
  waste_type?: string;
  severity_level?: string;
  confidence_score?: number;
  // From JOIN with cleanup_tasks table
  assigned_to?: number;
  completion_status?: string;
  completed_at?: string;
  // Legacy / fallback fields
  location?: string;
  description?: string;
  priority?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateReportData {
  waste_type: string;
  location: string;
  latitude?: string;
  longitude?: string;
  description?: string;
  priority?: string;
}

export const reportsAPI = {
  // Create new report (with image upload)
  create: async (reportData: CreateReportData, image?: File): Promise<Report> => {
    const formData = new FormData();
    
    // Append all report fields
    Object.entries(reportData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    // Append image if provided
    if (image) {
      formData.append('image', image);
    }

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create report');
    }

    return data.report;
  },
  // Get all reports (filtered by role)
  getAll: async (): Promise<Report[]> => {
    const data = await fetchAPI<{ reports: Report[]; count: number }>('/reports');
    return data.reports || [];
  },

  // Get single report by ID
  getById: async (reportId: number): Promise<Report> => {
    return fetchAPI<Report>(`/reports/${reportId}`);
  },

  // Update report status (admin only)
  updateStatus: async (
    reportId: number,
    status: string,
    priority?: string
  ): Promise<{ message: string; report: Report }> => {
    return fetchAPI(`/reports/${reportId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, priority }),
    });
  },

  // Delete report (admin only)
  delete: async (reportId: number): Promise<{ message: string }> => {
    return fetchAPI(`/reports/${reportId}`, {
      method: 'DELETE',
    });
  },
};

// ==================== Users APIs ====================

export interface UserStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  recentActivity: any[];
}

export const usersAPI = {
  // Get all users (admin only)
  getAll: async (): Promise<User[]> => {
    return fetchAPI<User[]>('/users');
  },

  // Get user statistics
  getStats: async (userId: number): Promise<UserStats> => {
    return fetchAPI<UserStats>(`/users/${userId}/stats`);
  },
};

// ==================== Alerts APIs ====================

export interface Alert {
  alert_id: number;
  user_id: number;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  created_at: string;
}

export const alertsAPI = {
  // Get user alerts
  getAll: async (): Promise<Alert[]> => {
    return fetchAPI<Alert[]>('/alerts');
  },

  // Create new alert
  create: async (
    userId: number,
    message: string,
    type: string
  ): Promise<Alert> => {
    return fetchAPI<Alert>('/alerts', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, message, type }),
    });
  },
};

// ==================== Health Check ====================

export const healthAPI = {
  check: async (): Promise<{ status: string; message: string }> => {
    return fetchAPI('/health');
  },
};

// Export all APIs
export const api = {
  auth: authAPI,
  reports: reportsAPI,
  users: usersAPI,
  alerts: alertsAPI,
  health: healthAPI,
};

export default api;
