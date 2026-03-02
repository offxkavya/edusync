"use client";


const AUTH_STORAGE_KEY = "token";

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_STORAGE_KEY);
}

export function saveAuthToken(token) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, token);
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function decodeToken(token) {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function getUserRole() {
  const token = getAuthToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded?.role || null;
}

export function getDashboardPath(role) {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "FACULTY":
      return "/faculty/dashboard";
    case "STUDENT":
      return "/student/dashboard";
    default:
      return "/dashboard";
  }
}

