import { ref, computed } from 'vue';
import { useToast } from './toast.js';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

const API_BASE = 'http://localhost:3000/api';

const token = ref<string | null>(localStorage.getItem('auth_token'));
const user = ref<UserProfile | null>(null);
const isLoading = ref(false);
const authError = ref<string | null>(null);

const isAuthenticated = computed(() => !!token.value);
const { showSuccess, showError } = useToast();

// Helper to set auth header
function getAuthHeaders() {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token.value) {
    headers['Authorization'] = `Bearer ${token.value}`;
  }
  return headers;
}

// Initialize and restore session
async function initSession() {
  if (!token.value) return;
  
  isLoading.value = true;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (res.ok) {
      const data = await res.json();
      user.value = data.user;
    } else {
      // Token is invalid/expired
      logout();
    }
  } catch (err) {
    console.error('Failed to restore auth session:', err);
  } finally {
    isLoading.value = false;
  }
}

// Log in user
async function login(emailOrUsername: string, password: string): Promise<boolean> {
  isLoading.value = true;
  authError.value = null;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsername, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Login failed.');
    }

    token.value = data.token;
    user.value = data.user;
    localStorage.setItem('auth_token', data.token);
    
    // Success Toast from backend message
    showSuccess(data.message || 'Login successful.');
    return true;
  } catch (err: any) {
    const errMsg = err.message || 'An error occurred during login.';
    authError.value = errMsg;
    // Error Toast from backend message
    showError(errMsg);
    return false;
  } finally {
    isLoading.value = false;
  }
}

// Register new user
async function register(username: string, email: string, password: string): Promise<boolean> {
  isLoading.value = true;
  authError.value = null;

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Registration failed.');
    }

    token.value = data.token;
    user.value = data.user;
    localStorage.setItem('auth_token', data.token);
    
    // Success Toast from backend message
    showSuccess(data.message || 'Registration successful.');
    return true;
  } catch (err: any) {
    const errMsg = err.message || 'An error occurred during registration.';
    authError.value = errMsg;
    // Error Toast from backend message
    showError(errMsg);
    return false;
  } finally {
    isLoading.value = false;
  }
}

// Log out user
function logout() {
  token.value = null;
  user.value = null;
  localStorage.removeItem('auth_token');
  showSuccess('Disconnected from commander deck.');
}

export function useAuth() {
  return {
    token,
    user,
    isLoading,
    authError,
    isAuthenticated,
    initSession,
    login,
    register,
    logout,
    getAuthHeaders,
  };
}
