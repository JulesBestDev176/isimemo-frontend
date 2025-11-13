import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

// Hook personnalisé pour l'animation de compteur
const useCounter = (end: number, duration: number = 2, delay: number = 0) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, amount: 0.5 });
  
  useEffect(() => {
    if (!inView) return;
    
    let startTime: number | null = null;
    let animationFrame: number;
    
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Attendre le délai avant de commencer
      if (elapsed < delay * 1000) {
        animationFrame = requestAnimationFrame(updateCount);
        return;
      }
      
      const progress = Math.min((elapsed - delay * 1000) / (duration * 1000), 1);
      // Fonction d'easing pour ralentir vers la fin
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easedProgress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, delay, inView]);
  
  return { count, ref: nodeRef };
};

const Hero = () => {
  return (
    <motion.div
      className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-blue-600 overflow-hidden h-auto min-h-[600px] lg:h-screen flex flex-col justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Cercles décoratifs animés */}
      <motion.div
        className="absolute top-1/3 right-10 w-80 h-80 rounded-full bg-white opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-blue-300 opacity-10"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, 30, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-yellow-200 opacity-20"
        animate={{
          y: [0, -50, 0],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-primary-300 opacity-20"
        animate={{
          y: [0, 40, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Contenu principal */}
      <div className="container-fluid relative z-10 flex-grow flex items-center justify-center px-4 md:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center w-full max-w-7xl">
          {/* Partie texte */}
          <motion.div 
            className="order-2 lg:order-1 space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium">
                <span className="material-icons text-yellow-200 text-xs mr-1" style={{ verticalAlign: 'middle' }}>
                  auto_awesome
                </span>
                Plateforme académique innovante
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl xl:text-6xl font-bold mb-4 text-white" 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              ISI<motion.span
                className="relative text-yellow-300"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Memo
                <motion.div
                  className="absolute bottom-1 left-0 w-full h-1 bg-yellow-300/50"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </motion.span>
            </motion.h1>
            
            <motion.h2 
              className="text-xl md:text-2xl font-medium text-blue-50"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Plateforme intelligente de gestion des mémoires
            </motion.h2>
            
            <motion.p 
              className="text-base md:text-lg text-blue-50 mb-6 max-w-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              Consultez, soumettez et découvrez les mémoires des étudiants ISI.
              Sécurisez votre parcours académique avec notre plateforme innovante.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <Link to="/memoires">
                <motion.button
                  className="px-8 py-4 bg-white hover:bg-white/90 text-primary-600 font-medium rounded-full shadow-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="material-icons">search</span>
                  Consulter les mémoires
                </motion.button>
              </Link>
              
              <Link to="#">
                <motion.button
                  className="px-8 py-4 bg-transparent hover:bg-white/10 text-white border-2 border-white/30 font-medium rounded-full flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="material-icons">upload_file</span>
                  Soumettre un mémoire
                </motion.button>
              </Link>
            </motion.div>

            {/* Statistiques rapides */}
            <motion.div
              className="flex justify-center lg:justify-start gap-8 mt-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <div className="flex flex-col items-center lg:items-start">
                {(() => {
                  const { count, ref } = useCounter(100, 2, 0.8);
                  return (
                    <span ref={ref} className="font-bold text-3xl text-white">{count}+</span>
                  );
                })()}
                <span className="text-blue-100 text-sm">Organisations partenaires</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                {(() => {
                  const { count, ref } = useCounter(95, 2, 1);
                  return (
                    <span ref={ref} className="font-bold text-3xl text-white">{count}%</span>
                  );
                })()}
                <span className="text-blue-100 text-sm">Taux de succès</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Partie image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[550px] flex items-center justify-center overflow-visible py-4 lg:py-0"
          >
            {/* Image avec fond décoratif */}
            <div className="relative w-full h-full">
              {/* Fond pour l'image */}
              <motion.div 
                className="absolute inset-0 mx-auto bg-white/10 backdrop-blur-md rounded-2xl w-[90%] md:w-[85%] lg:w-[80%] h-[75%] mt-auto mb-0 top-auto bottom-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />
              
              {/* Image centrale avec positionnement ajusté */}
              <div className="absolute inset-0 flex justify-center items-end">
                <motion.div 
                  className="relative z-10" 
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: 'bottom center' }}
                >
                  <img 
                    src="./assets/images/student.png" 
                    alt="Diplômée ISI" 
                    className="h-[350px] sm:h-[400px] md:h-[450px] lg:h-[580px] object-contain object-bottom"
                    style={{ marginBottom: '0', display: 'block' }}
                  />
                </motion.div>
              </div>
              
              {/* Badges flottants */}
              <motion.div 
                className="absolute top-[50%] right-[-5%] md:right-[-8%] lg:right-[-5%] md:top-[30%] bg-white px-3 py-2 md:px-4 md:py-3 rounded-full shadow-xl z-20 flex items-center gap-1 md:gap-2 text-sm md:text-base scale-90 md:scale-100"
                initial={{ x: 50, opacity: 0 }}
                animate={{ 
                  x: 0, 
                  opacity: 1,
                  y: [0, -10, 0],
                  rotate: [0, 2, 0, -2, 0]
                }}
                transition={{ 
                  x: { duration: 0.6, type: "spring" },
                  opacity: { duration: 0.6 },
                  y: { repeat: Infinity, duration: 3, repeatType: "reverse" },
                  rotate: { repeat: Infinity, duration: 5, repeatType: "reverse" }
                }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <span className="material-icons text-primary text-base md:text-xl">groups</span>
                <span className="font-semibold whitespace-nowrap">+100 organisations partenaires</span>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-[12%] left-[-5%] md:left-[-8%] lg:left-[-5%] bg-white px-3 py-2 md:px-4 md:py-3 rounded-full shadow-xl z-20 flex items-center gap-1 md:gap-2 text-sm md:text-base scale-90 md:scale-100"
                initial={{ y: 50, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  x: [0, 10, 0, -10, 0],
                  scale: [1, 1.05, 1, 1.05, 1]
                }}
                transition={{ 
                  y: { duration: 0.6, type: "spring" },
                  opacity: { duration: 0.6 },
                  x: { repeat: Infinity, duration: 4, repeatType: "reverse" },
                  scale: { repeat: Infinity, duration: 6, repeatType: "reverse" }
                }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <span className="material-icons text-primary text-base md:text-xl">trending_up</span>
                <span className="font-semibold whitespace-nowrap">95% de taux de succès</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bouton de défilement vers le bas */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          opacity: { delay: 1.5, duration: 1 },
          y: { delay: 1.5, duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        onClick={() => {
          // Faire défiler vers la section suivante
          window.scrollTo({ 
            top: window.innerHeight, 
            behavior: 'smooth' 
          });
        }}
      >
        <div className="flex flex-col items-center">
          <span className="text-white text-sm mb-2">Explorer</span>
          <span className="material-icons text-white">expand_more</span>
        </div>
      </motion.div>

      {/* Vagues décoratives au bas du hero */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 110" className="fill-gray-50">
          <path d="M0,96L80,85.3C160,75,320,53,480,58.7C640,64,800,96,960,101.3C1120,107,1280,85,1360,74.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
    </motion.div>
  );
};

export default Hero;