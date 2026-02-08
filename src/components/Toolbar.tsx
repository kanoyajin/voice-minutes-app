import React from 'react';
import { Mic, MicOff, Copy, Download, Trash2 } from 'lucide-react';

interface ToolbarProps {
    isListening: boolean;
    onToggleListening: () => void;
    onCopy: () => void;
    onDownload: () => void;
    onClear: () => void;
    hasContent: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
    isListening,
    onToggleListening,
    onCopy,
    onDownload,
    onClear,
    hasContent,
}) => {
    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-gray-900/90 backdrop-blur-md p-3 rounded-full shadow-2xl border border-gray-800 z-50 transition-all duration-300 hover:scale-105">
            <button
                onClick={onClear}
                disabled={!hasContent}
                className="p-3 rounded-full text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="クリア"
            >
                <Trash2 size={24} />
            </button>

            <button
                onClick={onToggleListening}
                className={`p-4 rounded-full transition-all duration-300 shadow-lg ${isListening
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                title={isListening ? '録音停止' : '録音開始'}
            >
                {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </button>

            <div className="h-8 w-px bg-gray-700 mx-1" />

            <button
                onClick={onCopy}
                disabled={!hasContent}
                className="p-3 rounded-full text-gray-400 hover:text-indigo-400 hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="コピー"
            >
                <Copy size={24} />
            </button>

            <button
                onClick={onDownload}
                disabled={!hasContent}
                className="p-3 rounded-full text-gray-400 hover:text-green-400 hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="ダウンロード"
            >
                <Download size={24} />
            </button>
        </div>
    );
};

export default Toolbar;
