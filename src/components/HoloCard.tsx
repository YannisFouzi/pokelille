import React, { useEffect, useRef, useState } from "react";
import "./HoloCard.css";

interface HoloCardProps {
  imageUrl: string;
  className?: string;
  onSecondClick?: () => void;
  isFirstCard?: boolean;
  autoAnimation?: boolean;
  disableClick?: boolean;
}

const HoloCard = ({
  imageUrl,
  className = "",
  onSecondClick,
  isFirstCard = false,
  autoAnimation = import.meta.env.VITE_AUTO_ANIMATION === "true",
  disableClick = false,
}: HoloCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLStyleElement>(null);
  const animationIndex = useRef<number>();
  const [hasBeenClicked, setHasBeenClicked] = useState(false);

  useEffect(() => {
    if (animationIndex.current === undefined) {
      animationIndex.current = Math.floor(Math.random() * 4);
    }
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    const style = styleRef.current;
    let timeoutId: number;

    if (!card || !style) return;

    // Ajoute une classe d'animation aléatoire
    card.classList.add(`animation-${animationIndex.current}`);
    card.classList.add("animated"); // Ajout de la classe animated dès le début

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const rect = card.getBoundingClientRect();
      const pos =
        "touches" in e
          ? [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top]
          : [e.clientX - rect.left, e.clientY - rect.top];

      const h = card.offsetHeight;
      const w = card.offsetWidth;

      const px = Math.abs(Math.floor((100 / w) * pos[0]) - 100);
      const py = Math.abs(Math.floor((100 / h) * pos[1]) - 100);
      const pa = 50 - px + (50 - py);

      const lp = 50 + (px - 50) / 1.5;
      const tp = 50 + (py - 50) / 1.5;
      const px_spark = 50 + (px - 50) / 7;
      const py_spark = 50 + (py - 50) / 7;
      const p_opc = 20 + Math.abs(pa) * 1.5;
      const ty = ((tp - 50) / 2) * -1;
      const tx = ((lp - 50) / 1.5) * 0.5;

      requestAnimationFrame(() => {
        card.style.setProperty("--rotateX", `${ty}deg`);
        card.style.setProperty("--rotateY", `${tx}deg`);
        card.style.setProperty("--rotateZ", "0deg");

        const styleText = `
          .holo-card:hover:before { background-position: ${lp}% ${tp}%; }
          .holo-card:hover:after { background-position: ${px_spark}% ${py_spark}%; opacity: ${
          p_opc / 100
        }; }
        `;

        style.innerHTML = styleText;
      });

      card.classList.remove("animated");
    };

    const handleLeave = () => {
      const card = cardRef.current;
      if (!card) return;

      style.innerHTML = "";
      card.style.setProperty("--rotateX", "0deg");
      card.style.setProperty("--rotateY", "0deg");
      card.style.setProperty("--rotateZ", "0deg");

      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        card.classList.add("animated");
      }, 2500);
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("touchmove", handleMove);
    card.addEventListener("mouseout", handleLeave);
    card.addEventListener("touchend", handleLeave);
    card.addEventListener("touchcancel", handleLeave);

    return () => {
      clearTimeout(timeoutId);
      if (card) {
        card.removeEventListener("mousemove", handleMove);
        card.removeEventListener("touchmove", handleMove);
        card.removeEventListener("mouseout", handleLeave);
        card.removeEventListener("touchend", handleLeave);
        card.removeEventListener("touchcancel", handleLeave);
        card.classList.remove(`animation-${animationIndex.current}`);
        card.classList.remove("animated");
      }
    };
  }, []); // Retour à la dépendance vide

  useEffect(() => {
    if (!autoAnimation || hasBeenClicked) return;

    const timeoutId = setTimeout(() => {
      const card = cardRef.current;
      if (!card || hasBeenClicked) return;

      // 1. D'abord on capture la transformation actuelle
      const computedStyle = window.getComputedStyle(card);
      const matrix = computedStyle.transform;

      // 2. On retire la classe animated et on attend une frame
      card.classList.remove("animated");

      requestAnimationFrame(() => {
        // 3. Maintenant que la transition est réactivée, on applique les changements
        card.style.transform = matrix;
        card.style.animation = "none";
        card.classList.remove(`animation-${animationIndex.current}`);

        requestAnimationFrame(() => {
          card.classList.add("returning");
        });
      });

      setHasBeenClicked(true);

      setTimeout(() => {
        if (onSecondClick) {
          onSecondClick();
        }
      }, 2000);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [hasBeenClicked, onSecondClick, autoAnimation]);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Si les clics sont désactivés, on ne fait rien
    if (disableClick) return;

    e.stopPropagation();

    const card = cardRef.current;
    if (!card) return;

    if (!hasBeenClicked) {
      console.log("👆 MANUEL - Classes avant:", card.classList.toString());
      console.log("👆 MANUEL - Style transform avant:", card.style.transform);

      const computedStyle = window.getComputedStyle(card);
      const matrix = computedStyle.transform;
      console.log("👆 MANUEL - Matrix capturée:", matrix);

      card.style.transform = matrix;
      card.style.animation = "none";
      card.classList.remove(`animation-${animationIndex.current}`);
      card.classList.remove("animated");

      console.log(
        "👆 MANUEL - Classes après remove:",
        card.classList.toString()
      );
      console.log("👆 MANUEL - Style transform après:", card.style.transform);

      requestAnimationFrame(() => {
        card.classList.add("returning");
        console.log("👆 MANUEL - Classes finales:", card.classList.toString());
      });

      setHasBeenClicked(true);
    } else {
      onSecondClick?.();
    }
  };

  return (
    <>
      <div
        ref={cardRef}
        className={`holo-card ${className} ${isFirstCard ? "first-card" : ""}`}
        onClick={handleCardClick}
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <style ref={styleRef} />
    </>
  );
};

export default React.memo(HoloCard, (prevProps, nextProps) => {
  return (
    prevProps.imageUrl === nextProps.imageUrl &&
    prevProps.className === nextProps.className &&
    prevProps.isFirstCard === nextProps.isFirstCard &&
    prevProps.autoAnimation === nextProps.autoAnimation &&
    prevProps.disableClick === nextProps.disableClick
  );
});
