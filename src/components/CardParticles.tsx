import { useEffect, useRef } from "react";
import "./CardParticles.css";

const CardParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Créer plus de particules
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      // Position finale plus éloignée
      const angle = (Math.random() * 360 * Math.PI) / 180;
      const distance = 150 + Math.random() * 200;

      const xEnd = Math.cos(angle) * distance;
      const yEnd = Math.sin(angle) * distance;

      particle.style.setProperty("--x-end", `${xEnd}px`);
      particle.style.setProperty("--y-end", `${yEnd}px`);
      particle.style.setProperty("--delay", `${Math.random() * 0.3}s`);

      container.appendChild(particle);
    }

    // Nettoyer les particules après l'animation
    const timeout = setTimeout(() => {
      container.innerHTML = "";
    }, 3000);

    return () => {
      clearTimeout(timeout);
      container.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} className="particles-container" />;
};

export default CardParticles;
