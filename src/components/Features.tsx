
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Soumission intuitive',
    icon: 'upload_file',
    description: 'Déposez facilement votre mémoire avec une interface simple et intuitive.',
    color: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    title: 'Médiathèque intelligente',
    icon: 'search',
    description: 'Recherchez et consultez les mémoires avec des filtres avancés.',
    color: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    title: 'Assistant chatbot',
    icon: 'smart_toy',
    description: 'Bénéficiez d\'une assistance intelligente pour toutes vos questions.',
    color: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    title: 'Validation académique',
    icon: 'verified',
    description: 'Assurez-vous que votre mémoire répond aux exigences académiques.',
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  {
    title: 'Commentaires & retours',
    icon: 'comment',
    description: 'Recevez des retours constructifs pour améliorer votre travail.',
    color: 'bg-red-100',
    iconColor: 'text-red-600'
  },
  {
    title: 'Sécurité & confidentialité',
    icon: 'lock',
    description: 'Vos données sont sécurisées avec les dernières technologies.',
    color: 'bg-teal-100',
    iconColor: 'text-teal-600'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Features = () => {
  return (
    <section className="section bg-white">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.h2 
          className="text-3xl font-bold mb-4 text-navy"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Caractéristiques
        </motion.h2>
        <motion.p 
          className="text-lg text-navy-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Découvrez les fonctionnalités innovantes qui font d'ISIMemo une plateforme unique.
        </motion.p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            className="card p-6 group"
            variants={item}
            whileHover={{ 
              y: -10, 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
            }}
          >
            <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110`}>
              <span className={`material-icons text-3xl ${feature.iconColor}`}>
                {feature.icon}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-navy">{feature.title}</h3>
            <p className="text-navy-700">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Features;
