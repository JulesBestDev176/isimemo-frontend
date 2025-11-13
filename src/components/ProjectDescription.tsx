import { motion } from 'framer-motion';

const ProjectDescription = () => {
  return (
    <section className="section bg-gradient-to-br from-primary-50 to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-navy">Plateforme Intelligente de Gestion des Mémoires Académiques</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-300 to-primary rounded-full mb-6"></div>
            <p className="text-lg text-navy-800 font-medium">
              Une solution innovante pour l'ISI
            </p>
            <p className="text-navy-700">
              ISIMemo est une plateforme web complète qui automatise et optimise la gestion des mémoires académiques à l'ISI. 
              Notre solution utilise des technologies avancées d'intelligence artificielle pour faciliter l'ensemble du processus, 
              de la proposition du sujet jusqu'à la soutenance finale.
            </p>
            <p className="text-navy-700">
              Grâce à ISIMemo, les étudiants, professeurs et administrateurs bénéficient d'un système centralisé qui simplifie 
              la gestion des mémoires tout en créant une base de connaissances précieuse accessible à tous les membres de la communauté académique.
            </p>
            <div className="pt-4">
              <motion.button 
                className="px-8 py-4 bg-primary hover:bg-primary-600 text-white font-medium rounded-full shadow-lg flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
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
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-blue-200 rounded-2xl transform rotate-3 scale-105 opacity-30"></div>
            <div className="relative bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-navy border-b border-primary-100 pb-4 mb-6">
                <span className="material-icons align-middle mr-2 text-primary">lightbulb</span>
                Pourquoi ISIMemo ?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-primary">check_circle</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-800">Centralisation des processus</h4>
                    <p className="text-navy-600">Un système unique pour gérer l'ensemble du cycle de vie des mémoires</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-primary">check_circle</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-800">Intelligence artificielle</h4>
                    <p className="text-navy-600">Analyse avancée et recommandations personnalisées</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-primary">check_circle</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-800">Accessibilité</h4>
                    <p className="text-navy-600">Accès facile à une bibliothèque numérique de connaissances</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-primary">check_circle</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-800">Transparence</h4>
                    <p className="text-navy-600">Suivi en temps réel de l'avancement des mémoires</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDescription;
