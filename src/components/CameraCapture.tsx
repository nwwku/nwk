import { useEffect, useRef, useState } from 'react';
import { localize, useLanguage } from '../lib/language';
import { Icon } from './Icon';

type Props = {
  onCapture: (file: File) => void;
  onClose: () => void;
};

export function CameraCapture({ onCapture, onClose }: Props) {
  const { language } = useLanguage();
  const tr = (en: string, ru: string) => localize(language, en, ru);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(tr('This browser cannot open the camera.', 'Этот браузер не может открыть камеру.'));
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        setError(tr(
          'Camera access was denied or no camera was found.',
          'Доступ к камере запрещён или камера не найдена.',
        ));
      }
    }

    void startCamera();
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [language]);

  function takePhoto() {
    const video = videoRef.current;
    if (!video?.videoWidth || !video.videoHeight) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      onCapture(new File([blob], `wardrobe-${Date.now()}.jpg`, { type: 'image/jpeg' }));
      onClose();
    }, 'image/jpeg', 0.92);
  }

  return <div className="camera-capture" role="dialog" aria-modal="true" aria-label={tr('Camera', 'Камера')}>
    <button className="camera-capture__close" type="button" onClick={onClose} aria-label={tr('Close camera', 'Закрыть камеру')}><Icon name="close" /></button>
    <video ref={videoRef} autoPlay playsInline muted />
    {error && <div className="camera-capture__error"><p>{error}</p><button type="button" onClick={onClose}>{tr('Choose a photo instead', 'Выбрать фото из галереи')}</button></div>}
    {!error && <button className="camera-shutter" type="button" onClick={takePhoto} aria-label={tr('Take photo', 'Сфотографировать')}><span /></button>}
  </div>;
}
