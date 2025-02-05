import { useEffect, useRef } from "react";
import "./HoloCard.css";

interface HoloCardProps {
  imageUrl: string;
  className?: string;
}

const HoloCard = ({ imageUrl, className = "" }: HoloCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLStyleElement>(null);
  const animationIndex = useRef(Math.floor(Math.random() * 4)); // 4 variations différentes

  useEffect(() => {
    const card = cardRef.current;
    const style = styleRef.current;
    let timeoutId: number;

    if (!card || !style) return;

    // Ajoute une classe d'animation aléatoire
    card.classList.add(`animation-${animationIndex.current}`);

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
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("touchmove", handleMove);
      card.removeEventListener("mouseout", handleLeave);
      card.removeEventListener("touchend", handleLeave);
      card.removeEventListener("touchcancel", handleLeave);
      clearTimeout(timeoutId);
      card.classList.remove(`animation-${animationIndex.current}`);
    };
  }, []);

  return (
    <>
      <div
        ref={cardRef}
        className={`holo-card animated ${className}`}
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <style ref={styleRef} />
    </>
  );
};

export default HoloCard;
