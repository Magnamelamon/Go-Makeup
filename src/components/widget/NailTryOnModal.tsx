import { useEffect, useCallback } from 'react';
import NailTryOn from './NailTryOn';
import type { NailColor } from './NailTryOn';
import './NailTryOnModal.css';

interface NailTryOnModalProps {
  onClose: () => void;
  initialColor?: string;
  productColors?: NailColor[];
}

function NailTryOnModal({ onClose, initialColor, productColors }: NailTryOnModalProps) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // Prevent background scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  // Close if clicking the backdrop (not the widget)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="vto-modal-overlay" onClick={handleBackdropClick}>
      <div className="vto-modal-content">
        <button className="vto-modal-close" onClick={onClose} aria-label="Cerrar probador virtual">
          ✕
        </button>
        <NailTryOn initialColor={initialColor} productColors={productColors} />
      </div>
    </div>
  );
}

export default NailTryOnModal;
