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

    const contentType = response.headers.get('content-type') || '';
    const rawBody = await response.text();
    let data: any = null;

    if (rawBody) {
      try {
        data = JSON.parse(rawBody);
      } catch {
        if (!response.ok) {
          throw new Error(
            `API Error ${response.status} at ${url}. Non-JSON response: ${rawBody.slice(0, 160)}`
          );
        }

        throw new Error(
          `Invalid JSON response from ${url}. Content-Type: ${contentType || 'unknown'}`
        );
      }
    }

    if (!response.ok) {
      throw new Error(data?.error || data?.message || `API Error: ${response.status}`);
    }

    return (data as T);
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
  rejection_reason?: string;
  pickup_scheduled_at?: string;
  status_updated_at?: string;
  // From JOIN with user table
  user_name?: string;
  user_email?: string;
  // From JOIN with ai_classification table
  waste_type?: string;
  severity_level?: string;
  confidence_score?: number;
  // From JOIN with cleanup_tasks table
  assigned_to?: number;
  driver_user_id?: number;
  driver_name?: string;
  driver_phone?: string;
  driver_area?: string;
  completion_status?: string;
  completed_at?: string;
  completion_image_url?: string;
  completion_latitude?: number;
  completion_longitude?: number;
  completion_location?: string;
  completion_verified?: number;
  pickup_report_status?: string;
  pickup_report_action_at?: string;
  pickup_report_action_by?: number;
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

    const rawBody = await response.text();
    let data: any = null;
    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      throw new Error(`Invalid JSON response from ${API_BASE_URL}/reports`);
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Failed to create report');
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
    options?: {
      rejection_reason?: string;
      pickup_scheduled_at?: string;
      driver_id?: number;
    }
  ): Promise<{ message: string; report: Report }> => {
    return fetchAPI(`/reports/${reportId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        rejection_reason: options?.rejection_reason,
        pickup_scheduled_at: options?.pickup_scheduled_at,
        driver_id: options?.driver_id,
      }),
    });
  },

  // Delete report (admin only)
  delete: async (reportId: number): Promise<{ message: string }> => {
    return fetchAPI(`/reports/${reportId}`, {
      method: 'DELETE',
    });
  },

  pickupReportAction: async (
    reportId: number,
    action: 'confirm' | 'reject'
  ): Promise<{ message: string }> => {
    return fetchAPI(`/reports/${reportId}/pickup-report`, {
      method: 'POST',
      body: JSON.stringify({ action }),
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

// ==================== Drivers APIs ====================

export interface DriverProfile {
  user_id: number;
  name: string;
  email?: string;
  phone: string;
  area: string;
  role: string;
  created_at?: string;
  status?: number;
}

export interface DriverAssignment {
  task_id: number;
  report_id: number;
  assigned_at?: string;
  due_date?: string;
  completion_status?: string;
  completed_at?: string;
  completion_image_url?: string;
  completion_latitude?: number;
  completion_longitude?: number;
  completion_location?: string;
  completion_verified?: number;
  pickup_report_status?: string;
  pickup_report_action_at?: string;
  pickup_report_action_by?: number;
  image_url?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  submitted_at?: string;
  waste_type?: string;
  severity_level?: string;
}

export interface DriverRouteStop {
  task_id: number;
  report_id: number;
  lat: number;
  lng: number;
  location?: string | null;
  order: number;
}

export interface DriverRoute {
  route_id: number;
  driver_user_id: number;
  route_type: 'single' | 'multi' | string;
  task_ids: number[];
  origin_lat: number;
  origin_lng: number;
  destination_lat: number;
  destination_lng: number;
  ordered_stops: DriverRouteStop[];
  geometry: { type?: string; coordinates: [number, number][] } | null;
  distance_meters: number;
  duration_seconds: number;
  status: 'planned' | 'started' | 'completed' | 'cancelled' | string;
  started_at?: string | null;
  completed_at?: string | null;
  created_at?: string;
  driver_name?: string;
  driver_phone?: string;
  driver_area?: string;
}

export const driversAPI = {
  register: async (payload: {
    name: string;
    email?: string;
    phone: string;
    area: string;
    password: string;
  }): Promise<{ message: string; driver_id: number }> => {
    return fetchAPI('/drivers/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login: async (payload: { phone: string; password: string }): Promise<AuthResponse> => {
    const data = await fetchAPI<AuthResponse>('/drivers/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  },

  getAll: async (): Promise<DriverProfile[]> => {
    const data = await fetchAPI<{ drivers: DriverProfile[] }>('/drivers');
    return data.drivers || [];
  },

  getAssignments: async (): Promise<DriverAssignment[]> => {
    const data = await fetchAPI<{ assignments: DriverAssignment[] }>('/drivers/assignments');
    return data.assignments || [];
  },

  completeAssignment: async (
    taskId: number,
    payload: { latitude: string; longitude: string; location?: string },
    image: File
  ): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append('latitude', payload.latitude);
    formData.append('longitude', payload.longitude);
    if (payload.location) {
      formData.append('location', payload.location);
    }
    formData.append('image', image);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/drivers/assignments/${taskId}/complete`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const rawBody = await response.text();
    let data: any = null;
    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      throw new Error(`Invalid JSON response from ${API_BASE_URL}/drivers/assignments/${taskId}/complete`);
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Failed to complete assignment');
    }

    return data;
  },

  planSingleRoute: async (payload: {
    task_id: number;
    origin_lat: number;
    origin_lng: number;
  }): Promise<DriverRoute> => {
    const data = await fetchAPI<{ route: DriverRoute }>('/drivers/routes/single', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data.route;
  },

  planMultiRoute: async (payload: {
    origin_lat: number;
    origin_lng: number;
    task_ids?: number[];
  }): Promise<DriverRoute> => {
    const data = await fetchAPI<{ route: DriverRoute }>('/drivers/routes/multi', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data.route;
  },

  startRoute: async (routeId: number): Promise<DriverRoute> => {
    const data = await fetchAPI<{ route: DriverRoute }>(`/drivers/routes/${routeId}/start`, {
      method: 'POST',
    });
    return data.route;
  },

  completeRoute: async (routeId: number): Promise<DriverRoute> => {
    const data = await fetchAPI<{ route: DriverRoute }>(`/drivers/routes/${routeId}/complete`, {
      method: 'POST',
    });
    return data.route;
  },

  getMyRoutes: async (): Promise<DriverRoute[]> => {
    const data = await fetchAPI<{ routes: DriverRoute[] }>('/drivers/routes/mine');
    return data.routes || [];
  },

  getAllRoutes: async (): Promise<DriverRoute[]> => {
    const data = await fetchAPI<{ routes: DriverRoute[] }>('/drivers/routes');
    return data.routes || [];
  },
};

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
  drivers: driversAPI,
  health: healthAPI,
};

export default api;
