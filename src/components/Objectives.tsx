import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';

const objectives = [
  {
    title: 'Digitalisation',
    description: 'Digitaliser et centraliser l\'ensemble du processus de gestion des mémoires',
    icon: 'cloud_upload',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Efficacité administrative',
    description: 'Réduire la charge administrative pour les départements et le personnel académique',
    icon: 'speed',
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Expérience utilisateur',
    description: 'Améliorer l\'expérience des étudiants et encadreurs grâce à un suivi transparent',
    icon: 'people',
    color: 'bg-amber-100 text-amber-600'
  },
  {
    title: 'Bibliothèque numérique',
    description: 'Créer une bibliothèque numérique intelligente des mémoires passés',
    icon: 'menu_book',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Intelligence artificielle',
    description: 'Intégrer des fonctionnalités d\'IA pour l\'analyse et la validation des contenus',
    icon: 'psychology',
    color: 'bg-red-100 text-red-600'
  }
];

const Objectives = () => {
  return (
    <section className="section bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 text-navy">Nos Objectifs</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-300 to-primary rounded-full mx-auto mb-6"></div>
          <p className="text-lg text-navy-700">
            ISIMemo vise à révolutionner la gestion des mémoires académiques grâce à une approche innovante et technologique.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((objective, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-full ${objective.color} flex items-center justify-center mb-4`}>
                    <span className="material-icons text-2xl">{objective.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-navy-800">{objective.title}</h3>
                  <p className="text-navy-700">{objective.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Objectives;
