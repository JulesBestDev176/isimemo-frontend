
import { motion } from 'framer-motion';

export interface Memory {
  id: number;
  title: string;
  author: string;
  year: number;
  mention: string;
  department: string;
  description: string;
  coverImage: string;
  pdfUrl?: string;
  tags: string[];
}

interface MemoryCardProps {
  memory: Memory;
  onClick: (memory: Memory) => void;
}

const MemoryCard = ({ memory, onClick }: MemoryCardProps) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(memory)}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 bg-primary-50 flex items-center justify-center p-4">
          {memory.coverImage ? (
            <img 
              src={memory.coverImage} 
              alt={memory.title} 
              className="w-24 h-32 object-cover rounded shadow"
            />
          ) : (
            <div className="w-24 h-32 bg-primary text-white flex items-center justify-center rounded shadow">
              <span className="material-icons text-4xl">description</span>
            </div>
          )}
        </div>
        
        <div className="p-6 md:w-3/4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">{memory.year}</span>
            <span className="bg-primary-100 text-primary text-xs px-2 py-1 rounded-full">
              {memory.mention}
            </span>
          </div>
          
          <h3 className="text-lg font-bold mb-2 text-navy-900">{memory.title}</h3>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <span className="material-icons text-sm">person</span>
              <span>{memory.author}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="material-icons text-sm">school</span>
              <span>{memory.department}</span>
            </div>
          </div>
          
          <p className="text-navy-700 text-sm line-clamp-2 mb-4">
            {memory.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {memory.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {memory.tags.length > 3 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{memory.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MemoryCard;
