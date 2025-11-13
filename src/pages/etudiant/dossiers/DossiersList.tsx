import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search,
  Plus,
  Clock,
  Folder,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { DossierMemoire, StatutDossierMemoire, EtapeDossier } from '../../../types/dossier';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

interface DossiersListProps {
  dossiers: DossierMemoire[];
  onDossierClick: (dossierId: number) => void;
}

const getStatutLabel = (statut: StatutDossierMemoire) => {
  const statuts: Record<StatutDossierMemoire, string> = {
    [StatutDossierMemoire.EN_CREATION]: 'En création',
    [StatutDossierMemoire.EN_COURS]: 'En cours',
    [StatutDossierMemoire.EN_ATTENTE_VALIDATION]: 'En attente',
    [StatutDossierMemoire.VALIDE]: 'Validé',
    [StatutDossierMemoire.DEPOSE]: 'Déposé',
    [StatutDossierMemoire.SOUTENU]: 'Soutenu'
  };
  return statuts[statut] || statut;
};

const getStatutBadgeVariant = (statut: StatutDossierMemoire): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (statut) {
    case StatutDossierMemoire.EN_COURS:
      return 'default';
    case StatutDossierMemoire.VALIDE:
    case StatutDossierMemoire.SOUTENU:
      return 'default';
    case StatutDossierMemoire.EN_ATTENTE_VALIDATION:
      return 'secondary';
    case StatutDossierMemoire.DEPOSE:
      return 'outline';
    default:
      return 'outline';
  }
};

const getEtapeLabel = (etape: EtapeDossier) => {
  const etapes: Record<EtapeDossier, string> = {
    [EtapeDossier.CHOIX_SUJET]: 'Choix du sujet',
    [EtapeDossier.VALIDATION_SUJET]: 'Validation du sujet',
    [EtapeDossier.EN_COURS_REDACTION]: 'Rédaction en cours',
    [EtapeDossier.DEPOT_INTERMEDIAIRE]: 'Dépôt intermédiaire',
    [EtapeDossier.DEPOT_FINAL]: 'Dépôt final',
    [EtapeDossier.SOUTENANCE]: 'Soutenance',
    [EtapeDossier.TERMINE]: 'Terminé'
  };
  return etapes[etape] || etape;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

const DossiersList: React.FC<DossiersListProps> = ({ dossiers, onDossierClick }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDossiers = useMemo(() => {
    if (!searchQuery.trim()) return dossiers;
    
    const query = searchQuery.toLowerCase();
    return dossiers.filter(dossier => 
      dossier.titre.toLowerCase().includes(query) ||
      dossier.description.toLowerCase().includes(query) ||
      (dossier.anneeAcademique && dossier.anneeAcademique.toLowerCase().includes(query))
    );
  }, [dossiers, searchQuery]);

  // Séparer les dossiers en cours et terminés
  const dossiersEnCours = filteredDossiers.filter(d => 
    d.statut === StatutDossierMemoire.EN_COURS || 
    d.statut === StatutDossierMemoire.EN_CREATION
  );
  const dossiersTermines = filteredDossiers.filter(d => 
    d.statut !== StatutDossierMemoire.EN_COURS && 
    d.statut !== StatutDossierMemoire.EN_CREATION
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Dossiers</h1>
              <p className="text-gray-600 mt-1">
                {user?.estCandidat ? 'Gérez vos dossiers de mémoire en tant que candidat' : 'Consultez vos dossiers de mémoire'}
              </p>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un dossier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Dossiers en cours */}
        {dossiersEnCours.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Dossiers en cours
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dossiersEnCours.map((dossier, index) => (
                <motion.div
                  key={dossier.idDossierMemoire}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary"
                    onClick={() => onDossierClick(dossier.idDossierMemoire)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="bg-primary-100 rounded-lg p-2">
                          <Folder className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant={getStatutBadgeVariant(dossier.statut)}>
                          {getStatutLabel(dossier.statut)}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{dossier.titre}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {dossier.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Étape</span>
                          <Badge variant="outline">{getEtapeLabel(dossier.etape)}</Badge>
                        </div>
                        {dossier.anneeAcademique && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Année</span>
                            <span className="text-gray-900">{dossier.anneeAcademique}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Créé le</span>
                          <span className="text-gray-900">{formatDate(dossier.dateCreation)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Dossiers terminés */}
        {dossiersTermines.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              Dossiers terminés
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dossiersTermines.map((dossier, index) => (
                <motion.div
                  key={dossier.idDossierMemoire}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-all duration-200"
                    onClick={() => onDossierClick(dossier.idDossierMemoire)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="bg-gray-100 rounded-lg p-2">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <Badge variant={getStatutBadgeVariant(dossier.statut)}>
                          {getStatutLabel(dossier.statut)}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{dossier.titre}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {dossier.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Étape</span>
                          <Badge variant="outline">{getEtapeLabel(dossier.etape)}</Badge>
                        </div>
                        {dossier.anneeAcademique && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Année</span>
                            <span className="text-gray-900">{dossier.anneeAcademique}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Créé le</span>
                          <span className="text-gray-900">{formatDate(dossier.dateCreation)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Aucun dossier */}
        {filteredDossiers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'Aucun dossier trouvé' : 'Aucun dossier'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? 'Essayez avec d\'autres mots-clés'
                  : user?.estCandidat 
                    ? 'Vous n\'avez pas encore de dossier de mémoire en cours'
                    : 'Vous n\'avez actuellement aucun dossier de mémoire'}
              </p>
              {!searchQuery && user?.estCandidat && (
                <Button onClick={() => {/* TODO: Créer un nouveau dossier */}}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un nouveau dossier
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DossiersList;

