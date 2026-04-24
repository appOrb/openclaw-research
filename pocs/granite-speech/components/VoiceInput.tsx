'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getMicrophoneStream,
  createRecorder,
  processAudioForModel,
  calculateAudioLevel,
} from '@/lib/audio-processor';
import {
  loadGraniteSpeechModel,
  transcribeAudio,
  checkWebGPUSupport,
  type ModelLoadProgress,
  type TranscriptionResult,
} from '@/lib/granite-speech';

export default function VoiceInput() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [modelProgress, setModelProgress] = useState<ModelLoadProgress | null>(null);
  const [webGPUSupported, setWebGPUSupported] = useState<boolean | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check WebGPU support on mount
  useEffect(() => {
    checkWebGPUSupport().then(setWebGPUSupported);
  }, []);

  // Load model on mount
  useEffect(() => {
    loadGraniteSpeechModel((progress) => {
      setModelProgress(progress);
    }).catch((err) => {
      setError(`Failed to load model: ${err.message}`);
    });
  }, []);

  // Audio level monitoring
  useEffect(() => {
    if (!isRecording || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Float32Array(analyser.fftSize);

    const updateLevel = () => {
      analyser.getFloatTimeDomainData(dataArray);
      const level = calculateAudioLevel(dataArray);
      setAudioLevel(level);
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setError(null);
      setTranscription(null);
      setRecordingDuration(0);
      audioChunksRef.current = [];

      // Get microphone stream
      const stream = await getMicrophoneStream();
      mediaStreamRef.current = stream;

      // Create audio analyser for visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Create recorder
      const recorder = createRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        await processRecording();
      };

      recorder.start();
      setIsRecording(true);

      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to start recording'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop duration timer
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      // Stop media stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      // Close analyser
      if (analyserRef.current) {
        analyserRef.current = null;
      }

      setAudioLevel(0);
    }
  };

  const processRecording = async () => {
    if (audioChunksRef.current.length === 0) {
      setError('No audio recorded');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create blob from chunks
      const audioBlob = new Blob(audioChunksRef.current, {
        type: 'audio/webm',
      });

      // Process audio for model
      const audioData = await processAudioForModel(audioBlob);

      // Transcribe with Granite
      const result = await transcribeAudio(audioData, true);

      setTranscription(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to process audio'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      {/* Model Loading Status */}
      <AnimatePresence>
        {modelProgress && modelProgress.status !== 'loaded' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">
                {modelProgress.message}
              </span>
              <span className="text-sm font-bold text-blue-900">
                {modelProgress.progress}%
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${modelProgress.progress}%` }}
                className="bg-blue-600 h-2 rounded-full"
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WebGPU Status */}
      {webGPUSupported !== null && (
        <div
          className={`text-sm px-4 py-2 rounded-lg ${
            webGPUSupported
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
          }`}
        >
          {webGPUSupported
            ? '✓ WebGPU enabled (GPU acceleration active)'
            : '⚠ WebGPU not available (using WASM fallback)'}
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex flex-col items-center space-y-4">
        <motion.button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing || (modelProgress?.status !== 'loaded' && !isRecording)}
          whileTap={{ scale: 0.95 }}
          className={`w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transition-colors ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-500 hover:bg-blue-600'
          } disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {isProcessing ? (
            <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full" />
          ) : isRecording ? (
            'Stop'
          ) : (
            'Start'
          )}
        </motion.button>

        {/* Recording Duration */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-mono font-bold text-gray-700"
          >
            {formatDuration(recordingDuration)}
          </motion.div>
        )}

        {/* Audio Level Visualization */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md"
          >
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${audioLevel * 100}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
          >
            <strong>Error:</strong> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcription Result */}
      <AnimatePresence>
        {transcription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Transcription:
            </h3>
            <p className="text-xl text-gray-800 mb-4">
              &quot;{transcription.text}&quot;
            </p>
            <div className="flex gap-4 text-sm text-gray-600">
              <div>
                <strong>Latency:</strong> {transcription.latency}ms
              </div>
              {transcription.confidence && (
                <div>
                  <strong>Confidence:</strong>{' '}
                  {(transcription.confidence * 100).toFixed(1)}%
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 space-y-2">
        <p>Click &quot;Start&quot; to begin recording, then speak your order.</p>
        <p>Click &quot;Stop&quot; when finished to transcribe.</p>
        <p className="text-xs text-gray-500">
          Try saying: &quot;I want masala dosa with extra sambar&quot;
        </p>
      </div>
    </div>
  );
}
