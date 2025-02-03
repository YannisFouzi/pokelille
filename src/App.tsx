import { useState } from "react";
import "./App.css";

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Nouvelle fonction pour gérer le clic sur une image
  const handleImageClick = (index: number) => {
    let diff = index - currentIndex;
    if (diff < 0) diff += boosters.length;

    // Si on clique sur une image qui n'est pas au centre
    if (diff !== 0) {
      if (diff === 1) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">PokeLille TCG</h1>

        <div className="carousel-container relative h-[600px] max-w-3xl mx-auto">
          {boosters.map((booster, index) => {
            let position = index - currentIndex;
            if (position < 0) position += boosters.length;

            return (
              <div
                key={index}
                onClick={() => handleImageClick(index)}
                className={`carousel-item absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                  position === 0
                    ? "z-20 scale-100 opacity-100" // Centre (premier plan)
                    : position === 1
                    ? `z-${
                        index === currentIndex ? "30" : "10"
                      } scale-75 opacity-60 translate-x-[10%] hover:opacity-80` // Droite
                    : `z-${
                        index === currentIndex ? "30" : "10"
                      } scale-75 opacity-60 -translate-x-[110%] hover:opacity-80` // Gauche
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
