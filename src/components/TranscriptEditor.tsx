import React, { useEffect, useRef } from 'react';

interface TranscriptEditorProps {
    transcript: string;
    interimTranscript: string;
    onChange: (value: string) => void;
}

const TranscriptEditor: React.FC<TranscriptEditorProps> = ({
    transcript,
    interimTranscript,
    onChange,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom when new transcript arrives
    useEffect(() => {
        if (textareaRef.current) {
            // Only scroll if user is near the bottom to allow manual scrolling
            const { scrollTop, scrollHeight, clientHeight } = textareaRef.current;
            if (scrollHeight - scrollTop - clientHeight < 100) {
                textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
            }
        }
    }, [transcript, interimTranscript]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className="flex-1 w-full max-w-4xl mx-auto p-4 flex flex-col h-full">
            <div className="flex-1 relative border border-gray-700 rounded-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm shadow-xl">
                <textarea
                    ref={textareaRef}
                    className="w-full h-full p-6 bg-transparent text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-sans text-lg leading-relaxed"
                    value={transcript}
                    onChange={handleChange}
                    placeholder="ここに音声入力されたテキストが表示されます..."
                    spellCheck={false}
                />
                {interimTranscript && (
                    <div className="absolute bottom-4 left-6 right-6 pointer-events-none">
                        <span className="bg-indigo-600/20 text-indigo-300 px-2 py-1 rounded animate-pulse">
                            {interimTranscript}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TranscriptEditor;
