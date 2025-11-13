
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section className="section bg-gradient-to-br from-primary-50 to-blue-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-navy">Notre Plateforme</h2>
          <p className="text-lg text-navy-800">
            ISIMemo est née d'une vision claire : numériser, centraliser et optimiser la gestion des mémoires à l'ISI. 
          </p>
          <p className="text-navy-700">
            Notre plateforme combine technologie de pointe et intelligence artificielle pour offrir une expérience utilisateur sans précédent. 
            Grâce à nos algorithmes avancés, nous facilitons la recherche, la consultation et la soumission des mémoires académiques.
          </p>
          <p className="text-navy-700">
            L'innovation est au cœur de notre démarche. Nous utilisons les dernières avancées en matière d'IA pour analyser la pertinence des sujets, 
            recommander des encadreurs, détecter le plagiat et indexer sémantiquement les contenus.
          </p>
          <div className="pt-4">
            <motion.button 
              className="btn-primary gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-icons">info</span>
              En savoir plus
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white p-8 rounded-xl shadow-xl"
        >
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-navy border-b border-primary-100 pb-4">
              Objectifs de notre plateforme
            </h3>
            
            {[
              { 
                title: 'Centralisation', 
                desc: 'Regrouper tous les mémoires académiques en un seul endroit sécurisé et accessible.',
                icon: 'hub'
              },
              { 
                title: 'Innovation', 
                desc: 'Apporter des solutions technologiques avancées pour la gestion des travaux académiques.',
                icon: 'lightbulb'
              },
              { 
                title: 'Accessibilité', 
                desc: 'Permettre un accès facile aux connaissances pour tous les étudiants et chercheurs.',
                icon: 'accessibility'
              },
              { 
                title: 'Excellence', 
                desc: 'Promouvoir la qualité et l\'originalité dans les travaux de recherche académique.',
                icon: 'emoji_events'
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * index }}
              >
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-primary">{item.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-navy">{item.title}</h4>
                  <p className="text-navy-700">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
