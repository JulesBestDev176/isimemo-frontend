import React, { useState } from 'react';
import { FileText, Download, Eye, FileCheck, FileX, FileClock, X, Clock } from 'lucide-react';
import { Document, StatutDocument, TypeDocument } from '../../../types/dossier';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface DossierDocumentsProps {
  documents: Document[];
}

const formatDateTime = (date: Date) => {
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getDocumentStatutBadge = (statut: StatutDocument): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (statut) {
    case StatutDocument.VALIDE:
      return 'default';
    case StatutDocument.EN_ATTENTE_VALIDATION:
      return 'secondary';
    case StatutDocument.REJETE:
      return 'destructive';
    case StatutDocument.DEPOSE:
      return 'outline';
    default:
      return 'outline';
  }
};

const getDocumentStatutLabel = (statut: StatutDocument) => {
  const statuts: Record<StatutDocument, string> = {
    [StatutDocument.BROUILLON]: 'Brouillon',
    [StatutDocument.DEPOSE]: 'Déposé',
    [StatutDocument.EN_ATTENTE_VALIDATION]: 'En attente',
    [StatutDocument.VALIDE]: 'Validé',
    [StatutDocument.REJETE]: 'Rejeté',
    [StatutDocument.ARCHIVE]: 'Archivé'
  };
  return statuts[statut] || statut;
};

const getDocumentTypeLabel = (type: TypeDocument) => {
  const types: Record<TypeDocument, string> = {
    [TypeDocument.CHAPITRE]: 'Chapitre',
    [TypeDocument.ANNEXE]: 'Annexe',
    [TypeDocument.FICHE_SUIVI]: 'Fiche de suivi',
    [TypeDocument.DOCUMENT_ADMINISTRATIF]: 'Document administratif',
    [TypeDocument.AUTRE]: 'Autre'
  };
  return types[type] || type;
};

const getDocumentIcon = (statut: StatutDocument) => {
  switch (statut) {
    case StatutDocument.VALIDE:
      return <FileCheck className="h-5 w-5 text-primary" />;
    case StatutDocument.REJETE:
      return <FileX className="h-5 w-5 text-red-600" />;
    case StatutDocument.EN_ATTENTE_VALIDATION:
      return <FileClock className="h-5 w-5 text-orange-600" />;
    default:
      return <FileText className="h-5 w-5 text-primary" />;
  }
};

const DossierDocuments: React.FC<DossierDocumentsProps> = ({ documents }) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
  };

  const handleCloseView = () => {
    setSelectedDocument(null);
  };

  return (
    <>
      <div className="space-y-4">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <Card key={doc.idDocument} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <div className="bg-primary-100 p-2 rounded-lg mr-4">
                      {getDocumentIcon(doc.statut)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-medium text-gray-900">{doc.titre}</p>
                        <Badge variant={getDocumentStatutBadge(doc.statut)}>
                          {getDocumentStatutLabel(doc.statut)}
                        </Badge>
                        <Badge variant="outline">
                          {getDocumentTypeLabel(doc.typeDocument)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        Déposé le {formatDateTime(doc.dateCreation)}
                      </p>
                      {doc.commentaire && (
                        <p className="text-sm text-gray-600 italic">"{doc.commentaire}"</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Voir"
                      onClick={() => handleViewDocument(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Télécharger">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun document déposé</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de visualisation du document */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseView}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* En-tête du modal */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    {getDocumentIcon(selectedDocument.statut)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedDocument.titre}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getDocumentStatutBadge(selectedDocument.statut)}>
                        {getDocumentStatutLabel(selectedDocument.statut)}
                      </Badge>
                      <Badge variant="outline">
                        {getDocumentTypeLabel(selectedDocument.typeDocument)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseView}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Contenu du modal */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {selectedDocument.commentaire && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Commentaire</h3>
                      <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedDocument.commentaire}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Date de dépôt</span>
                      </div>
                      <p className="text-gray-900">{formatDateTime(selectedDocument.dateCreation)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <FileText className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Type de document</span>
                      </div>
                      <p className="text-gray-900">{getDocumentTypeLabel(selectedDocument.typeDocument)}</p>
                    </div>
                  </div>

                  {/* Aperçu du document */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu du document</h3>
                    <div className="border border-gray-200 rounded-lg p-8 bg-gray-50 text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Le document est disponible en téléchargement.
                      </p>
                      <div className="flex justify-center gap-3">
                        <Button
                          onClick={() => {
                            // TODO: Implémenter le téléchargement
                            window.open(selectedDocument.cheminFichier, '_blank');
                          }}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Télécharger le document
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pied du modal */}
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <Button variant="outline" onClick={handleCloseView}>
                  Fermer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DossierDocuments;

