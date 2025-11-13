
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Memory } from './MemoryCard';

interface MemoryModalProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
}

const MemoryModal = ({ memory, isOpen, onClose }: MemoryModalProps) => {
  if (!memory) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          as="div"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          open={isOpen}
          onClose={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-auto overflow-hidden"
          >
            <div className="flex justify-end p-4 absolute top-0 right-0 z-10">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-navy transition-colors rounded-full p-1 hover:bg-gray-100"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="bg-primary-50 p-6 flex flex-col items-center justify-center relative">
                {memory.coverImage ? (
                  <img 
                    src={memory.coverImage} 
                    alt={memory.title} 
                    className="w-32 h-44 object-cover rounded shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-44 bg-primary text-white flex items-center justify-center rounded shadow-lg">
                    <span className="material-icons text-5xl">description</span>
                  </div>
                )}
                
                <div className="mt-6 text-center space-y-4 w-full">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="text-navy font-semibold mb-1">Auteur</h4>
                    <p>{memory.author}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="text-navy font-semibold mb-1">Département</h4>
                    <p>{memory.department}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="text-navy font-semibold mb-1">Année</h4>
                    <p>{memory.year}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="text-navy font-semibold mb-1">Mention</h4>
                    <p>{memory.mention}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 md:col-span-2">
                <h2 className="text-2xl font-bold text-navy mb-4">{memory.title}</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">Résumé</h3>
                    <p className="text-navy-700">{memory.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {memory.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {memory.pdfUrl && (
                    <div>
                      <h3 className="text-lg font-semibold text-navy mb-4">Aperçu du document</h3>
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                        {/* Emplacement pour un lecteur PDF ou une prévisualisation */}
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center p-6">
                            <span className="material-icons text-gray-400 text-5xl mb-4">picture_as_pdf</span>
                            <p className="text-gray-500">Aperçu non disponible</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <a 
                          href={memory.pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-primary gap-2"
                        >
                          <span className="material-icons">visibility</span>
                          Consulter le document
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default MemoryModal;
