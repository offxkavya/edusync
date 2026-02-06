"use client";

import React from "react";

/**
 * Brand component for Knowva.
 * Replaces the placeholder 'K' logo with a modern Sparkle symbol.
 */
export default function Brand({ size = "md", theme = "dark", className = "" }) {
    const sizes = {
        sm: { icon: "h-5 w-5", text: "text-lg", gap: "gap-1.5" },
        md: { icon: "h-6 w-6", text: "text-xl", gap: "gap-2" },
        lg: { icon: "h-8 w-8", text: "text-2xl", gap: "gap-3" },
    };

    const themes = {
        dark: {
            text: "text-primary",
            sparkle: "text-primary",
        },
        light: {
            text: "text-white",
            sparkle: "text-white",
        }
    };

    const currentSize = sizes[size] || sizes.md;
    const currentTheme = themes[theme] || themes.dark;

    return (
        <div className={`flex items-center ${currentSize.gap} ${className}`}>
            {/* Premium Sparkle/Energy Icon */}
            <div className={`${currentSize.icon} relative flex items-center justify-center`}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-full h-full ${currentTheme.sparkle}`}
                >
                    {/* Main Sparkle Body */}
                    <path
                        d="M12 3L14.05 9.15L20.2 11.2L14.05 13.25L12 19.4L9.95 13.25L3.8 11.2L9.95 9.15L12 3Z"
                        fill="currentColor"
                        className="animate-pulse"
                    />
                    {/* Secondary Glow/Spark - Now Cosmic Orange */}
                    <path
                        d="M17 6L17.5 7.5L19 8L17.5 8.5L17 10L16.5 8.5L15 8L16.5 7.5L17 6Z"
                        fill="#ff7a0f"
                        fillOpacity="0.8"
                    />
                    <path
                        d="M7 14L7.5 15.5L9 16L7.5 16.5L7 18L6.5 16.5L5 16L6.5 15.5L7 14Z"
                        fill="#ff7a0f"
                        fillOpacity="0.6"
                    />
                </svg>
            </div>

            <span className={`${currentSize.text} font-bold tracking-tight ${currentTheme.text} transition-colors`}>
                Knowva
            </span>
        </div>
    );
}
