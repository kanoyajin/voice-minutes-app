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
        <div className="flex-1 w-full h-full flex flex-col relative">
            <textarea
                ref={textareaRef}
                className="w-full h-full bg-transparent text-gray-800 resize-none focus:outline-none placeholder-gray-400 transition-all font-serif text-lg leading-loose break-words whitespace-pre-wrap overflow-y-auto pr-4"
                value={transcript}
                onChange={handleChange}
                placeholder="マイクをオンにして話し始めると、ここに文字が表示されます..."
                spellCheck={false}
            />
            {interimTranscript && (
                <div className="absolute bottom-0 left-0 right-0 pointer-events-none p-2 bg-gradient-to-t from-white via-white/80 to-transparent">
                    <span className="text-gray-400 italic">
                        {interimTranscript}
                    </span>
                </div>
            )}
        </div>
    );
};

export default TranscriptEditor;
