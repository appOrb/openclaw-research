import VoiceInput from '@/components/VoiceInput';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Granite Speech POC
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            IBM Granite 4.0 1B Speech - Voice Ordering System
          </p>
          <p className="text-sm text-gray-600">
            Client-side AI speech recognition powered by WebGPU
          </p>
        </div>

        <VoiceInput />

        {/* Info Cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              🚀 Zero Cost
            </h3>
            <p className="text-sm text-gray-600">
              Runs entirely in your browser. No server costs, infinite scalability.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              🔒 Privacy First
            </h3>
            <p className="text-sm text-gray-600">
              Audio never leaves your device. Complete data privacy.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              ⚡ Fast
            </h3>
            <p className="text-sm text-gray-600">
              GPU-accelerated inference. ~500ms transcription time.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-12 max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg text-gray-900 mb-4">
            Technology Stack
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <strong>Model:</strong> IBM Granite 4.0 1B Speech
            </div>
            <div>
              <strong>Runtime:</strong> Transformers.js + WebGPU
            </div>
            <div>
              <strong>Framework:</strong> Next.js 16 + React 19
            </div>
            <div>
              <strong>Accuracy:</strong> 5.52% WER (avg)
            </div>
            <div>
              <strong>Size:</strong> 1B parameters (~4 GB)
            </div>
            <div>
              <strong>Languages:</strong> EN, FR, DE, ES, PT, JA
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p>
            Built for AI Waiter • Powered by IBM Granite • Open Source (Apache 2.0)
          </p>
          <p className="mt-2">
            <a
              href="https://huggingface.co/ibm-granite/granite-4.0-1b-speech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Model Card
            </a>
            {' • '}
            <a
              href="https://github.com/ibm-granite"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
