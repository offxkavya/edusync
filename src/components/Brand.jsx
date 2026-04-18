"use client";

import React from "react";
import { motion } from "framer-motion";

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
            icon: "text-slate-900",
        },
        light: {
            text: "text-white",
            icon: "text-white",
        }
    };

    const currentSize = sizes[size] || sizes.md;
    const currentTheme = themes[theme] || themes.dark;

    return (
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`flex items-center ${currentSize.gap} ${className} cursor-pointer group`}
        >
            {/* Minimal Geometric Mark */}
            <div className={`${currentSize.icon} flex items-center justify-center relative`}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-full h-full ${currentTheme.icon} transition-transform group-hover:rotate-12 duration-500`}
                >
                    <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" />
                    <rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor" fillOpacity="0.3" />
                    <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" fillOpacity="0.3" />
                    <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" />
                </svg>
                <div className="absolute -inset-1 bg-slate-900/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <span className={`${currentSize.text} font-black tracking-tight ${currentTheme.text} transition-colors font-heading`}>
                EduSync
            </span>
        </motion.div>
    );
}
