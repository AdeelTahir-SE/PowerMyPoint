'use client';

import { useState, useRef } from 'react';

interface ImageWithFallbackProps {
    src: string;
    alt?: string;
    className?: string;
    context?: string;
    slideTitle?: string;
    keyPoints?: string[];
    [key: string]: any; // Allow other img attributes
}

/**
 * Image component with automatic fallback to Pexels/Imagen when image fails to load
 */
export default function ImageWithFallback({
    src,
    alt,
    className,
    context,
    slideTitle,
    keyPoints,
    ...props
}: ImageWithFallbackProps) {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const retryCountRef = useRef(0);
    const maxRetries = 1; // Only retry once to avoid infinite loops

    const handleError = async () => {
        if (retryCountRef.current >= maxRetries) {
            console.warn(`[ImageWithFallback] Max retries reached for ${src}`);
            setHasError(true);
            return;
        }

        retryCountRef.current++;
        setIsLoading(true);

        try {
            console.log(`[ImageWithFallback] Image failed to load, requesting fallback: ${src.substring(0, 50)}...`);
            
            const response = await fetch('/api/image-fallback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: src,
                    context,
                    slideTitle,
                    keyPoints,
                }),
            });

            const data = await response.json();

            if (data.success && data.url) {
                console.log(`[ImageWithFallback] Fallback URL received: ${data.url.substring(0, 50)}...`);
                setImageSrc(data.url);
                setIsLoading(false);
            } else {
                console.warn(`[ImageWithFallback] Fallback failed: ${data.error || 'Unknown error'}`);
                setHasError(true);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(`[ImageWithFallback] Error requesting fallback:`, error);
            setHasError(true);
            setIsLoading(false);
        }
    };

    // Reset state when src prop changes
    if (src !== imageSrc && !hasError && retryCountRef.current === 0) {
        setImageSrc(src);
        setHasError(false);
        retryCountRef.current = 0;
    }

    return (
        <div className={`relative inline-block ${className || ''}`}>
            <img
                src={imageSrc}
                alt={alt || ''}
                className={className}
                onError={handleError}
                {...props}
            />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Loading fallback...</div>
                </div>
            )}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
                        Image unavailable
                    </div>
                </div>
            )}
        </div>
    );
}

