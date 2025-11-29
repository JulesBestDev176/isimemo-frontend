import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  UserMinus,
  Shield,
  Gavel,
  Award,
  CheckCircle,
  XCircle,
  Search
} from 'lucide-react';
import { useAnneesAcademiques } from '../../../hooks/useAnneesAcademiques';
import { useAttributionsRoles, useAttribuerRole, useRetirerRole } from '../../../hooks/useAttributionsRoles';
import { mockProfesseurs } from '../../../models/acteurs/Professeur';
import { TypeRole, getLibelleRole } from '../../../models/services/AttributionRole';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

// Badge Component
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'error';
}> = ({ children, variant = 'info' }) => {
  const styles = {
    success: "bg-primary-50 text-primary-700 border border-primary-200",
    warning: "bg-primary-100 text-primary-800 border border-primary-300",
    info: "bg-primary-50 text-primary-700 border border-primary-200",
    error: "bg-primary-100 text-primary-800 border border-primary-300"
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${styles[variant]}`}>
      {children}
    </span>
  );
};

// Simple Button Component
const SimpleButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  onClick?: () => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
}> = ({ children, variant = 'ghost', onClick, size = 'sm', disabled = false }) => {
  const styles = {
    primary: 'bg-primary text-white border border-primary hover:bg-primary-700 disabled:bg-primary-300',
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-600 border border-transparent hover:bg-gray-50',
    danger: 'bg-primary text-white border border-primary hover:bg-primary-700'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles[variant]} ${sizeStyles[size]} rounded font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {children}
    </button>
  );
};

const RolesChef: React.FC = () => {
  const { anneeActive } = useAnneesAcademiques();
  const { attributions } = useAttributionsRoles(anneeActive?.code);
  const { attribuerRole } = useAttribuerRole();
  const { retirerRole } = useRetirerRole();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<TypeRole | 'ALL'>('ALL');

  // Filtrer les professeurs par recherche
  const professeursFiltres = mockProfesseurs.filter(prof => {
    const matchSearch = searchQuery === '' ||
      prof.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.specialite?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchSearch;
  });

  // Obtenir les rôles d'un professeur pour l'année active
  const getRolesProfesseur = (idProfesseur: number) => {
    if (!anneeActive) return [];
    return attributions.filter(
      a => a.professeur.idProfesseur === idProfesseur && a.estActif
    );
  };

  // Vérifier si un professeur a un rôle spécifique
  const hasRole = (idProfesseur: number, typeRole: TypeRole) => {
    const roles = getRolesProfesseur(idProfesseur);
    return roles.some(r => r.typeRole === typeRole);
  };

  // Handler pour attribuer un rôle
  const handleAttribuerRole = async (idProfesseur: number, typeRole: TypeRole) => {
    if (!anneeActive) return;
    
    if (confirm(`Êtes-vous sûr de vouloir attribuer le rôle "${getLibelleRole(typeRole)}" à ce professeur ?`)) {
      await attribuerRole(idProfesseur, typeRole, anneeActive.code, 2); // 2 = idChefDepartement
      window.location.reload();
    }
  };

  // Handler pour retirer un rôle
  const handleRetirerRole = async (idProfesseur: number, typeRole: TypeRole) => {
    if (!anneeActive) return;
    
    const attribution = attributions.find(
      a => a.professeur.idProfesseur === idProfesseur && a.typeRole === typeRole && a.estActif
    );
    
    if (!attribution) return;
    
    if (confirm(`Êtes-vous sûr de vouloir retirer le rôle "${getLibelleRole(typeRole)}" à ce professeur ?`)) {
      await retirerRole(attribution.idAttribution);
      window.location.reload();
    }
  };

  // Icône pour chaque type de rôle
  const getRoleIcon = (typeRole: TypeRole) => {
    switch (typeRole) {
      case TypeRole.COMMISSION:
        return <Shield className="h-4 w-4" />;
      case TypeRole.JURIE:
        return <Gavel className="h-4 w-4" />;
      case TypeRole.PRESIDENT_JURY_POSSIBLE:
        return <Award className="h-4 w-4" />;
    }
  };

  // Statistiques
  const stats = {
    commission: attributions.filter(a => a.typeRole === TypeRole.COMMISSION && a.estActif).length,
    president: attributions.filter(a => a.typeRole === TypeRole.PRESIDENT_JURY_POSSIBLE && a.estActif).length
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Rôles</h1>
          <p className="text-gray-600 mt-1">
            Attribuez des rôles aux professeurs pour l'année académique {anneeActive?.code || 'en cours'}
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Membres Commission</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.commission}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Possibles Présidents</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.president}</p>
            </div>
            <div className="bg-primary-200 p-3 rounded-lg">
              <Award className="h-8 w-8 text-primary-700" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filtres et Recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un professeur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filtre par rôle */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as TypeRole | 'ALL')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="ALL">Tous les rôles</option>
            <option value={TypeRole.COMMISSION}>Membres Commission</option>
            <option value={TypeRole.PRESIDENT_JURY_POSSIBLE}>Possibles Présidents</option>
          </select>
        </div>
      </motion.div>

      {/* Liste des Professeurs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Professeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade / Spécialité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôles Actuels
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {professeursFiltres.map((professeur) => {
                const roles = getRolesProfesseur(professeur.idProfesseur);
                
                // Filtrer par rôle sélectionné
                if (selectedRole !== 'ALL' && !hasRole(professeur.idProfesseur, selectedRole as TypeRole)) {
                  return null;
                }

                return (
                  <tr key={professeur.idProfesseur} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {professeur.prenom[0]}{professeur.nom[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {professeur.prenom} {professeur.nom}
                          </div>
                          <div className="text-sm text-gray-500">{professeur.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{professeur.grade}</div>
                      <div className="text-sm text-gray-500">{professeur.specialite}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {roles.length === 0 ? (
                          <span className="text-sm text-gray-400">Aucun rôle</span>
                        ) : (
                          roles.map((role) => (
                            <Badge key={role.idAttribution} variant="info">
                              {getRoleIcon(role.typeRole)}
                              <span className="ml-1">{getLibelleRole(role.typeRole)}</span>
                            </Badge>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Select
                        onValueChange={(value) => {
                          if (value === 'AUCUN') {
                            // Retirer tous les rôles
                            roles.forEach(role => {
                              handleRetirerRole(professeur.idProfesseur, role.typeRole);
                            });
                          } else {
                            const typeRole = value as TypeRole;
                            if (hasRole(professeur.idProfesseur, typeRole)) {
                              handleRetirerRole(professeur.idProfesseur, typeRole);
                            } else {
                              handleAttribuerRole(professeur.idProfesseur, typeRole);
                            }
                          }
                        }}
                          >
                        <SelectTrigger className="w-[240px]">
                          <SelectValue placeholder="Gérer les rôles">
                            {roles.length === 0 
                              ? 'Aucun rôle - Cliquez pour ajouter' 
                              : roles.length === 1
                              ? getLibelleRole(roles[0].typeRole)
                              : `${roles.length} rôles`
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {roles.length > 0 && (
                            <SelectItem value="AUCUN">
                              <span className="flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-primary" />
                                Retirer tous les rôles
                              </span>
                            </SelectItem>
                        )}
                          <SelectItem value={TypeRole.COMMISSION}>
                            <span className="flex items-center gap-2">
                              {hasRole(professeur.idProfesseur, TypeRole.COMMISSION) ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-primary" />
                                  <span className="line-through">{getLibelleRole(TypeRole.COMMISSION)}</span>
                                  <span className="text-xs text-gray-500 ml-2">(Retirer)</span>
                                </>
                              ) : (
                                <>
                                  <Shield className="h-4 w-4 text-primary" />
                                  {getLibelleRole(TypeRole.COMMISSION)}
                                  <span className="text-xs text-gray-500 ml-2">(Ajouter)</span>
                                </>
                              )}
                            </span>
                          </SelectItem>
                          <SelectItem value={TypeRole.PRESIDENT_JURY_POSSIBLE}>
                            <span className="flex items-center gap-2">
                              {hasRole(professeur.idProfesseur, TypeRole.PRESIDENT_JURY_POSSIBLE) ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-primary" />
                                  <span className="line-through">{getLibelleRole(TypeRole.PRESIDENT_JURY_POSSIBLE)}</span>
                                  <span className="text-xs text-gray-500 ml-2">(Retirer)</span>
                                </>
                              ) : (
                                <>
                                  <Award className="h-4 w-4 text-primary" />
                                  {getLibelleRole(TypeRole.PRESIDENT_JURY_POSSIBLE)}
                                  <span className="text-xs text-gray-500 ml-2">(Ajouter)</span>
                                </>
                              )}
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default RolesChef;
