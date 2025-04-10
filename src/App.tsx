import { useEffect, useState } from "react";
import "./App.css";
import FlipCard from "./components/FlipCard";
import HoloCard from "./components/HoloCard";

const AUTO_ANIMATION = import.meta.env.VITE_AUTO_ANIMATION === "true";

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTearing, setIsTearing] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showCard, setShowCard] = useState(false);
  const [isDescending, setIsDescending] = useState(false);
  const [showCardFront, setShowCardFront] = useState(false);
  const [isCardLeaving, setIsCardLeaving] = useState(false);
  const [showScoobyCard, setShowScoobyCard] = useState(false);
  const [isScoobyFront, setIsScoobyFront] = useState(false);
  const [showNVitralCard, setShowNVitralCard] = useState(false);
  const [isNVitralFront, setIsNVitralFront] = useState(false);
  const [isScoobyLeaving, setIsScoobyLeaving] = useState(false);
  const [showNosferatuCard, setShowNosferatuCard] = useState(false);
  const [isNosferatuFront, setIsNosferatuFront] = useState(false);
  const [isNVitralLeaving, setIsNVitralLeaving] = useState(false);
  const [showBananaCard, setShowBananaCard] = useState(false);
  const [isBananaFront, setIsBananaFront] = useState(false);
  const [isNosferatuLeaving, setIsNosferatuLeaving] = useState(false);
  const [autoplayStarted, setAutoplayStarted] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const boosters = [
    "/image/booster/pokelillev7.png",
    "/image/booster/pokelille_before.png",
    "/image/booster/pokelille_euphorie.png",
  ];
  const preloadedImages = new Map();

  const cardImages = [
    "/image/carte/nvitral.png",
    "/image/carte/nosferatu.png",
    "/image/carte/nxd2.png",
    "/image/carte/banana.png",
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

  const preloadImage = (src: string) => {
    if (preloadedImages.has(src)) {
      return preloadedImages.get(src);
    }

    const img = new Image();
    const promise = new Promise<void>((resolve) => {
      img.onload = () => {
        console.log("✅ Image chargée et stockée:", src);
        resolve();
      };
      img.src = src;
    });
    preloadedImages.set(src, promise);
    return promise;
  };

  const preloadAllCards = async () => {
    await Promise.all(cardImages.map(preloadImage));
  };

  // Un seul useEffect pour le préchargement
  useEffect(() => {
    const allImages = [
      "/image/carte/hysta.png",
      "/image/carte/backside.png",
      ...cardImages,
      "/image/booster/pokelillev7.png",
    ];

    Promise.all(allImages.map(preloadImage)).then(() => {
      setImagesLoaded(true);
    });
  }, []);

  const handleImageClick = (index: number) => {
    let diff = index - currentIndex;
    if (diff < 0) diff += boosters.length;

    // Si on clique sur l'image centrale
    if (diff === 0) {
      if (isExpanded) {
        // Précharger la première carte immédiatement
        preloadImage("/image/carte/hysta.png");
        // Précharger les autres cartes pendant l'animation
        preloadAllCards();

        // Si l'image est déjà agrandie, on déclenche l'animation de déchirement
        setIsTearing(true);
        setShowTitle(false);
      } else {
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
    // On attend un peu avant de montrer la carte avec son animation
    setTimeout(() => {
      setShowCard(true);
      // On déclenche la descente du booster
      setIsDescending(true);

      // On attend que le booster soit suffisamment descendu avant de mettre la carte au premier plan
      setTimeout(() => {
        setShowCardFront(true);
      }, 1000);
    }, 800);
  };

  const handleTitleClick = () => {
    // Simule le clic sur l'image centrale
    handleImageClick(currentIndex);
  };

  useEffect(() => {
    // Ne lance la séquence que si AUTO_ANIMATION est true
    if (!AUTO_ANIMATION || autoplayStarted) return;

    const sequence = async () => {
      // Délai initial de 1.8 secondes
      await new Promise((resolve) => setTimeout(resolve, 1800));

      setAutoplayStarted(true);

      // Attendre 1 seconde après le chargement
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clic à droite
      nextSlide();

      // Attendre 1 seconde
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Premier clic à gauche
      prevSlide();

      // Attendre 1 seconde
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Deuxième clic à gauche
      prevSlide();

      // Attendre 0.8 seconde (modifié de 0.5s)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Clic à droite
      nextSlide();

      // Attendre 1 seconde
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clic sur "Choisissez une soirée"
      setIsExpanded(true);

      // Attendre 2 secondes
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clic sur "Choisir celle-ci"
      setIsTearing(true);
      setShowTitle(false);

      // Attendre que le booster s'ouvre (800ms inchangé)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // La séquence des cartes commence automatiquement
      const showNextCard = async () => {
        // Première carte (Hysta) - Face arrière
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Attendre que la carte se retourne (délai réduit)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Afficher la face avant pendant un temps plus court
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Préparer la carte suivante AVANT que la première parte
        // Pour créer une transition plus fluide
        setShowNVitralCard(true);

        // Très court délai pour que la carte N-Vitral soit chargée mais pas visible
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Faire partir la carte Hysta
        setIsCardLeaving(true);

        // Attendre que la carte commence à partir, mais pas complètement
        await new Promise((resolve) => setTimeout(resolve, 400));

        // Faire apparaître la carte suivante pendant que Hysta part
        setIsNVitralFront(true);

        // Troisième carte (Nosferatu) - même principe
        await new Promise((resolve) => setTimeout(resolve, 4000));
        setShowNosferatuCard(true);
        await new Promise((resolve) => setTimeout(resolve, 100));
        setIsNVitralLeaving(true);
        await new Promise((resolve) => setTimeout(resolve, 400));
        setIsNosferatuFront(true);

        // Quatrième carte (NXD) - carte finale maintenant
        await new Promise((resolve) => setTimeout(resolve, 4000));
        setShowScoobyCard(true);
        await new Promise((resolve) => setTimeout(resolve, 100));
        setIsNosferatuLeaving(true);
        await new Promise((resolve) => setTimeout(resolve, 400));
        setIsScoobyFront(true);

        // On ne fait plus partir la carte NXD et on ne montre plus Banana
        // La carte NXD reste affichée comme dernière carte
      };

      showNextCard();
    };

    sequence();
  }, [autoplayStarted]);

  // Ne rendre le contenu que lorsque les images sont chargées
  if (!imagesLoaded) {
    return null; // ou un loader si vous préférez
  }

  return (
    <div
      className={`h-screen relative overflow-hidden ${
        isTearing ? "tearing" : ""
      }`}
    >
      {/* Gradient du haut */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-600 via-sky-300 via-pink-300 to-pink-600 gradient-section" />

      {/* Fond du bas (2/3) */}
      <div className="absolute top-0 left-0 w-full h-full bg-white white-section" />

      {/* Contenu */}
      <div className="relative z-10 container mx-auto px-4 pt-16 pb-8">
        {showTitle && (
          <div
            className={`season-title shadow-sm ${isExpanded ? "selected" : ""}`}
            onClick={handleTitleClick}
          >
            <h1 className="text-gray-600 text-xl font-normal relative z-10">
              {isExpanded ? "Choisir celle-ci" : "Choisissez une soirée"}
            </h1>
          </div>
        )}

        <div
          className={`carousel-container relative ${
            isExpanded ? "h-[800px]" : "h-[600px]"
          } max-w-3xl mx-auto transition-all duration-500`}
        >
          {/* Première carte (Hysta) */}
          {showCard && (
            <div
              className={`card-reveal first-card ${showCard ? "visible" : ""} ${
                showCardFront ? "booster-down" : ""
              } ${isCardLeaving ? "slide-out" : ""}`}
              style={{
                pointerEvents: showCardFront ? "all" : "none",
                zIndex: 50, // S'assurer que la carte est au-dessus des autres éléments
              }}
            >
              <FlipCard
                frontImageUrl="/image/carte/hysta.png"
                backImageUrl="/image/carte/backside.png"
                className="visible"
                onSecondClick={() => {
                  console.log("Second clic sur la carte Hysta détecté!");
                  setShowNVitralCard(true);
                  setIsCardLeaving(true);
                  setTimeout(() => {
                    setIsNVitralFront(true);
                  }, 800);
                }}
                onFlipComplete={() => {
                  console.log("Carte retournée !");
                }}
                autoFlip={true}
              />
            </div>
          )}

          {/* Deuxième carte (N-Vitral) */}
          {showNVitralCard && (
            <div
              className={`card-reveal ${showNVitralCard ? "visible" : ""} ${
                isNVitralFront ? "booster-down" : ""
              } ${isNVitralLeaving ? "slide-out" : ""}`}
              style={{
                pointerEvents: isNVitralFront ? "all" : "none",
                zIndex: isNVitralFront ? 30 : 4,
              }}
            >
              <HoloCard
                imageUrl="/image/carte/nvitral.png"
                className="visible"
                onSecondClick={() => {
                  setShowNosferatuCard(true);
                  setIsNVitralLeaving(true);
                  setTimeout(() => {
                    setIsNosferatuFront(true);
                  }, 800);
                }}
              />
            </div>
          )}

          {/* Troisième carte (Nosferatu) */}
          {showNosferatuCard && (
            <div
              className={`card-reveal ${showNosferatuCard ? "visible" : ""} ${
                isNosferatuFront ? "booster-down" : ""
              } ${isNosferatuLeaving ? "slide-out" : ""}`}
              style={{
                pointerEvents: isNosferatuFront ? "all" : "none",
                zIndex: isNosferatuFront ? 30 : 4,
              }}
            >
              <HoloCard
                imageUrl="/image/carte/nosferatu.png"
                className="visible"
                onSecondClick={() => {
                  setShowScoobyCard(true);
                  setIsNosferatuLeaving(true);
                  setTimeout(() => {
                    setIsScoobyFront(true);
                  }, 800);
                }}
              />
            </div>
          )}

          {/* Quatrième carte (NXD) - dernière carte maintenant */}
          {showScoobyCard && (
            <div
              className={`card-reveal ${showScoobyCard ? "visible" : ""} ${
                isScoobyFront ? "booster-down" : ""
              } ${isScoobyLeaving ? "slide-out" : ""}`}
              style={{
                pointerEvents: isScoobyFront ? "all" : "none",
                zIndex: isScoobyFront ? 30 : 4,
              }}
            >
              <HoloCard imageUrl="/image/carte/nxd2.png" className="visible" />
            </div>
          )}

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
                      className={`${isTearing ? "tearing" : ""} ${
                        isDescending ? "booster-descend" : ""
                      }`}
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
