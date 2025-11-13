import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Memoire } from "../types/memoire";
import PdfViewer from "./PdfViewer";

interface AffichageMemoireProps {
  memoire: Memoire;
  onRetour: () => void;
}

const AffichageMemoire = ({ memoire, onRetour }: AffichageMemoireProps) => {
  const [ongletActif, setOngletActif] = useState("resume");
  const [documentActif, setDocumentActif] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const onglets = [
    { id: "resume", label: "Résumé", icone: "article" },
    { id: "contenu", label: "Contenu complet", icone: "menu_book" },
    { id: "documents", label: "Documents", icone: "folder" },
    { id: "contact", label: "Contact", icone: "contact_page" }
  ];

  // Simule des pages de document pour la démonstration
  const totalPages = 5;
  const changePage = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
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
              {/* Image de couverture - Optimisée pour affichage complet */}
              <div className="h-48 bg-gray-100 relative flex items-center justify-center">
                {memoire.imageCouverture ? (
                  <img
                    src={memoire.imageCouverture}
                    alt={memoire.titre}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-primary-50">
                    <span className="material-icons text-primary text-5xl">menu_book</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium py-1 px-3 rounded-full bg-primary">
                      {memoire.annee}
                    </span>
                    <span className="text-white font-medium py-1 px-3 rounded-full bg-primary-600/80">
                      {memoire.mention}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informations sur le memoire */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-navy mb-4">
                  {memoire.titre}
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Auteur</p>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                        <span className="material-icons text-gray-500 text-sm">person</span>
                      </div>
                      <span className="font-medium text-navy">{memoire.auteur}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Superviseur</p>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                        <span className="material-icons text-gray-500 text-sm">school</span>
                      </div>
                      <span className="text-navy">{memoire.superviseur}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Département</p>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center mr-2">
                        <span className="material-icons text-primary text-sm">business</span>
                      </div>
                      <span className="text-navy">{memoire.departement}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Thématiques</p>
                    <div className="flex flex-wrap gap-2">
                      {memoire.etiquettes.map((etiquette, index) => (
                        <span
                          key={index}
                          className="bg-primary-50 text-primary-700 text-xs py-1 px-2 rounded-full"
                        >
                          {etiquette}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contenu principal */}
          <motion.div
            className="md:col-span-2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Navigation par onglets */}
              <div className="flex border-b border-gray-100 overflow-x-auto">
                {onglets.map((onglet) => (
                  <button
                    key={onglet.id}
                    className={`flex items-center py-4 px-6 font-medium transition-colors whitespace-nowrap ${ongletActif === onglet.id
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-navy-500 hover:text-navy hover:bg-gray-50'
                      }`}
                    onClick={() => {
                      setOngletActif(onglet.id);
                      setDocumentActif(null); // Réinitialiser le document actif lors du changement d'onglet
                    }}
                  >
                    <span className="material-icons mr-2 text-sm">{onglet.icone}</span>
                    {onglet.label}
                  </button>
                ))}
              </div>

              {/* Contenu des onglets */}
              <div className="p-6 min-h-[500px]">
                {ongletActif === "resume" && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-navy">Résumé du mémoire</h3>
                    <p className="text-navy-700">
                      {memoire.description}
                    </p>
                  </div>
                )}

                {ongletActif === "contenu" && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-navy">Contenu complet</h3>
                    <div className="prose prose-blue max-w-none text-navy-700">
                      <p>{memoire.contenuComplet}</p>

                      {/* Sections factices pour l'exemple */}
                      <h4 className="text-lg font-semibold mt-6 mb-3">Introduction</h4>
                      <p>Le contenu de l'introduction serait affiché ici avec le contexte du projet, la problématique et les objectifs de recherche.</p>

                      <h4 className="text-lg font-semibold mt-6 mb-3">Méthodologie</h4>
                      <p>La section méthodologie expliquerait l'approche utilisée, les outils et techniques mis en œuvre dans le cadre de cette recherche.</p>

                      <h4 className="text-lg font-semibold mt-6 mb-3">Résultats</h4>
                      <p>Cette section présenterait les résultats obtenus et les analyses effectuées dans le cadre du mémoire.</p>

                      <h4 className="text-lg font-semibold mt-6 mb-3">Conclusion</h4>
                      <p>La conclusion synthétiserait les principaux apports du travail et proposerait des pistes pour des recherches futures.</p>
                    </div>
                  </div>
                )}

                {ongletActif === "documents" && !documentActif && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-navy">Documents associés</h3>
                    <div className="space-y-4">
                      {memoire.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mr-4">
                            <span className="material-icons text-primary">
                              {doc.nom.includes('.pdf') ? 'picture_as_pdf' :
                                doc.nom.includes('.zip') ? 'folder_zip' :
                                  doc.nom.includes('.mp4') ? 'videocam' : 'insert_drive_file'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-navy">{doc.nom}</h4>
                            <p className="text-sm text-gray-500">{doc.nom.split('.').pop()?.toUpperCase() || 'UNKNOWN'}</p>
                          </div>
                          <button
                            onClick={() => setDocumentActif(doc.lien)}
                            className="px-4 py-2 text-primary hover:bg-primary-50 rounded-lg flex items-center transition-colors"
                          >
                            <span className="material-icons mr-1 text-sm">visibility</span>
                            Consulter
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {ongletActif === "documents" && documentActif && (
                  <div>
                    <div className="flex items-center mb-6">
                      <button
                        onClick={() => setDocumentActif(null)}
                        className="mr-4 flex items-center text-primary hover:text-primary-700 transition-colors"
                      >
                        <span className="material-icons mr-1 text-sm">arrow_back</span>
                        Retour aux documents
                      </button>
                      <h3 className="text-xl font-bold text-navy">
                        {memoire.documents.find(doc => doc.lien === documentActif)?.nom || 'Document'}
                      </h3>
                    </div>

                    {/* Visionneuse de document personnalisée et sécurisée */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {documentActif.includes('.pdf') ? (
                        <div className="w-full bg-gray-100 rounded-lg">
                          {/* Solution complète avec contrôles fonctionnels */}
                          <PdfViewer documentActif={documentActif} />
                          <div className="px-4 py-3 bg-primary-50 text-sm text-primary-700 flex items-center">
                            <span className="material-icons text-sm mr-2">info</span>
                            Ce document est protégé et peut uniquement être consulté en ligne. La copie et le téléchargement ne sont pas autorisés.
                          </div>
                        </div>
                      ) : documentActif.includes('.mp4') ? (
                        <div className="w-full">
                          {/* Lecteur vidéo avec contrôles limités */}
                          <div className="relative">
                            <video
                              controls
                              controlsList="nodownload nofullscreen"
                              className="w-full rounded-lg"
                              src={documentActif}
                              onContextMenu={(e) => e.preventDefault()}
                            >
                              Votre navigateur ne supporte pas la lecture de vidéos.
                            </video>
                            {/* Filigrane en surimpression */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none select-none">
                              <span className="text-white text-2xl font-bold rotate-45">ISIMemo</span>
                            </div>
                          </div>
                          <div className="px-4 py-3 bg-primary-50 text-sm text-primary-700 flex items-center">
                            <span className="material-icons text-sm mr-2">info</span>
                            Cette vidéo est protégée et peut uniquement être visionnée en ligne. Le téléchargement n'est pas autorisé.
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <div className="w-20 h-20 mx-auto bg-primary-50 rounded-full flex items-center justify-center mb-4">
                            <span className="material-icons text-primary text-2xl">
                              {documentActif.includes('.zip') ? 'folder_zip' : 'insert_drive_file'}
                            </span>
                          </div>
                          <h4 className="font-medium text-navy mb-2">
                            {memoire.documents.find(doc => doc.lien === documentActif)?.nom || 'Document'}
                          </h4>
                          <p className="text-gray-500 mb-4">Ce type de document ne peut pas être prévisualisé directement dans l'application.</p>
                          <p className="text-sm text-gray-500 mb-6">
                            Pour consulter ce document, veuillez contacter l'administrateur de la plateforme.
                          </p>
                          <div className="px-4 py-3 bg-primary-50 text-sm text-primary-700 flex items-center justify-center rounded-lg">
                            <span className="material-icons text-sm mr-2">lock</span>
                            Accès restreint pour protéger les droits de propriété intellectuelle.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {ongletActif === "contact" && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-navy">Contacter l'auteur</h3>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                          <span className="material-icons text-blue-500">email</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-navy mb-1">Email</h4>
                          <a
                            href={`mailto:${memoire.contact.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {memoire.contact.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mr-4">
                          <span className="material-icons text-green-500">phone</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-navy mb-1">Téléphone</h4>
                          <a
                            href={`tel:${memoire.contact.telephone}`}
                            className="text-navy-700"
                          >
                            {memoire.contact.telephone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                          <span className="material-icons text-blue-500">link</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-navy mb-1">LinkedIn</h4>
                          <a
                            href={`https://${memoire.contact.linkedin}`}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {memoire.contact.linkedin}
                          </a>
                        </div>
                      </div>

                      {/* Formulaire de contact */}
                      <div className="mt-8 pt-6 border-t border-gray-100">
                        <h4 className="text-lg font-semibold mb-4">Envoyer un message</h4>
                        <form className="space-y-4">
                          <div>
                            <label htmlFor="nom" className="block text-sm font-medium text-navy-700 mb-1">
                              Votre nom
                            </label>
                            <input
                              type="text"
                              id="nom"
                              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Entrez votre nom"
                            />
                          </div>

                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-navy-700 mb-1">
                              Votre email
                            </label>
                            <input
                              type="email"
                              id="email"
                              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Entrez votre email"
                            />
                          </div>

                          <div>
                            <label htmlFor="message" className="block text-sm font-medium text-navy-700 mb-1">
                              Message
                            </label>
                            <textarea
                              id="message"
                              rows={4}
                              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Votre message pour l'auteur"
                            ></textarea>
                          </div>

                          <button
                            type="submit"
                            className="bg-primary hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center"
                          >
                            <span className="material-icons mr-2 text-sm">send</span>
                            Envoyer le message
                          </button>
                        </form>
                      </div>
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