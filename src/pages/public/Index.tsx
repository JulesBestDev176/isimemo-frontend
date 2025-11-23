
import Hero from "../../components/Hero";
import Features from "../../components/Features";
import ProjectDescription from "../../components/ProjectDescription";
import Objectives from "../../components/Objectives";
import FunctionalModules from "../../components/FunctionalModules";
import Footer from "../../components/Footer";
import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "ISIMemo - Plateforme intelligente de gestion des mémoires";
  }, []);

  // Animation pour la barre de progression du scroll
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Barre de progression du scroll */}
      <motion.div 
        className="fixed top-16 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-16" // Ajoute un padding-top pour compenser la navbar fixe
      >
        <Hero />
        <ProjectDescription />
        <Features />
        <Objectives />
        <FunctionalModules />
        <Footer />

        {/* Bouton retour en haut */}
        <motion.button
          className="fixed bottom-6 right-6 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-50 hover:bg-primary-700 transition-colors"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp size={24} />
        </motion.button>
      </motion.div>
    </>
  );
};

export default Index;
