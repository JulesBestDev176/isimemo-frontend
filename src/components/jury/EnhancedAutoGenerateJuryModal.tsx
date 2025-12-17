import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Calendar,
    Clock,
    GraduationCap,
    Building,
    MapPin,
    AlertTriangle,
    UserX,
    Users,
    Shuffle,
    Gavel,
    FileText,
    UserCheck,
    Star,
    Crown
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Professeur } from '../../models/acteurs/Professeur';
import { DossierMemoire, mockDossiers, StatutDossierMemoire, EtapeDossier } from '../../models/dossier/DossierMemoire';
import { RoleJury } from '../../models/soutenance/MembreJury';
import { useGenerationJurys, PropositionJury } from '../../hooks/useGenerationJurys';
import { getSallesDisponibles } from '../../models/soutenance/Salle';

// Composant utilitaire SimpleButton
const SimpleButton: React.FC<{
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning';
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit';
    icon?: React.ReactNode;
}> = ({ children, variant = 'primary', onClick, disabled = false, type = 'button', icon }) => {
    const styles = {
        primary: `bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        success: `bg-green-600 text-white border border-green-600 hover:bg-green-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        warning: `bg-orange-600 text-white border border-orange-600 hover:bg-orange-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
    };
    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            type={type}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center ${styles[variant]}`}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    );
};

interface EnhancedAutoGenerateJuryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (propositions: PropositionJury[], session: string, niveau: 'licence' | 'master', annee: string) => void;
    userDepartment: string;
}

/**
 * Modal amélioré pour la génération automatique de jury
 * Affiche les salles disponibles, la liste des étudiants avec leurs encadrants,
 * et met en évidence le président du jury.
 */
