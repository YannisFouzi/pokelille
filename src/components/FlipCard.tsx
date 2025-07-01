import { useEffect, useRef, useState } from "react";
import "./FlipCard.css";
import HoloCard from "./HoloCard";

interface FlipCardProps {
  frontImageUrl: string;
  backImageUrl: string;
  className?: string;
  onFlipComplete?: () => void;
  onSecondClick?: () => void;
  autoFlip?: boolean;
  disableClick?: boolean;
}

const FlipCard = ({
  frontImageUrl,
  backImageUrl,
  className = "",
  onFlipComplete,
  onSecondClick,
  autoFlip = true,
  disableClick = false,
}: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);
  const flipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-flip après un délai si autoFlip est activé
  useEffect(() => {
    if (autoFlip && !hasFlipped) {
      flipTimerRef.current = setTimeout(() => {
        setIsFlipped(true);
        setHasFlipped(true);

        // Notifier le parent que la carte a été retournée
        setTimeout(() => {
          if (onFlipComplete) onFlipComplete();
        }, 1000); // Après la fin de l'animation de flip
      }, 1500); // Délai avant le retournement automatique
    }

    return () => {
      if (flipTimerRef.current) {
        clearTimeout(flipTimerRef.current);
      }
    };
  }, [autoFlip, hasFlipped, onFlipComplete]);

  const handleCardClick = () => {
    // Si les clics sont désactivés, on ne fait rien
    if (disableClick) return;

    if (!hasFlipped) {
      // Premier clic, on retourne la carte
      setIsFlipped(true);
      setHasFlipped(true);

      // Notifier le parent que la carte a été retournée
      setTimeout(() => {
        if (onFlipComplete) onFlipComplete();
      }, 1000);
    } else if (onSecondClick) {
      // Deuxième clic, on exécute l'action secondaire
      onSecondClick();
    }
  };

  // Fonction spécifique pour gérer les clics sur la face avant
  const handleFrontClick = (e: React.MouseEvent) => {
    // Si les clics sont désactivés, on ne fait rien
    if (disableClick) return;

    e.stopPropagation(); // Empêcher la propagation pour éviter de déclencher handleCardClick également

    if (hasFlipped && onSecondClick) {
      console.log("Clic sur la face avant après retournement !");
      onSecondClick();
    }
  };

  return (
    <div
      className={`flip-card-container ${className} ${
        isFlipped ? "flipped" : ""
      }`}
      onClick={handleCardClick}
    >
      <div className="flip-card">
        <div className="flip-card-back">
          <img src={backImageUrl} alt="Dos de la carte" />
        </div>
        <div className="flip-card-front" onClick={handleFrontClick}>
          <HoloCard
            imageUrl={frontImageUrl}
            className="visible"
            isFirstCard={true}
            disableClick={disableClick}
          />
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
