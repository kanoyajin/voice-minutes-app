import React from 'react';

interface RecordingIndicatorProps {
    isListening: boolean;
}

const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({ isListening }) => {
    if (!isListening) return null;

    return (
        <div className="flex items-center gap-2 mb-4 animate-fadeIn">
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm text-red-400 font-medium">録音中...</span>
        </div>
    );
};

export default RecordingIndicator;
