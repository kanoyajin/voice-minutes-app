import { useState, useEffect, useCallback, useRef } from 'react';

// Web Speech API Types
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

export interface SpeechRecognitionHook {
  isListening: boolean;
  interimTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
}

interface UseSpeechRecognitionProps {
  onResult?: (text: string) => void;
}

const useSpeechRecognition = ({ onResult }: UseSpeechRecognitionProps = {}): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const { webkitSpeechRecognition, SpeechRecognition } = (window as unknown) as IWindow;
    const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;

    if (SpeechRecognitionConstructor) {
      const recognitionInstance = new SpeechRecognitionConstructor();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'ja-JP';

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        let currentInterimTranscript = '';

        console.log('SpeechRecognition Event:', {
          resultIndex: event.resultIndex,
          resultsLength: event.results.length,
          results: event.results
        });

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            console.log('Final Result Found:', event.results[i][0].transcript);
            finalTranscript += event.results[i][0].transcript;
          } else {
            currentInterimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          // user requested pure transcription, no timestamp
          const formattedText = `${finalTranscript}\n`;
          console.log('Appending text:', formattedText);

          if (onResultRef.current) {
            onResultRef.current(formattedText);
          }
        }
        setInterimTranscript(currentInterimTranscript);
      };

      recognitionInstance.onend = () => {
        // Automatically restart if supposed to be listening (for continuous listening)
        // But for now, we'll let it stop and updating state to false.
        // If we want truly continuous, we need logic here to restart.
        // For simplicity, we just update state.
        // If user manually stopped, isListening will be set to false elsewhere.
        // If it stopped by itself (silence), we might want to restart or just show stopped.
        // Let's keep it simple: sync state.
        // Actually, we rely on isListening state to decide if we should restart.
      };

      // Handle errors
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);

      return () => {
        recognitionInstance.abort();
      };
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  const resetTranscript = useCallback(() => {
    setInterimTranscript('');
  }, []);

  const browserSupportsSpeechRecognition = !!recognition;

  return {
    isListening,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  };
};

export default useSpeechRecognition;
