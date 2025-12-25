import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const PolitiqueConfidentialite = () => {
  useEffect(() => {
    document.title = "Politique de Confidentialité - ISIMemo";
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
                    privacy_tip
                  </span>
                  Protection des données
                </span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl xl:text-6xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Politique de <motion.span
                  className="relative inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Confidentialité
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
                Découvrez comment nous protégeons vos données personnelles et respectons votre vie privée sur la plateforme ISIMemo.
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
                    <span className="material-icons mr-2">shield</span>
                    Consulter la politique
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

        {/* Contenu de la politique de confidentialité */}
        <section id="content" className="section py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl font-bold mb-4 text-navy">Notre Engagement pour votre Vie Privée</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary-300 to-primary rounded-full mx-auto mb-6"></div>
              <p className="text-navy-700">
                Chez ISI, la protection de vos données personnelles est une priorité absolue. Cette politique détaille nos pratiques.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {[
                {
                  icon: "info",
                  title: "Article 1 : Informations collectées",
                  content: "Lorsque vous visitez notre site ou utilisez ISIMemo, nous collectons automatiquement certaines informations sur votre appareil, notamment des informations sur votre navigateur Web, votre adresse IP, votre fuseau horaire et certains des cookies installés sur votre appareil. De plus, lorsque vous naviguez sur le site, nous collectons des informations sur les pages que vous consultez, les sites Web qui vous ont renvoyé au site, et comment vous interagissez avec le site. Nous collectons également les informations que vous nous fournissez directement lors de votre inscription ou utilisation de nos services."
                },
                {
                  icon: "how_to_reg",
                  title: "Article 2 : Utilisation de vos données",
                  content: "Nous utilisons les informations que nous collectons généralement pour fournir, maintenir, et améliorer nos services ISIMemo. Ces informations nous permettent de communiquer avec vous, de personnaliser votre expérience sur la plateforme, d'assurer la sécurité de nos services, et d'améliorer continuellement nos fonctionnalités. Nous utilisons également ces données pour dépister notre site à la recherche de risques et de fraudes potentiels, et plus généralement pour améliorer et optimiser notre site selon les besoins de nos utilisateurs."
                },
                {
                  icon: "share",
                  title: "Article 3 : Partage de vos informations",
                  content: "Nous partageons vos informations personnelles uniquement dans les cas décrits dans cette section. Nous ne vendons, ne louons ni ne divulguons d'une autre manière vos informations personnelles à des tiers à des fins commerciales. Nous pouvons partager vos informations pour nous conformer aux lois et réglementations applicables, pour répondre à une citation à comparaître, à un mandat de perquisition ou à toute autre demande légale d'informations que nous recevons, ou pour protéger nos droits."
                },
                {
                  icon: "security",
                  title: "Article 4 : Sécurité de vos données",
                  content: "Nous prenons la sécurité de vos données personnelles au sérieux et utilisons des mesures de sécurité appropriées pour protéger vos informations contre l'accès, l'altération, la divulgation ou la destruction non autorisés. Nous utilisons le chiffrement SSL pour sécuriser les transmissions de données, nous limitons l'accès aux données personnelles aux employés qui en ont besoin pour exercer leurs fonctions, et nous effectuons régulièrement des audits de sécurité pour identifier et corriger les vulnérabilités potentielles."
                },
                {
                  icon: "account_balance",
                  title: "Article 5 : Vos droits",
                  content: "Vous avez certains droits concernant vos informations personnelles. En fonction de votre lieu de résidence, vous pouvez avoir le droit d'accéder, de corriger, de mettre à jour ou de demander la suppression de vos informations personnelles. Si vous souhaitez examiner, corriger, mettre à jour ou supprimer vos informations personnelles, vous pouvez nous contacter en utilisant les coordonnées fournies ci-dessous. Nous répondrons à votre demande dans un délai raisonnable."
                },
                {
                  icon: "cookie",
                  title: "Article 6 : Cookies et technologies de suivi",
                  content: "Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur notre site, analyser la façon dont notre site est utilisé, et à des fins de marketing. Les cookies sont de petits fichiers de données qui sont placés sur votre ordinateur ou appareil mobile lorsque vous visitez un site Web. Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour vous avertir lorsqu'un cookie est envoyé. Cependant, si vous n'acceptez pas les cookies, vous ne pourrez peut-être pas utiliser certaines parties de notre site."
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
                <h3 className="text-2xl font-bold mb-4 text-navy-800">Des questions sur notre politique ?</h3>
                <p className="text-navy-700 mb-6">
                  Notre équipe est à votre disposition pour répondre à toutes vos questions concernant cette politique de confidentialité et la protection de vos données.
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

export default PolitiqueConfidentialite;