import { useState } from "react";
import "./App.css";

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const boosters = [
    "/image/booster/pokelillev7.png",
    "/image/booster/pokelillev7.png",
    "/image/booster/pokelillev7.png",
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === boosters.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? boosters.length - 1 : prevIndex - 1
    );
  };

  const handleImageClick = (index: number) => {
    let diff = index - currentIndex;
    if (diff < 0) diff += boosters.length;

    // Si on clique sur l'image centrale
    if (diff === 0) {
      setIsExpanded(!isExpanded);
      return;
    }

    // Si on clique sur une image latérale (seulement si pas en mode étendu)
    if (!isExpanded) {
      if (diff === 1) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Gradient du haut (1/3) */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-violet-600 to-green-500 gradient-section" />

      {/* Fond du bas (2/3) */}
      <div className="absolute top-0 left-0 w-full h-full bg-white white-section" />

      {/* Contenu */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          PokeLille TCG
        </h1>

        <div
          className={`carousel-container relative ${
            isExpanded ? "h-[800px]" : "h-[600px]"
          } max-w-3xl mx-auto transition-all duration-500`}
        >
          {boosters.map((booster, index) => {
            let position = index - currentIndex;
            if (position < 0) position += boosters.length;

            return (
              <div
                key={index}
                onClick={() => handleImageClick(index)}
                className={`carousel-item absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                  position === 0
                    ? `z-20 ${
                        isExpanded ? "scale-150" : "scale-100"
                      } opacity-100`
                    : position === 1
                    ? `z-10 scale-75 opacity-60 ${
                        isExpanded ? "translate-x-[200%]" : "translate-x-[10%]"
                      } hover:opacity-80`
                    : `z-10 scale-75 opacity-60 ${
                        isExpanded
                          ? "-translate-x-[200%]"
                          : "-translate-x-[110%]"
                      } hover:opacity-80`
                }`}
              >
                <img
                  src={booster}
                  alt={`Booster PokeLille ${index + 1}`}
                  className="w-[300px]"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
