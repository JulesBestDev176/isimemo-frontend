import { motion } from "framer-motion";
import { Memoire } from "../data/memoires.data";

interface CarteMemoireProps {
  memoire: Memoire;
  onClick: (memoire: Memoire) => void;
}

const CarteMemoire = ({ memoire, onClick }: CarteMemoireProps) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 border border-gray-100 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onClick(memoire)}
    >
      <div className="flex flex-row h-full">
        {/* Icône PDF - couleur primaire */}
        <div className="w-20 flex-shrink-0 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <span className="material-icons text-primary text-3xl">picture_as_pdf</span>
            <span className="text-xs text-primary-700 font-medium mt-1">PDF</span>
          </div>
        </div>
        
        {/* Contenu du mémoire - compact */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            {/* En-tête: Département et Année académique */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-navy-50 text-navy-700 text-xs font-medium py-0.5 px-2 rounded">
                {memoire.departement}
              </span>
              <span className="bg-primary-50 text-primary text-xs font-medium py-0.5 px-2 rounded">
                {memoire.annee}
              </span>
            </div>
            
            {/* Titre */}
            <h3 className="text-base font-bold text-navy mb-1 line-clamp-1">
              {memoire.titre}
            </h3>
            
            {/* Description */}
            <p className="text-sm text-navy-700 mb-2 line-clamp-2">
              {memoire.description}
            </p>
          </div>
          
          {/* Bas: Auteur et Formation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Auteur */}
              <div className="flex items-center">
                <span className="material-icons text-gray-400 text-sm mr-1">person</span>
                <span className="text-sm text-navy font-medium">{memoire.auteur}</span>
              </div>
              
              {/* Formation */}
              <div className="hidden sm:flex items-center">
                <span className="material-icons text-gray-400 text-xs mr-1">school</span>
                <span className="text-xs text-gray-600">{memoire.formation}</span>
              </div>
            </div>
            
            <button 
              className="text-primary hover:text-primary-700 text-sm font-medium flex items-center transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onClick(memoire);
              }}
            >
              Consulter
              <span className="material-icons text-sm ml-0.5">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CarteMemoire;