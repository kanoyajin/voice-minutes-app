import { useState, useCallback } from 'react';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import TranscriptEditor from './components/TranscriptEditor';
import Toolbar from './components/Toolbar';
import RecordingIndicator from './components/RecordingIndicator';

function App() {
  const [displayText, setDisplayText] = useState('');
  // We can use a ref or stable callback to handle updates.
  // Since we want to append text, we need access to the latest state or use functional update.
  const handleResult = useCallback((text: string) => {
    console.log('App: handleResult called with:', text);
    setDisplayText((prev) => {
      console.log('App: previous displayText length:', prev.length);
      return prev + text;
    });
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
    if (confirm('Are you sure you want to clear the transcript?')) {
      resetTranscript();
      setDisplayText('');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 flex flex-col font-sans">
      <header className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">
            音声入力議事録
          </h1>
        </div>
        <RecordingIndicator isListening={isListening} />
      </header>

      <main className="flex-1 overflow-hidden relative flex flex-col p-4 sm:p-6 lg:p-8">
        <TranscriptEditor
          transcript={displayText}
          interimTranscript={interimTranscript}
          onChange={handleTextChange}
        />
      </main>

      <Toolbar
        isListening={isListening}
        onToggleListening={handleToggleListening}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onClear={handleClear}
        hasContent={displayText.length > 0}
      />
    </div>
  );
}

export default App;
