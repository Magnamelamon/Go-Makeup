import { useEffect, useRef, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { Hands } from '@mediapipe/hands';
import { VTO_API_URL } from '../../config/vto';
import './NailTryOn.css';

interface NailColor {
  productId: number | string;
  colorName: string;
  hexCode: string;
}

interface NailTryOnProps {
  initialColor?: string;
}

function NailTryOn({ initialColor }: NailTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  const [nailColor, setNailColor] = useState<{ hexCode: string; colorName: string }>({
    hexCode: initialColor || '#e11d48',
    colorName: 'Cherry Red',
  });
  const [apiColors, setApiColors] = useState<NailColor[]>([]);
  const [handState, setHandState] = useState<string | null>(null);

  // Responsive & QR Handoff
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);

    const currentUrl = window.location.href;
    setQrUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=be185d&data=${encodeURIComponent(currentUrl)}`
    );

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Nail rendering engine ──────────────────────────────────────────
  const drawNails = (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    width: number,
    height: number,
    color: string
  ) => {
    const fingers = [
      { tip: 4, prev: 3, pip: 2 },
      { tip: 8, prev: 7, pip: 6 },
      { tip: 12, prev: 11, pip: 10 },
      { tip: 16, prev: 15, pip: 14 },
      { tip: 20, prev: 19, pip: 18 },
    ];

    ctx.globalCompositeOperation = 'source-over';

    const wrist = landmarks[0];
    const middleMCP = landmarks[9];

    const handLengthPx = Math.hypot(
      (middleMCP.x - wrist.x) * width,
      (middleMCP.y - wrist.y) * height
    );

    const scaleFactor = handLengthPx / 100;

    fingers.forEach((finger) => {
      const tipLm = landmarks[finger.tip];
      const prevLm = landmarks[finger.prev];
      const pipLm = landmarks[finger.pip];

      const distToTip = Math.hypot(tipLm.x - wrist.x, tipLm.y - wrist.y);
      const distToPip = Math.hypot(pipLm.x - wrist.x, pipLm.y - wrist.y);

      if (distToTip < distToPip) return;

      if (finger.tip === 4) {
        const thumbZ = tipLm.z;
        const palmZ = (landmarks[5].z + landmarks[17].z) / 2;
        if (thumbZ > palmZ + 0.04) {
          return;
        }
      }

      const x = tipLm.x * width;
      const y = tipLm.y * height;
      const px = prevLm.x * width;
      const py = prevLm.y * height;

      const dx = x - px;
      const dy = y - py;
      const segmentLength = Math.hypot(dx, dy);

      const radiusX = segmentLength * 0.65;
      const radiusY = finger.tip === 4 ? 11 * scaleFactor : 9 * scaleFactor;

      let angle: number;
      if (finger.tip === 4) {
        const baseAngle = Math.atan2(y - py, x - px);
        angle = baseAngle + Math.PI / 12;
      } else {
        angle = Math.atan2(y - py, x - px);
      }

      const cuticleShift = 0.25;
      const cuticleX = x - dx * cuticleShift;
      const cuticleY = y - dy * cuticleShift;

      ctx.save();
      ctx.translate(cuticleX, cuticleY);
      ctx.rotate(angle);

      ctx.globalAlpha = 1.0;
      ctx.fillStyle = color;

      ctx.beginPath();
      const tipExtension = radiusX * 2.6;
      ctx.moveTo(0, 0);

      ctx.bezierCurveTo(0, radiusY * 1.5, radiusX * 1.2, radiusY * 1.1, tipExtension, 0);
      ctx.bezierCurveTo(radiusX * 1.2, -radiusY * 1.1, 0, -radiusY * 1.5, 0, 0);

      ctx.fill();
      ctx.globalAlpha = 1.0;
      ctx.restore();
    });

    ctx.globalCompositeOperation = 'source-over';
  };

  // ── Color ref for real-time rendering ──────────────────────────────
  const nailColorRef = useRef(nailColor.hexCode);
  useEffect(() => {
    nailColorRef.current = nailColor.hexCode;
  }, [nailColor.hexCode]);

  // ── Fetch colors from VTO backend (with mock fallback) ─────────────
  useEffect(() => {
    fetch(`${VTO_API_URL}/api/colors`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setApiColors(data.data);
          // If initialColor matches one in the API, use its name
          const match = data.data.find(
            (c: NailColor) => c.hexCode.toLowerCase() === initialColor?.toLowerCase()
          );
          if (match) {
            setNailColor({ hexCode: match.hexCode, colorName: match.colorName });
          } else {
            setNailColor({ hexCode: data.data[0].hexCode, colorName: data.data[0].colorName });
          }
        }
      })
      .catch(() => {
        console.warn('[VTO Widget] Backend no disponible. Cargando paleta de prueba local.');
        const mockColors: NailColor[] = [
          { productId: 1, colorName: 'Cherry Red', hexCode: '#e11d48' },
          { productId: 2, colorName: 'Soft Pink', hexCode: '#f472b6' },
          { productId: 3, colorName: 'Magenta', hexCode: '#be185d' },
          { productId: 4, colorName: 'Midnight Blue', hexCode: '#1e3a8a' },
          { productId: 5, colorName: 'Lavender', hexCode: '#c084fc' },
          { productId: 6, colorName: 'Nude Beige', hexCode: '#d6d3d1' },
          { productId: 7, colorName: 'Onyx Black', hexCode: '#171717' },
        ];
        setApiColors(mockColors);
        const match = mockColors.find(
          (c) => c.hexCode.toLowerCase() === initialColor?.toLowerCase()
        );
        if (match) {
          setNailColor({ hexCode: match.hexCode, colorName: match.colorName });
        } else {
          setNailColor({ hexCode: mockColors[0].hexCode, colorName: mockColors[0].colorName });
        }
      });
  }, [initialColor]);

  // ── MediaPipe initialization (mobile only) ─────────────────────────
  useEffect(() => {
    if (!isMobile) return;

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (!videoElement || !canvasElement) return;

    const canvasCtx = canvasElement.getContext('2d');
    if (!canvasCtx) return;

    const hands = new Hands({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results: any) => {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      canvasCtx.translate(canvasElement.width, 0);
      canvasCtx.scale(-1, 1);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

      if (
        results.multiHandLandmarks &&
        results.multiHandedness &&
        results.multiHandLandmarks.length > 0
      ) {
        const landmarks = results.multiHandLandmarks[0];
        const classification = results.multiHandedness[0];

        const lm0 = landmarks[0];
        const lm5 = landmarks[5];
        const lm17 = landmarks[17];

        const v1x = lm5.x - lm0.x;
        const v1y = lm5.y - lm0.y;
        const v2x = lm17.x - lm0.x;
        const v2y = lm17.y - lm0.y;

        const crossZ = v1x * v2y - v1y * v2x;
        const label = classification.label;
        let viewType = 'Desconocido';

        if (label === 'Left') {
          viewType = crossZ < 0 ? 'Palma' : 'Dorso';
        } else {
          viewType = crossZ > 0 ? 'Palma' : 'Dorso';
        }

        setHandState(viewType);

        if (viewType === 'Dorso') {
          drawNails(canvasCtx, landmarks, canvasElement.width, canvasElement.height, nailColorRef.current);
        }
      } else {
        setHandState(null);
      }
      canvasCtx.restore();
    });

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        if (!isReady) setIsReady(true);
        try {
          await hands.send({ image: videoElement });
        } catch (e) {
          console.error(e);
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      camera.stop();
      hands.close();
    };
  }, [isMobile]);

  // ── Desktop: QR Handoff ────────────────────────────────────────────
  if (!isMobile) {
    return (
      <div className="vto-widget-container" style={{ aspectRatio: 'auto', padding: '0.5rem' }}>
        <div className="vto-desktop-qr-container">
          <h3>Pruébatelo en tu Celular</h3>
          <p>
            La cámara frontal de tu computadora es incómoda para escanear manos. Escanea este código
            para abrir la experiencia AR en tu móvil.
          </p>

          {qrUrl ? (
            <img src={qrUrl} alt="Escanea para ir a móvil" className="vto-qr-code-img" />
          ) : (
            <div className="vto-spinner"></div>
          )}

          <button
            className="vto-qr-copy-btn"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('¡Enlace copiado al portapapeles!');
            }}
          >
            Copiar Enlace
          </button>
        </div>
      </div>
    );
  }

  // ── Mobile: AR Experience ──────────────────────────────────────────
  return (
    <div className="vto-widget-container">
      <div className="vto-vision-layer">
        {!isReady && (
          <div className="vto-loader-overlay">
            <div className="vto-spinner"></div>
            <p>Iniciando Probador AR...</p>
          </div>
        )}

        {/* Visual hand-alignment guide */}
        <div className="vto-hand-guide-overlay"></div>

        <div className="vto-top-bar">
          <div className="vto-status-badge">
            <span className={`vto-status-dot ${handState === 'Dorso' ? '' : 'searching'}`}></span>
            {handState === 'Dorso'
              ? 'Mano detectada'
              : handState === 'Palma'
                ? 'Muestra el dorso'
                : 'Centra tu mano en la guía...'}
          </div>
        </div>

        <video ref={videoRef} className="vto-video-feed" playsInline muted></video>
        <canvas ref={canvasRef} className="vto-output-canvas" width={640} height={480}></canvas>
      </div>

      <div className="vto-bottom-controls">
        <div className="vto-product-info">
          <h2 className="vto-product-title">{nailColor.colorName}</h2>
          <p className="vto-product-hex">{nailColor.hexCode}</p>
        </div>

        <div className="vto-color-carousel">
          {apiColors.map((colorItem) => (
            <button
              key={colorItem.productId || colorItem.hexCode}
              className={`vto-color-swatch-wrapper ${nailColor.hexCode === colorItem.hexCode ? 'active' : ''}`}
              onClick={() =>
                setNailColor({ hexCode: colorItem.hexCode, colorName: colorItem.colorName })
              }
              aria-label={`Seleccionar color ${colorItem.colorName}`}
            >
              <div className="vto-color-swatch" style={{ backgroundColor: colorItem.hexCode }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NailTryOn;
