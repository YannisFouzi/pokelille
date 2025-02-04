import { useState } from "react";
import "./App.css";

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTearing, setIsTearing] = useState(false);
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
      if (isExpanded) {
        // Si l'image est déjà agrandie, on déclenche l'animation de déchirement
        setIsTearing(true);
      } else {
        // Sinon, on agrandit simplement l'image
        setIsExpanded(true);
      }
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

  const handleTearEnd = () => {
    // Après l'animation, on peut faire apparaître le contenu du booster
    setTimeout(() => {
      setIsTearing(false);
      // Ici vous pourrez ajouter la logique pour afficher les cartes
    }, 1000);
  };

  const handleTitleClick = () => {
    // Simule le clic sur l'image centrale
    handleImageClick(currentIndex);
  };

  return (
    <div className="min-h-screen relative">
      {/* Gradient du haut (1/3) */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-violet-600 to-green-500 gradient-section" />

      {/* Fond du bas (2/3) */}
      <div className="absolute top-0 left-0 w-full h-full bg-white white-section" />

      {/* Contenu */}
      <div className="relative z-10 container mx-auto px-4 pt-16 pb-8">
        <div
          className={`season-title shadow-sm ${isExpanded ? "selected" : ""}`}
          onClick={handleTitleClick}
        >
          <h1 className="text-gray-600 text-xl font-normal relative z-10">
            {isExpanded ? "Choisir celle-ci" : "Choisissez une soirée."}
          </h1>
        </div>

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
                <div className="relative">
                  {position === 0 ? (
                    <div
                      className={`${isTearing ? "tearing" : ""}`}
                      onAnimationEnd={handleTearEnd}
                    >
                      <img
                        src={booster}
                        alt={`Booster PokeLille ${index + 1}`}
                        className={`w-[300px] main-image`}
                      />
                      {isTearing && (
                        <>
                          <div
                            className="booster-top"
                            style={{
                              backgroundImage: `url(${booster})`,
                            }}
                          />
                          <div className="torn-foil" />
                          <div
                            className="booster-bottom"
                            style={{
                              backgroundImage: `url(${booster})`,
                            }}
                          />
                          <div className="tear-particles" />
                        </>
                      )}
                      <img
                        src={booster}
                        alt=""
                        className={`w-[300px] reflection`}
                        aria-hidden="true"
                      />
                    </div>
                  ) : (
                    <>
                      <img
                        src={booster}
                        alt={`Booster PokeLille ${index + 1}`}
                        className="w-[300px] main-image"
                      />
                      <img
                        src={booster}
                        alt=""
                        className="w-[300px] reflection"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
