import { motion } from "framer-motion";
import { Memoire } from "../types/memoire";

interface CarteMemoireProps {
  memoire: Memoire;
  onClick: (memoire: Memoire) => void;
}

const CarteMemoire = ({ memoire, onClick }: CarteMemoireProps) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onClick(memoire)}
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Image ou couverture du memoire */}
        <div className="md:w-1/4 bg-gray-100 relative overflow-hidden h-48 md:h-auto">
          {memoire.imageCouverture ? (
            <img 
              src={memoire.imageCouverture} 
              alt={memoire.titre} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-primary-50">
              <span className="material-icons text-primary text-4xl">description</span>
            </div>
          )}
          <div className="absolute top-0 right-0 bg-primary-50 text-primary text-sm font-medium py-1 px-3 m-2 rounded-full">
            {memoire.annee}
          </div>
        </div>
        
        {/* Contenu du memoire */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-2">
              <span className="bg-navy-50 text-navy-700 text-xs font-medium py-1 px-2 rounded">
                {memoire.departement}
              </span>
              <span className="text-xs text-navy-500 ml-3 flex items-center">
                <span className="material-icons text-amber-500 text-sm mr-1">star</span>
                {memoire.mention}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-navy mb-2 line-clamp-2">
              {memoire.titre}
            </h3>
            
            <p className="text-navy-700 mb-4 line-clamp-3">
              {memoire.description}
            </p>
          </div>
          
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {memoire.etiquettes.slice(0, 3).map((etiquette, index) => (
                <span 
                  key={index} 
                  className="bg-primary-50 text-primary-700 text-xs py-1 px-2 rounded-full"
                >
                  {etiquette}
                </span>
              ))}
              {memoire.etiquettes.length > 3 && (
                <span className="text-xs text-navy-500">
                  +{memoire.etiquettes.length - 3}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                  <span className="material-icons text-gray-500 text-sm">person</span>
                </div>
                <span className="text-sm font-medium text-navy">{memoire.auteur}</span>
              </div>
              
              <button 
                className="text-primary hover:text-primary-700 text-sm font-medium flex items-center transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(memoire);
                }}
              >
                Consulter
                <span className="material-icons text-sm ml-1">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CarteMemoire;