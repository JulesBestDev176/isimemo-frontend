import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CGU = () => {
  useEffect(() => {
    document.title = "Conditions Générales d'Utilisation - ISIMemo";
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
                    gavel
                  </span>
                  Cadre juridique
                </span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl xl:text-6xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Conditions Générales <motion.span
                  className="relative inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  d'Utilisation
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
                Découvrez les conditions qui régissent l'utilisation de notre plateforme ISIMemo et nos services numériques pour l'enseignement supérieur.
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
                    Consulter les CGU
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

          {/* Vagues décoratives au bas du hero */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 110" className="fill-white">
              <path d="M0,96L80,85.3C160,75,320,53,480,58.7C640,64,800,96,960,101.3C1120,107,1280,85,1360,74.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>
          </div>
        </motion.div>

        {/* Contenu des CGU */}
        <section id="content" className="section py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl font-bold mb-4 text-navy">Nos Engagements</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary-300 to-primary rounded-full mx-auto mb-6"></div>
              <p className="text-navy-700">
                Ces conditions générales d'utilisation définissent les règles et modalités d'usage de notre plateforme.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {[
                {
                  icon: "policy",
                  title: "Article 1 : Objet",
                  content: "Les présentes CGU ou Conditions Générales d'Utilisation encadrent juridiquement l'utilisation des services du site ISI (ci-après dénommé « le site »). Constituant le contrat entre la société ISI, l'Utilisateur, l'accès au site doit être précédé de l'acceptation de ces CGU. L'accès à cette plateforme signifie l'acceptation des présentes CGU."
                },
                {
                  icon: "wifi",
                  title: "Article 2 : Accès au site",
                  content: "Le site est accessible gratuitement en tout lieu à tout utilisateur ayant un accès à Internet. Tous les frais pour accéder au service (matériel informatique, logiciels, connexion Internet, etc.) sont à la charge de l'utilisateur. Le site se réserve le droit de refuser l'accès au service, unilatéralement et sans notification préalable, à tout utilisateur ne respectant pas les présentes conditions d'utilisation."
                },
                {
                  icon: "copyright",
                  title: "Article 3 : Propriété intellectuelle",
                  content: "Les marques, logos, ainsi que les contenus du site ISI (illustrations, textes, vidéos, audios, photographies) sont protégés par le Code de la propriété intellectuelle et par le droit d'auteur. La reproduction et la copie des contenus par l'Utilisateur requièrent une autorisation préalable du site. À défaut, l'Utilisateur s'expose à des poursuites judiciaires."
                },
                {
                  icon: "security",
                  title: "Article 4 : Responsabilité",
                  content: "Bien que les informations publiées sur le site soient réputées fiables, le site se réserve la faculté d'une non-garantie de la fiabilité des sources. Les informations diffusées sur le site ISI sont présentées à titre purement informatif et sont sans valeur contractuelle. En dépit des mises à jour régulières, la responsabilité du site ne peut être engagée en cas de modification des dispositions administratives et juridiques apparaissant après la publication."
                },
                {
                  icon: "account_circle",
                  title: "Article 5 : Données personnelles",
                  content: "Les informations demandées à l'inscription au site sont nécessaires et obligatoires pour la création du compte de l'utilisateur. En particulier, l'adresse électronique pourra être utilisée par le site pour l'administration, la gestion et l'animation du service. Le site assure à l'utilisateur un droit d'opposition, d'accès et de rectification sur les données nominatives le concernant."
                },
                {
                  icon: "update",
                  title: "Article 6 : Évolution des CGU",
                  content: "Le site se réserve le droit de modifier les clauses de ces CGU à tout moment et sans justification. L'utilisateur sera informé de ces modifications par une notification sur le site. Les CGU modifiées prennent effet dès leur mise en ligne et s'appliquent aux utilisateurs dès leur prochaine connexion."
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
                <h3 className="text-2xl font-bold mb-4 text-navy-800">Des questions sur nos CGU ?</h3>
                <p className="text-navy-700 mb-6">
                  Notre équipe juridique est à votre disposition pour répondre à toutes vos questions concernant ces conditions générales d'utilisation.
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

export default CGU;