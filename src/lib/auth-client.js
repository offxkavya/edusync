"use client";

import jwt from "jsonwebtoken";

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
    // Decode without verification for client-side role checking
    const decoded = jwt.decode(token);
    return decoded;
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

