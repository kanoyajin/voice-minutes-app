import { useState, useCallback, useEffect } from 'react';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import TranscriptEditor from './components/TranscriptEditor';
import Toolbar from './components/Toolbar';
import RecordingIndicator from './components/RecordingIndicator';

function App() {
  const [displayText, setDisplayText] = useState('');
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  // We can use a ref or stable callback to handle updates.
  // Since we want to append text, we need access to the latest state or use functional update.

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('voice-minutes-draft');
    if (saved) {
      setDisplayText(saved);
      setDebugLogs(prev => [`[${new Date().toLocaleTimeString()}] Loaded saved draft (len: ${saved.length})`, ...prev]);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('voice-minutes-draft', displayText);
  }, [displayText]);

  const handleResult = useCallback((text: string) => {
    const logMsg = `[${new Date().toLocaleTimeString()}] Append: "${text.slice(0, 10)}..." (len: ${text.length})`;
    setDebugLogs(prevLogs => [logMsg, ...prevLogs].slice(0, 50));

    setDisplayText((prev) => prev + text);
  }, []);

  const {
    isListening,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ onResult: handleResult });



  const handleTextChange = useCallback((value: string) => {
    setDisplayText(value);
  }, []);

  const handleToggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, stopListening, startListening]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(displayText);
  }, [displayText]);

  const handleDownload = useCallback(() => {
    const element = document.createElement('a');
    const file = new Blob([displayText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `minutes-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [displayText]);

  const handleClear = useCallback(() => {
    if (confirm('議事録をクリアしてもよろしいですか？\n(Clear transcript?)')) {
      resetTranscript();
      setDisplayText('');
      localStorage.removeItem('voice-minutes-draft');
    }
  }, [resetTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-400">非対応ブラウザです</h1>
          <p>お使いのブラウザはWeb Speech APIに対応していません。Google Chrome, Edge, Safariなどをご利用ください。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col font-sans">
      <header className="px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-800">
              音声入力議事録
            </h1>
            <span className="text-xs text-gray-500 font-mono">v2.0 Document Mode</span>
          </div>
        </div>
        <RecordingIndicator isListening={isListening} />
      </header>

      <main className="flex-1 overflow-auto p-4 sm:p-8 bg-gray-100 flex justify-center">
        <div className="w-full max-w-4xl bg-white shadow-xl min-h-[calc(100vh-12rem)] p-8 sm:p-12 rounded-sm mx-auto border border-gray-200">
          <TranscriptEditor
            transcript={displayText}
            interimTranscript={interimTranscript}
            onChange={handleTextChange}
          />
        </div>
      </main>

      <Toolbar
        isListening={isListening}
        onToggleListening={handleToggleListening}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onClear={handleClear}
        hasContent={displayText.length > 0}
      />

      <div className="bg-gray-900 text-gray-400 p-2 text-xs font-mono h-24 overflow-y-auto border-t border-gray-800">
        <p className="mb-1 text-gray-200">Debug Logs:</p>
        {debugLogs.map((log, i) => (
          <div key={i} className="border-b border-gray-800 py-0.5">{log}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
