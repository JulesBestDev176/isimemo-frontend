import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const MentionsLegales = () => {
  useEffect(() => {
    document.title = "Mentions Légales - ISIMemo";
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow"
      >
        {/* Hero Section */}
        <motion.div
          className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-blue-600 overflow-hidden h-screen flex flex-col justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Cercles décoratifs animés */}
          <motion.div
            className="absolute top-1/4 right-10 w-64 h-64 rounded-full bg-white opacity-10"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute -bottom-20 -left-16 w-80 h-80 rounded-full bg-blue-300 opacity-10"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, 30, 0]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/3 left-1/5 w-24 h-24 rounded-full bg-yellow-200 opacity-20"
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Contenu principal */}
          <div className="container-fluid relative z-10 flex-grow flex flex-col justify-center items-center px-4">
            <div className="max-w-4xl mx-auto text-center mt-16">
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium mb-4">
                  <span className="material-icons text-yellow-200 text-xs mr-1" style={{ verticalAlign: 'middle' }}>
                    business
                  </span>
                  Informations légales
                </span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl xl:text-6xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Mentions <motion.span
                  className="relative inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Légales
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-1 bg-yellow-300"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-blue-50 mb-10 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                Informations légales relatives à l'Institut Supérieur d'Informatique et à la plateforme ISIMemo.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <a href="#content">
                  <motion.button
                    className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-white/90 text-primary-600 font-medium rounded-full shadow-lg flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="material-icons mr-2">description</span>
                    Consulter les mentions
                  </motion.button>
                </a>
                <a href="/contact">
                  <motion.button
                    className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/10 text-white border-2 border-white/30 font-medium rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="material-icons mr-2">contact_support</span>
                    Une question ?
                  </motion.button>
                </a>
              </motion.div>
            </div>
          </div>

          {/* Indicateur de défilement */}
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ 
              opacity: { delay: 1.5, duration: 1 },
              y: { delay: 1.5, duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            onClick={() => {
              const contentElement = document.getElementById('content');
              if (contentElement) {
                contentElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <div className="flex flex-col items-center">
              <span className="text-white text-sm mb-2">Découvrir le contenu</span>
              <span className="material-icons text-white">expand_more</span>
            </div>
          </motion.div>

          {/* Vagues décoratives */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 110" className="fill-white">
              <path d="M0,96L80,85.3C160,75,320,53,480,58.7C640,64,800,96,960,101.3C1120,107,1280,85,1360,74.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>
          </div>
        </motion.div>

        {/* Contenu des mentions légales */}
        <section id="content" className="section py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl font-bold mb-4 text-navy">Nos Informations Légales</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary-300 to-primary rounded-full mx-auto mb-6"></div>
              <p className="text-navy-700">
                Retrouvez toutes les informations légales concernant notre établissement et nos services.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {[
                {
                  icon: "business",
                  title: "Article 1 : Éditeur du site",
                  content: "Le site ISIMemo est édité par l'Institut Supérieur d'Informatique (ISI), établissement d'enseignement supérieur privé agréé. Notre siège social est situé Boulevard de Ziguinchor, Dakar 28110, Sénégal. Vous pouvez nous contacter au +221 33 822 19 81 ou par email à contact@groupeisi.com. La direction de la publication est assurée par la Direction Générale de l'ISI, responsable du contenu éditorial et de la ligne éditoriale du site."
                },
                {
                  icon: "cloud",
                  title: "Article 2 : Hébergement",
                  content: "Le site ISIMemo est hébergé sur des serveurs sécurisés garantissant la disponibilité et la sécurité de nos services. Les informations techniques relatives à l'hébergement sont disponibles sur demande. Notre infrastructure respecte les standards de sécurité et de performance requis pour un service éducatif de qualité. Les données sont stockées dans des centres de données certifiés avec des mesures de sauvegarde appropriées."
                },
                {
                  icon: "copyright",
                  title: "Article 3 : Propriété intellectuelle",
                  content: "L'ensemble de ce site relève de la législation sénégalaise et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques. Les marques ISI et ISIMemo sont des marques déposées. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable."
                },
                {
                  icon: "gavel",
                  title: "Article 4 : Droit applicable et juridiction",
                  content: "Le présent site et les conditions générales qui le régissent sont soumis au droit sénégalais. En cas de litige, les tribunaux de Dakar auront seule compétence. L'établissement est sous la tutelle du Ministère de l'Enseignement Supérieur du Sénégal et respecte toutes les réglementations en vigueur. Nous nous conformons également aux standards internationaux en matière de protection des données et de respect de la vie privée."
                },
                {
                  icon: "security",
                  title: "Article 5 : Responsabilité",
                  content: "L'ISI s'efforce de fournir sur le site ISIMemo des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations. Tous les informations indiquées sur le site ISIMemo sont données à titre indicatif, et sont susceptibles d'évoluer."
                },
                {
                  icon: "contact_mail",
                  title: "Article 6 : Contact et réclamations",
                  content: "Pour toute question relative aux mentions légales, à l'utilisation du site ou pour exercer vos droits, vous pouvez nous contacter par email à contact@groupeisi.com ou par téléphone au +221 33 822 19 81. Notre équipe s'engage à vous répondre dans les meilleurs délais. Pour les réclamations relatives au traitement de vos données personnelles, vous pouvez également vous adresser à l'autorité de contrôle compétente."
                }
              ].map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-8 mb-8 hover:bg-primary-50 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="material-icons text-primary text-xl">{article.icon}</span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold mb-4 text-navy-800">{article.title}</h3>
                      <p className="text-navy-700 leading-relaxed">{article.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Section de contact */}
            <motion.div 
              className="text-center mt-16 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4 text-navy-800">Des questions sur nos mentions légales ?</h3>
                <p className="text-navy-700 mb-6">
                  Notre équipe juridique est à votre disposition pour répondre à toutes vos questions concernant ces mentions légales et nos obligations légales.
                </p>
                <motion.a 
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary-600 transition-all shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="material-icons mr-2">contact_support</span>
                  Nous contacter
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
      <Footer />
    </div>
  );
};

export default MentionsLegales;