'use client';

import { useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

function createCroppedFile(src: string, area: Area, name: string, type: string) {
  return new Promise<File>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = area.width;
      canvas.height = area.height;
      canvas.getContext('2d')?.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
      canvas.toBlob((blob) => blob ? resolve(new File([blob], name, { type })) : reject(new Error('Crop failed')), type);
    };
    image.onerror = reject;
    image.src = src;
  });
}

export function ImageCropper({ file, onDone, onCancel, aspect }: { file: File; onDone: (file: File) => void; onCancel: () => void; aspect?: number }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const src = URL.createObjectURL(file);
  const complete = useCallback((_: Area, pixels: Area) => setArea(pixels), []);
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
    <div className="w-full max-w-xl space-y-4 rounded-lg bg-white p-4">
      <div className="relative h-80"><Cropper image={src} crop={crop} zoom={zoom} aspect={aspect} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={complete} /></div>
      <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full" />
      <div className="flex justify-end gap-2"><button type="button" onClick={onCancel}>Cancel</button><button type="button" className="rounded bg-primary px-4 py-2 text-white" onClick={async () => area && onDone(await createCroppedFile(src, area, file.name, file.type))}>Crop</button></div>
    </div>
  </div>;
}
