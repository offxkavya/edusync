"use client";

import React from "react";

/**
 * Brand component for Knowva.
 * Clean, professional text logo with a minimal geometric mark.
 */
export default function Brand({ size = "md", theme = "dark", className = "" }) {
    const sizes = {
        sm: { icon: "h-5 w-5", text: "text-lg", gap: "gap-1.5" },
        md: { icon: "h-6 w-6", text: "text-xl", gap: "gap-2" },
        lg: { icon: "h-8 w-8", text: "text-2xl", gap: "gap-3" },
    };

    const themes = {
        dark: {
            text: "text-slate-900",
            icon: "text-blue-600",
        },
        light: {
            text: "text-white",
            icon: "text-blue-400",
        }
    };

    const currentSize = sizes[size] || sizes.md;
    const currentTheme = themes[theme] || themes.dark;

    return (
        <div className={`flex items-center ${currentSize.gap} ${className}`}>
            {/* Minimal Geometric Mark */}
            <div className={`${currentSize.icon} flex items-center justify-center`}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-full h-full ${currentTheme.icon}`}
                >
                    <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" fillOpacity="0.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" fillOpacity="0.5" />
                    <path fill="currentColor" d="M14 14C14 13.4477 14.4477 13 15 13H20C20.5523 13 21 13.4477 21 14V19C21 19.5523 20.5523 20 20 20H15C14.4477 20 14 19.5523 14 19V14Z" />
                </svg>
            </div>

            <span className={`${currentSize.text} font-bold tracking-tight ${currentTheme.text} transition-colors`}>
                Knowva
            </span>
        </div>
    );
}
