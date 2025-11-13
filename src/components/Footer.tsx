import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MapPin,
  Mail,
  Phone,
  Clock,
  ChevronRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy text-white pt-16 pb-8">
      <div className="container-fluid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/"
              className="flex items-center gap-2 text-white text-2xl font-bold mb-4"
            >
              <div className="w-10 h-10 bg-white text-navy rounded-md flex items-center justify-center">
                <span className="material-icons">school</span>
              </div>
              <span>
                ISI<span className="text-primary-300">Memo</span>
              </span>
            </Link>
            <p className="text-gray-300 mb-6">
              Plateforme intelligente de gestion des mémoires académiques pour
              l'ISI.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                className="w-10 h-10 bg-navy-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                whileHover={{ y: -3, backgroundColor: "#3c5fa0" }}
              >
                <Facebook size={18} className="text-white" />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 bg-navy-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                whileHover={{ y: -3, backgroundColor: "#3c5fa0" }}
              >
                <Twitter size={18} className="text-white" />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 bg-navy-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                whileHover={{ y: -3, backgroundColor: "#3c5fa0" }}
              >
                <Linkedin size={18} className="text-white" />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 bg-navy-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                whileHover={{ y: -3, backgroundColor: "#3c5fa0" }}
              >
                <Instagram size={18} className="text-white" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold mb-4 border-b border-navy-800 pb-2">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <motion.div whileHover={{ x: 5 }} className="inline-block">
                  <Link
                    to="/"
                    className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} className="text-primary-300" />
                    Accueil
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 5 }} className="inline-block">
                  <Link
                    to="/memoires"
                    className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} className="text-primary-300" />
                    Mémoires
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 5 }} className="inline-block">
                  <Link
                    to="/about"
                    className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} className="text-primary-300" />À
                    propos
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 5 }} className="inline-block">
                  <Link
                    to="https://www.groupeisi.com/"
                    className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} className="text-primary-300" />
                    ISI
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 5 }} className="inline-block">
                  <Link
                    to="/contact"
                    className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} className="text-primary-300" />
                    Contact
                  </Link>
                </motion.div>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-4 border-b border-navy-800 pb-2">
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <motion.div whileHover={{ x: 5 }} className="inline-block">
                  <Link
                    to="/isimemo-hub#soumission"
                    className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} className="text-primary-300" />
                    Soumission de mémoire
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 5 }} className="inline-block">
                  <Link
                    to="/isimemo-hub#consultation"
                    className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} className="text-primary-300" />
                    Consultation
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 5 }} className="inline-block">
                  <Link
                    to="/isimemo-hub#analyse-ia"
                    className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} className="text-primary-300" />
                    Analyse IA
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 5 }} className="inline-block">
                  <Link
                    to="/isimemo-hub#detection-plagiat"
                    className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} className="text-primary-300" />
                    Détection de plagiat
                  </Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ x: 5 }} className="inline-block">
                  <Link
                    to="/isimemo-hub#assistance"
                    className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} className="text-primary-300" />
                    Assistance
                  </Link>
                </motion.div>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-4 border-b border-navy-800 pb-2">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0 mt-1" />
                <span className="text-gray-300">
                  123 Rue de l'ISI, Dakar, Sénégal
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-primary shrink-0 mt-1" />
                <motion.a
                  href="mailto:contact@isimemo.edu"
                  className="text-gray-300 hover:text-primary transition-colors"
                  whileHover={{ x: 2 }}
                >
                  contact@isimemo.edu
                </motion.a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-primary shrink-0 mt-1" />
                <motion.a
                  href="tel:+221331234567"
                  className="text-gray-300 hover:text-primary transition-colors"
                  whileHover={{ x: 2 }}
                >
                  +221 33 123 45 67
                </motion.a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-primary shrink-0 mt-1" />
                <span className="text-gray-300">Lun - Ven: 8h00 - 17h00</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-navy-800 pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-300">
            <p>© {new Date().getFullYear()} ISIMemo. Tous droits réservés.</p>
            <div className="mt-4 md:mt-0 flex gap-4">
              <Link
                to="/mentions-legales"
                className="text-gray-300 hover:text-primary text-sm"
              >
                Mentions légales
              </Link>
              <Link
                to="/politique-confidentialite"
                className="text-gray-300 hover:text-primary text-sm"
              >
                Politique de confidentialité
              </Link>
              <Link
                to="/cgu"
                className="text-gray-300 hover:text-primary text-sm"
              >
                CGU
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
