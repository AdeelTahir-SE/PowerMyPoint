/**
 * Lucide icon SVG paths and utilities
 * Maps common icon names to their SVG paths for inline rendering
 */

export interface IconData {
    viewBox: string;
    path: string;
    strokeWidth?: number;
}

// Common Lucide icons used in presentations
export const iconMap: Record<string, IconData> = {
    // Technology & Science
    'Brain': { viewBox: '0 0 24 24', path: 'M12 5a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V8a3 3 0 0 0-3-3Z', strokeWidth: 2 },
    'Target': { viewBox: '0 0 24 24', path: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', strokeWidth: 2 },
    'Users': { viewBox: '0 0 24 24', path: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', strokeWidth: 2 },
    'Moon': { viewBox: '0 0 24 24', path: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z', strokeWidth: 2 },
    'Rocket': { viewBox: '0 0 24 24', path: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z', strokeWidth: 2 },
    'Satellite': { viewBox: '0 0 24 24', path: 'M13 17a4 4 0 0 1 0-8M6 21a4 4 0 0 1 0-8M2 5h20M6 13a6 6 0 0 0 12 0', strokeWidth: 2 },
    'Search': { viewBox: '0 0 24 24', path: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35', strokeWidth: 2 },
    'Eye': { viewBox: '0 0 24 24', path: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', strokeWidth: 2 },
    'Building': { viewBox: '0 0 24 24', path: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z', strokeWidth: 2 },
    'Syringe': { viewBox: '0 0 24 24', path: 'M18 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4Z', strokeWidth: 2 },
    'Zap': { viewBox: '0 0 24 24', path: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.01A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.01A1 1 0 0 0 11 14z', strokeWidth: 2 },
    'AlertTriangle': { viewBox: '0 0 24 24', path: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z', strokeWidth: 2 },
    'Check': { viewBox: '0 0 24 24', path: 'M20 6 9 17l-5-5', strokeWidth: 2 },
    'Globe': { viewBox: '0 0 24 24', path: 'M21.54 15A17 17 0 0 0 12 8a17 17 0 0 0-9.54 7', strokeWidth: 2 },
    'Lightbulb': { viewBox: '0 0 24 24', path: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5', strokeWidth: 2 },
    'TrendingUp': { viewBox: '0 0 24 24', path: 'm22 7-8.5-5L6 7l8.5 5L22 7z', strokeWidth: 2 },
    'Shield': { viewBox: '0 0 24 24', path: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', strokeWidth: 2 },
    'Heart': { viewBox: '0 0 24 24', path: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z', strokeWidth: 2 },
    'Star': { viewBox: '0 0 24 24', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', strokeWidth: 2 },
    'Book': { viewBox: '0 0 24 24', path: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20', strokeWidth: 2 },
    'GraduationCap': { viewBox: '0 0 24 24', path: 'M22 10v6M2 10l10-5 10 5-10 5z', strokeWidth: 2 },
    'Flask': { viewBox: '0 0 24 24', path: 'M14.5 2v6h3M6.5 8h11M10.5 2v6M4.5 8h15a2 2 0 0 1 0 4h-15', strokeWidth: 2 },
    'Microscope': { viewBox: '0 0 24 24', path: 'M6 18h8M4 12h12M2 6h16', strokeWidth: 2 },
    'Atom': { viewBox: '0 0 24 24', path: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', strokeWidth: 2 },
};

/**
 * Generate SVG HTML for a Lucide icon
 */
export function getIconSvg(iconName: string, className: string = '', size: number = 24): string {
    const icon = iconMap[iconName];
    if (!icon) {
        console.warn(`Icon "${iconName}" not found in iconMap`);
        return '';
    }

    const strokeWidth = icon.strokeWidth || 2;
    const classes = className ? `class="${className}"` : '';
    
    return `<svg ${classes} width="${size}" height="${size}" viewBox="${icon.viewBox}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
    <path d="${icon.path}" />
</svg>`;
}

/**
 * Get available icon names (for AI prompt reference)
 */
export function getAvailableIcons(): string[] {
    return Object.keys(iconMap);
}

