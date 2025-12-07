import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: number;
    className?: string;
    text?: string;
}

export default function LoadingSpinner({
    size = 24,
    className = '',
    text
}: LoadingSpinnerProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div className="relative">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 blur-xl opacity-50 animate-pulse" />

                {/* Spinner */}
                <Loader2
                    size={size}
                    className="animate-spin text-indigo-400 relative z-10"
                />
            </div>
            {text && (
                <p className="text-sm text-indigo-200/80 font-medium animate-pulse">{text}</p>
            )}
        </div>
    );
}
