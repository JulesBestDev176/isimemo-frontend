import { motion } from "framer-motion";
import { useState } from "react";
import { Memoire } from "../data/memoires.data";

interface AffichageMemoireProps {
  memoire: Memoire;
  onRetour: () => void;
}

const AffichageMemoire = ({ memoire, onRetour }: AffichageMemoireProps) => {
  const [ongletActif, setOngletActif] = useState("resume");
  
  // État pour le formulaire de contact
  const [formContact, setFormContact] = useState({
    nom: "",
    email: "",
    message: ""
  });
  const [envoiReussi, setEnvoiReussi] = useState(false);

  const onglets = [
    { id: "resume", label: "Résumé", icone: "article" },
    { id: "document", label: "Document PDF", icone: "picture_as_pdf" },
    { id: "contact", label: "Contact", icone: "contact_page" }
  ];

  // Gestion du changement des champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormContact(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Envoi du message via mailto: - envoie à tous les membres du groupe
  const handleEnvoyerMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formContact.nom || !formContact.email || !formContact.message) {
      alert("Veuillez remplir tous les champs du formulaire.");
      return;
    }

    // Récupérer tous les emails des contacts (pour les groupes)
    const tousLesEmails = memoire.contacts.map(c => c.email).join(',');
    const nomsAuteurs = memoire.contacts.map(c => c.nom).join(' & ');

    // Créer le sujet et le corps du mail
    const sujet = encodeURIComponent(`[ISI Mémoires] Message de ${formContact.nom} concernant : ${memoire.titre}`);
    const corps = encodeURIComponent(
      `Bonjour ${nomsAuteurs},\n\n` +
      `Vous avez reçu un message concernant votre mémoire "${memoire.titre}".\n\n` +
      `--- Message ---\n` +
      `${formContact.message}\n\n` +
      `--- Expéditeur ---\n` +
      `Nom: ${formContact.nom}\n` +
      `Email: ${formContact.email}\n\n` +
      `---\n` +
      `Ce message a été envoyé via la plateforme ISI Mémoires.`
    );

    // Ouvrir le client mail avec tous les destinataires
    const mailtoUrl = `mailto:${tousLesEmails}?subject=${sujet}&body=${corps}`;
    window.open(mailtoUrl, '_blank');

    // Afficher message de succès
    setEnvoiReussi(true);
    
    // Réinitialiser le formulaire après 3 secondes
    setTimeout(() => {
      setFormContact({ nom: "", email: "", message: "" });
      setEnvoiReussi(false);
    }, 3000);
  };

  return (
    <div className="container-fluid py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* En-tete avec bouton retour */}
        <div className="flex items-center mb-8">
          <button
            onClick={onRetour}
            className="mr-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <span className="material-icons">arrow_back</span>
          </button>
          <h1 className="text-2xl font-bold text-navy">Consultation du mémoire</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar avec infos du memoire */}
          <motion.div
            className="md:col-span-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              {/* Image de couverture - Icône PDF */}
              <div className="h-48 bg-gradient-to-br from-primary-50 to-primary-100 relative flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-icons text-primary text-6xl">picture_as_pdf</span>
                </div>
                <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                  PDF
                </div>
              </div>
              
              {/* Informations */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-navy mb-2 line-clamp-2">
                  {memoire.titre}
                </h2>
                <p className="text-gray-600 mb-4">Par {memoire.auteur}</p>

                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <span className="material-icons text-primary text-lg mr-2">school</span>
                    <span className="text-gray-700">{memoire.formation}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="material-icons text-primary text-lg mr-2">business</span>
                    <span className="text-gray-700">{memoire.departement}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="material-icons text-primary text-lg mr-2">calendar_today</span>
                    <span className="text-gray-700">{memoire.annee}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {memoire.etiquettes.slice(0, 4).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary-50 text-primary text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bouton PDF */}
                <div className="mt-6">
                  <a 
                    href={memoire.cheminFichier}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-primary hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <span className="material-icons mr-2 text-sm">visibility</span>
                    Consulter le PDF
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contenu principal avec onglets */}
          <motion.div
            className="md:col-span-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              {/* Navigation par onglets */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  {onglets.map((onglet) => (
                    <button
                      key={onglet.id}
                      onClick={() => setOngletActif(onglet.id)}
                      className={`flex-1 py-4 px-6 flex items-center justify-center font-medium transition-colors ${
                        ongletActif === onglet.id
                          ? "text-primary border-b-2 border-primary bg-primary-50"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="material-icons mr-2 text-sm">{onglet.icone}</span>
                      {onglet.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contenu des onglets */}
              <div className="p-6">
                {ongletActif === "resume" && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-navy">Résumé du mémoire</h3>
                    <div className="prose prose-blue max-w-none">
                      <p className="text-navy-700 leading-relaxed whitespace-pre-line">
                        {memoire.resume || memoire.description}
                      </p>
                    </div>
                  </div>
                )}

                {ongletActif === "document" && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-navy">Document PDF</h3>
                    <div className="mb-4 flex justify-between items-center">
                      <p className="text-gray-600">
                        Visualisez le document complet ci-dessous
                      </p>
                      <a
                        href={memoire.cheminFichier}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-700 flex items-center transition-colors"
                      >
                        <span className="material-icons mr-1 text-sm">open_in_new</span>
                        Ouvrir dans un nouvel onglet
                      </a>
                    </div>
                    
                    {/* Visionneuse PDF intégrée */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                      <object
                        data={memoire.cheminFichier}
                        type="application/pdf"
                        className="w-full h-[600px]"
                      >
                        <div className="p-8 text-center">
                          <div className="w-20 h-20 mx-auto bg-primary-50 rounded-full flex items-center justify-center mb-4">
                            <span className="material-icons text-primary text-3xl">picture_as_pdf</span>
                          </div>
                          <p className="text-gray-600 mb-4">
                            Impossible d'afficher le PDF directement dans le navigateur.
                          </p>
                          <a
                            href={memoire.cheminFichier}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-primary hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                          >
                            <span className="material-icons mr-2">open_in_new</span>
                            Ouvrir le PDF
                          </a>
                        </div>
                      </object>
                    </div>
                    
                    <div className="mt-4 px-4 py-3 bg-blue-50 text-sm text-blue-700 flex items-center rounded-lg">
                      <span className="material-icons text-sm mr-2">info</span>
                      Ce document peut être consulté en ligne. Pour une meilleure expérience, ouvrez-le dans un nouvel onglet.
                    </div>
                  </div>
                )}

                {ongletActif === "contact" && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-navy">
                      Contacter {memoire.contacts.length > 1 ? "les auteurs" : "l'auteur"}
                    </h3>
                    
                    {/* Afficher tous les contacts */}
                    <div className="space-y-6">
                      {memoire.contacts.map((contact, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <h4 className="font-semibold text-navy mb-3 flex items-center">
                            <span className="material-icons text-primary mr-2">person</span>
                            {contact.nom}
                          </h4>
                          <div className="space-y-2 ml-8">
                            {/* Email */}
                            <div className="flex items-center">
                              <span className="material-icons text-blue-500 text-sm mr-2">email</span>
                              <a
                                href={`mailto:${contact.email}`}
                                className="text-blue-600 hover:underline text-sm"
                              >
                                {contact.email}
                              </a>
                            </div>
                            {/* Téléphone */}
                            <div className="flex items-center">
                              <span className="material-icons text-green-500 text-sm mr-2">phone</span>
                              <a
                                href={`tel:${contact.telephone.replace(/\s/g, '')}`}
                                className="text-green-600 hover:underline text-sm"
                              >
                                {contact.telephone}
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>



                    {/* Formulaire de contact */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <h4 className="text-lg font-semibold mb-4">Envoyer un message</h4>
                      
                      {/* Message de succès */}
                      {envoiReussi && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
                          <span className="material-icons mr-2">check_circle</span>
                          <span>Votre client mail s'est ouvert avec le message pré-rempli{memoire.contacts.length > 1 ? ` pour les ${memoire.contacts.length} destinataires` : ''}.</span>
                        </div>
                      )}
                      
                      <form onSubmit={handleEnvoyerMessage} className="space-y-4">
                        <div>
                          <label htmlFor="nom" className="block text-sm font-medium text-navy-700 mb-1">
                            Votre nom <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="nom"
                            value={formContact.nom}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Entrez votre nom"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-navy-700 mb-1">
                            Votre email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={formContact.email}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Entrez votre email"
                          />
                        </div>

                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-navy-700 mb-1">
                            Message <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="message"
                            rows={4}
                            value={formContact.message}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Votre message pour l'auteur"
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          className="bg-primary hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center"
                        >
                          <span className="material-icons mr-2 text-sm">send</span>
                          Envoyer {memoire.contacts.length > 1 ? `aux ${memoire.contacts.length} auteurs` : "le message"}
                        </button>
                      </form>
                      

                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AffichageMemoire;