import { useEffect, useRef } from "react";
import "./HoloCard.css";

interface HoloCardProps {
  imageUrl: string;
  className?: string;
}

export const HoloCard = ({ imageUrl, className = "" }: HoloCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLStyleElement>(null);
  let timeoutId: number;

  useEffect(() => {
    const card = cardRef.current;
    const style = styleRef.current;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!card || !style) return;

      // Normaliser la position tactile/souris
      const pos =
        e instanceof MouseEvent
          ? [e.offsetX, e.offsetY]
          : [
              e.touches[0].clientX - card.getBoundingClientRect().left,
              e.touches[0].clientY - card.getBoundingClientRect().top,
            ];

      const h = card.offsetHeight;
      const w = card.offsetWidth;
      const px = Math.abs(Math.floor((100 / w) * pos[0]) - 100);
      const py = Math.abs(Math.floor((100 / h) * pos[1]) - 100);
      const pa = 50 - px + (50 - py);

      // Calculs pour les positions du gradient/arrière-plan
      const lp = 50 + (px - 50) / 1.5;
      const tp = 50 + (py - 50) / 1.5;
      const px_spark = 50 + (px - 50) / 7;
      const py_spark = 50 + (py - 50) / 7;
      const p_opc = 20 + Math.abs(pa) * 1.5;
      const ty = ((tp - 50) / 2) * -1;
      const tx = ((lp - 50) / 1.5) * 0.5;

      // CSS à appliquer
      const tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg)`;
      const styleText = `
        .holo-card:hover:before { background-position: ${lp}% ${tp}%; }
        .holo-card:hover:after { background-position: ${px_spark}% ${py_spark}%; opacity: ${
        p_opc / 100
      }; }
      `;

      card.style.cssText = tf;
      style.innerHTML = styleText;
      card.classList.remove("animated");
    };

    const handleLeave = () => {
      if (!card || !style) return;
      style.innerHTML = "";
      card.style.cssText = "";
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        card.classList.add("animated");
      }, 2500);
    };

    card?.addEventListener("mousemove", handleMove);
    card?.addEventListener("touchmove", handleMove);
    card?.addEventListener("mouseout", handleLeave);
    card?.addEventListener("touchend", handleLeave);
    card?.addEventListener("touchcancel", handleLeave);

    return () => {
      card?.removeEventListener("mousemove", handleMove);
      card?.removeEventListener("touchmove", handleMove);
      card?.removeEventListener("mouseout", handleLeave);
      card?.removeEventListener("touchend", handleLeave);
      card?.removeEventListener("touchcancel", handleLeave);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <div
        ref={cardRef}
        className={`holo-card animated ${className}`}
        style={{ "--front": `url(${imageUrl})` } as React.CSSProperties}
      />
      <style ref={styleRef} />
    </>
  );
};
