import '@google/model-viewer';
import { useEffect, useRef, useState } from 'react';

const VARIANTS = [
  { value: 'street', label: 'Street' },
  { value: 'beach', label: 'Beach' },
  { value: 'midnight', label: 'Midnight' },
];

export default function Shoe3DViewer({ alt }) {
  const viewerRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [variant, setVariant] = useState(VARIANTS[0].value);

  useEffect(() => {
    const viewer = viewerRef.current;
    const handleLoad = () => setStatus('ready');
    const handleError = () => setStatus('error');

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('error', handleError);
    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    if (status === 'ready') viewerRef.current.variantName = variant;
  }, [status, variant]);

  return (
    <div className="absolute inset-0 flex flex-col">
      <model-viewer
        ref={viewerRef}
        src="/model/sepatu.glb"
        alt={alt}
        camera-controls=""
        auto-rotate=""
        interaction-prompt="none"
        shadow-intensity="1"
        exposure="1.1"
        touch-action="pan-y"
        style={{ width: '100%', flex: 1, minHeight: 0 }}
      />

      {status === 'loading' ? (
        <p className="absolute inset-x-0 top-1/2 text-center text-sm font-semibold text-neutral-500">
          Memuat model 3D...
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="absolute inset-x-0 top-1/2 px-4 text-center text-sm font-semibold text-neutral-500">
          Model 3D tidak bisa dimuat di perangkat ini.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-2 p-2">
        {VARIANTS.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={item.value === variant}
            onClick={() => setVariant(item.value)}
            className={`min-h-9 border px-3 text-xs font-semibold ${
              item.value === variant
                ? 'border-neutral-950 bg-neutral-950 text-white'
                : 'border-neutral-300 bg-white hover:border-neutral-950'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