export const EnhancedAutoGenerateJuryModal: React.FC<EnhancedAutoGenerateJuryModalProps> = ({
    isOpen,
    onClose,
    onGenerate,
    userDepartment
}) => {
    const [anneeAcademique, setAnneeAcademique] = useState('2024-2025');
    const [selectedNiveau, setSelectedNiveau] = useState<'licence' | 'master'>('licence');
    const [selectedSession, setSelectedSession] = useState<string>('');
    const [propositions, setPropositions] = useState<PropositionJury[]>([]);
    const [configError, setConfigError] = useState<string | null>(null);
    const [showStudentsList, setShowStudentsList] = useState(false);

    const { genererPropositions, isGenerating, error } = useGenerationJurys();

    // Récupérer les données nécessaires
    const sallesDisponibles = getSallesDisponibles();
    const dossiersEligibles = mockDossiers.filter(d =>
        d.statut === StatutDossierMemoire.VALIDE &&
        d.etape === EtapeDossier.SOUTENANCE &&
        d.anneeAcademique === anneeAcademique
    );

    // Extraire les encadrants uniques des dossiers
    const encadrantsUniques = new Map<number, Professeur>();
    dossiersEligibles.forEach(d => {
        if (d.encadrant && !encadrantsUniques.has(d.encadrant.idProfesseur)) {
            encadrantsUniques.set(d.encadrant.idProfesseur, d.encadrant);
        }
    });

    useEffect(() => {
        if (isOpen) {
            const anneeActive = '2024-2025';
            setAnneeAcademique(anneeActive);
            const sessionOuverte = 'Septembre';

            if (sessionOuverte) {
                setSelectedSession(sessionOuverte);
                setConfigError(null);
            } else {
                setConfigError("Aucune session de soutenance n'est actuellement ouverte pour l'année en cours.");
            }
            setSelectedNiveau('licence');
            setPropositions([]);
        }
    }, [isOpen]);

    const handlePreview = async () => {
        if (!selectedSession) return;
        const result = await genererPropositions(anneeAcademique, selectedSession, selectedNiveau, userDepartment);
        setPropositions(result);
    };

    const handleConfirm = () => {
        const valides = propositions.filter(p => p.valide);
        if (valides.length === 0) {
            alert("Aucune proposition valide à générer.");
            return;
        }
        onGenerate(valides, selectedSession, selectedNiveau, anneeAcademique);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-gray-200 p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Génération automatique de jury</h2>
                        <p className="text-sm text-gray-600">
                            Département {userDepartment}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {configError ? (
                        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded flex items-center">
                            <X className="h-5 w-5 mr-2" />
                            {configError}
                        </div>
                    ) : (
                        <>
                            {/* Informations de la session */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div>
                                    <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-1">Année Académique</label>
                                    <p className="text-lg font-semibold text-gray-900 flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-900" />
                                        {anneeAcademique}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-1">Session Active</label>
                                    <p className="text-lg font-semibold text-gray-900 flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-gray-900" />
                                        {selectedSession}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-1">Niveau Cible</label>
                                    <p className="text-lg font-semibold text-gray-900 flex items-center">
                                        <GraduationCap className="h-4 w-4 mr-2 text-gray-900" />
                                        Licence 3
                                    </p>
                                </div>
                            </div>

                            {/* Section Salles Disponibles */}
                            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <Building className="h-5 w-5 mr-2 text-gray-900" />
                                    Salles Disponibles ({sallesDisponibles.length})
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {sallesDisponibles.map(salle => (
                                        <div key={salle.idSalle} className="bg-white border border-blue-200 rounded p-3">
                                            <p className="font-medium text-gray-900">{salle.nom}</p>
                                            <p className="text-xs text-gray-900 flex items-center mt-1">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {salle.batiment} - Étage {salle.etage}
                                            </p>
                                            <p className="text-xs text-gray-900 mt-1">Capacité: {salle.capacite} places</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section Étudiants Éligibles */}
                            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-gray-900 flex items-center">
                                        <Users className="h-5 w-5 mr-2 text-gray-900" />
                                        Étudiants Éligibles ({dossiersEligibles.length})
                                    </h3>
                                    <button
                                        onClick={() => setShowStudentsList(!showStudentsList)}
                                        className="text-sm text-gray-900 hover:underline"
                                    >
                                        {showStudentsList ? 'Masquer' : 'Afficher la liste'}
                                    </button>
                                </div>

                                {showStudentsList && (
                                    <div className="mt-3 max-h-60 overflow-y-auto bg-white rounded border border-blue-200">
                                        <table className="w-full text-sm">
                                            <thead className="bg-blue-100 sticky top-0">
                                                <tr>
                                                    <th className="text-left p-2 text-gray-900">Étudiant</th>
                                                    <th className="text-left p-2 text-gray-900">Sujet</th>
                                                    <th className="text-left p-2 text-gray-900">Encadrant</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-blue-100">
                                                {dossiersEligibles.map((dossier, idx) => {
                                                    const candidat = dossier.candidats?.[0];
                                                    return (
                                                        <tr key={idx} className="hover:bg-blue-50">
                                                            <td className="p-2">
                                                                <p className="font-medium text-gray-900">{candidat ? `${candidat.prenom} ${candidat.nom}` : 'N/A'}</p>
                                                                <p className="text-xs text-gray-900">{candidat?.email}</p>
                                                            </td>
                                                            <td className="p-2 max-w-xs">
                                                                <p className="truncate text-gray-900" title={dossier.titre}>{dossier.titre}</p>
                                                            </td>
                                                            <td className="p-2">
                                                                {dossier.encadrant ? (
                                                                    <div className="flex items-center">
                                                                        <UserX className="h-4 w-4 mr-1 text-orange-500" />
                                                                        <span className="text-orange-700">{dossier.encadrant.prenom} {dossier.encadrant.nom}</span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-400">Non assigné</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Avertissement sur les encadrants */}
                                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded flex items-start">
                                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-orange-800">
                                        <p className="font-medium">Règle de conflit d'intérêt</p>
                                        <p>Les {encadrantsUniques.size} encadrant(s) suivant(s) seront automatiquement exclus des jurys de leurs étudiants :
                                            <span className="font-medium"> {Array.from(encadrantsUniques.values()).map(e => `${e.prenom} ${e.nom}`).join(', ')}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Note: Les calculs de dimensionnement restent actifs mais le cadre est enlevé */}

                            <div className="flex justify-end">
                                <SimpleButton onClick={handlePreview} disabled={isGenerating || !selectedSession}>
                                    {isGenerating ? 'Calcul en cours...' : 'Prévisualiser les propositions'}
                                </SimpleButton>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded">
                                    {error}
                                </div>
                            )}

                            {/* Affichage des propositions avec couleurs bleues et icônes React */}
                            {propositions.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900">Propositions de Jurys ({propositions.length})</h3>
                                    {propositions.map((prop, idx) => (
                                        <div key={idx} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-medium text-lg text-gray-900">Jury {idx + 1}</h4>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={prop.valide ? 'secondary' : 'destructive'}>
                                                        {prop.valide ? 'Valide' : 'Invalide'}
                                                    </Badge>
                                                    {prop.salle && (
                                                        <Badge variant="outline">
                                                            <Building className="h-3 w-3 mr-1" />
                                                            {prop.salle.nom}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {!prop.valide && <p className="text-sm text-red-600 mb-3">{prop.messageErreur}</p>}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Membres du jury avec président mis en évidence */}
                                                <div>
                                                    <p className="font-semibold text-gray-900 mb-2">Composition du Jury</p>
                                                    <div className="space-y-2">
                                                        {prop.membres.map((m, i) => {
                                                            const isPresident = m.role === RoleJury.PRESIDENT;
                                                            return (
                                                                <div
                                                                    key={i}
                                                                    className={`flex items-center p-2 rounded ${isPresident ? 'bg-yellow-100 border border-yellow-300' : 'bg-white border border-blue-200'}`}
                                                                >
                                                                    {isPresident ? (
                                                                        <Crown className="h-5 w-5 text-yellow-600 mr-2" />
                                                                    ) : m.role === RoleJury.RAPPORTEUR ? (
                                                                        <FileText className="h-5 w-5 text-gray-900 mr-2" />
                                                                    ) : (
                                                                        <UserCheck className="h-5 w-5 text-gray-900 mr-2" />
                                                                    )}
                                                                    <div>
                                                                        <p className={`font-medium ${isPresident ? 'text-yellow-800' : 'text-gray-900'}`}>
                                                                            {m.professeur.prenom} {m.professeur.nom}
                                                                        </p>
                                                                        <p className="text-xs text-gray-900">
                                                                            {isPresident ? 'Président' : m.role === RoleJury.RAPPORTEUR ? 'Rapporteur' : 'Examinateur'}
                                                                            {' • '}{m.professeur.grade}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Liste des étudiants */}
                                                <div>
                                                    <p className="font-semibold text-gray-900 mb-2">Étudiants ({prop.dossiers.length})</p>
                                                    <div className="space-y-1 max-h-40 overflow-y-auto">
                                                        {prop.dossiers.map((d, i) => {
                                                            const candidat = d.candidats?.[0];
                                                            return (
                                                                <div key={i} className="text-sm bg-white border border-blue-200 rounded p-2">
                                                                    <p className="font-medium text-gray-900">{candidat ? `${candidat.prenom} ${candidat.nom}` : 'N/A'}</p>
                                                                    <p className="text-xs text-gray-900 truncate" title={d.titre}>{d.titre}</p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Horaire et salle */}
                                            {prop.dateSoutenance && (
                                                <div className="mt-3 pt-3 border-t border-blue-200 flex items-center gap-4 text-sm text-gray-900">
                                                    <span className="flex items-center">
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        {prop.dateSoutenance.toLocaleDateString('fr-FR')}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Clock className="h-4 w-4 mr-1" />
                                                        {prop.heureDebut} - {prop.heureFin}
                                                    </span>
                                                    {prop.salle && (
                                                        <span className="flex items-center">
                                                            <MapPin className="h-4 w-4 mr-1" />
                                                            {prop.salle.nom} ({prop.salle.batiment})
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                    <SimpleButton variant="secondary" onClick={onClose}>
                        Annuler
                    </SimpleButton>
                    <SimpleButton
                        variant="primary"
                        onClick={handleConfirm}
                        disabled={propositions.filter(p => p.valide).length === 0}
                        icon={<Shuffle className="h-4 w-4" />}
                    >
                        Valider la génération
                    </SimpleButton>
                </div>
            </motion.div>
        </div>
    );
};

export default EnhancedAutoGenerateJuryModal;
