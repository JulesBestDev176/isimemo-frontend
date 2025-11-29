import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Edit2, Plus, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, getYear, getMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { EtapePipeline } from '../../models/services/PipelinePeriodes';
import { TypeEtapePipeline, StatutEtape } from '../../models/services/PipelinePeriodes';
import { TypePeriodeValidation } from '../../models/commission/PeriodeValidation';

interface CalendrierAnnuelProps {
  annee: number;
  etapes: EtapePipeline[];
  onDateChange?: (etapeId: string, type: 'debut' | 'fin', nouvelleDate: Date) => void;
  onAjouterPeriode?: (type: TypeEtapePipeline, dateDebut: Date, dateFin: Date, nom?: string) => void;
  onModifierPeriode?: (etapeId: string, dateDebut: Date, dateFin: Date) => void;
}

const CalendrierAnnuel: React.FC<CalendrierAnnuelProps> = ({
  annee,
  etapes,
  onDateChange,
  onAjouterPeriode,
  onModifierPeriode
}) => {
  const [moisActuel, setMoisActuel] = useState(new Date(annee, 0, 1));
  const [showModalAjout, setShowModalAjout] = useState(false);
  const [showModalModification, setShowModalModification] = useState(false);
  const [etapeSelectionnee, setEtapeSelectionnee] = useState<EtapePipeline | null>(null);
  const [dateDebutSelectionnee, setDateDebutSelectionnee] = useState<Date | null>(null);
  const [dateFinSelectionnee, setDateFinSelectionnee] = useState<Date | null>(null);
  const [typePeriode, setTypePeriode] = useState<TypeEtapePipeline | ''>('');
  const [nomPeriode, setNomPeriode] = useState('');

  const joursMois = useMemo(() => {
    const debut = startOfMonth(moisActuel);
    const fin = endOfMonth(moisActuel);
    return eachDayOfInterval({ start: debut, end: fin });
  }, [moisActuel]);

  const premierJourSemaine = useMemo(() => {
    const premierJour = startOfMonth(moisActuel);
    const jourSemaine = getDay(premierJour);
    // Convertir dimanche (0) en 6 pour l'affichage lundi-dimanche
    return jourSemaine === 0 ? 6 : jourSemaine - 1;
  }, [moisActuel]);

  const getCouleurEtape = (statut: string) => {
    switch (statut) {
      case 'ACTIVE':
        return 'bg-primary text-white border-primary';
      case 'TERMINEE':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'PAS_COMMENCEE':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const getEtapesPourDate = (date: Date): EtapePipeline[] => {
    return etapes.filter(etape => {
      if (!etape.dateDebut) return false;
      const dateDebut = new Date(etape.dateDebut);
      const dateFin = etape.dateFin ? new Date(etape.dateFin) : dateDebut;
      
      // Normaliser les dates (sans heures)
      const dateNormalisee = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const debutNormalise = new Date(dateDebut.getFullYear(), dateDebut.getMonth(), dateDebut.getDate());
      const finNormalise = new Date(dateFin.getFullYear(), dateFin.getMonth(), dateFin.getDate());
      
      return dateNormalisee >= debutNormalise && dateNormalisee <= finNormalise;
    });
  };

  const handleAjouterPeriode = () => {
    if (!typePeriode || !dateDebutSelectionnee || !dateFinSelectionnee || !onAjouterPeriode) return;
    
    onAjouterPeriode(
      typePeriode as TypeEtapePipeline,
      dateDebutSelectionnee,
      dateFinSelectionnee,
      nomPeriode || undefined
    );
    
    setShowModalAjout(false);
    setTypePeriode('');
    setNomPeriode('');
    setDateDebutSelectionnee(null);
    setDateFinSelectionnee(null);
  };

  const handleModifierPeriode = () => {
    if (!etapeSelectionnee || !dateDebutSelectionnee || !dateFinSelectionnee || !onModifierPeriode) return;
    
    onModifierPeriode(
      etapeSelectionnee.id,
      dateDebutSelectionnee,
      dateFinSelectionnee
    );
    
    setShowModalModification(false);
    setEtapeSelectionnee(null);
    setDateDebutSelectionnee(null);
    setDateFinSelectionnee(null);
  };

  const handleDateClick = (date: Date) => {
    const etapesDate = getEtapesPourDate(date);
    
    if (etapesDate.length > 0) {
      // Ouvrir modal de modification
      const etape = etapesDate[0];
      setEtapeSelectionnee(etape);
      setDateDebutSelectionnee(etape.dateDebut || new Date());
      setDateFinSelectionnee(etape.dateFin || etape.dateDebut || new Date());
      setShowModalModification(true);
    } else {
      // Ouvrir modal d'ajout avec la date pré-remplie
      setDateDebutSelectionnee(date);
      setDateFinSelectionnee(date);
      setShowModalAjout(true);
    }
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const typesPeriodesDisponibles: { value: TypeEtapePipeline; label: string }[] = [
    { value: TypeEtapePipeline.DEPOT_SUJET_ET_ENCADREMENT, label: 'Dépôt Sujet et Choix d\'Encadrant' },
    { value: TypeEtapePipeline.VALIDATION_SUJETS, label: 'Validation des Sujets' },
    { value: TypeEtapePipeline.PRELECTURE, label: 'Pré-lecture' },
    { value: TypeEtapePipeline.RENSEIGNEMENT_DISPONIBILITE, label: 'Renseignement Disponibilité' },
    { value: TypeEtapePipeline.DEPOT_FINAL, label: 'Dépôt Final' },
    { value: TypeEtapePipeline.SESSION_SOUTENANCE, label: 'Session de Soutenance' },
    { value: TypeEtapePipeline.VALIDATION_CORRECTIONS, label: 'Validation Corrections' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Calendrier {format(moisActuel, 'MMMM yyyy', { locale: fr })}
            </CardTitle>
            <CardDescription>
              Cliquez sur une date pour ajouter ou modifier une période
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMoisActuel(subMonths(moisActuel, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMoisActuel(new Date(annee, 0, 1))}
            >
              {getYear(moisActuel)}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMoisActuel(addMonths(moisActuel, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setDateDebutSelectionnee(new Date());
                setDateFinSelectionnee(new Date());
                setShowModalAjout(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* En-têtes des jours */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((jour, i) => (
            <div key={i} className="text-center text-xs font-medium text-gray-500 py-2">
              {jour}
            </div>
          ))}
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {/* Jours vides au début */}
          {Array.from({ length: premierJourSemaine }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Jours du mois */}
          {joursMois.map((date, index) => {
            const etapesDate = getEtapesPourDate(date);
            const estAujourdhui = date.toDateString() === new Date().toDateString();
            const estDansMois = getMonth(date) === getMonth(moisActuel);

            return (
              <div
                key={index}
                className={`aspect-square border rounded-lg p-1 text-xs relative cursor-pointer transition-colors ${
                  estAujourdhui ? 'ring-2 ring-primary' : ''
                } ${
                  estDansMois ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                }`}
                onClick={() => handleDateClick(date)}
              >
                <div className={`font-medium mb-1 ${estDansMois ? 'text-gray-900' : 'text-gray-400'}`}>
                  {format(date, 'd')}
                </div>
                <div className="space-y-0.5">
                  {etapesDate.slice(0, 2).map((etape, idx) => (
                    <div
                      key={idx}
                      className={`text-[10px] px-1 py-0.5 rounded truncate border ${getCouleurEtape(etape.statut)}`}
                      title={etape.nom}
                    >
                      {etape.nom.substring(0, 12)}
                    </div>
                  ))}
                  {etapesDate.length > 2 && (
                    <div className="text-[10px] text-gray-500 px-1">
                      +{etapesDate.length - 2}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Légende des périodes du mois */}
        {etapes.filter(e => {
          if (!e.dateDebut) return false;
          const moisEtape = getMonth(e.dateDebut);
          return moisEtape === getMonth(moisActuel);
        }).length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold text-sm mb-2">Périodes du mois</h4>
            <div className="space-y-1">
              {etapes
                .filter(e => {
                  if (!e.dateDebut) return false;
                  const moisEtape = getMonth(e.dateDebut);
                  return moisEtape === getMonth(moisActuel);
                })
                .map((etape, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className={`w-3 h-3 rounded border ${getCouleurEtape(etape.statut)}`} />
                    <span className="font-medium">{etape.nom}</span>
                    <span className="text-gray-500 text-xs">
                      ({format(etape.dateDebut || new Date(), 'dd/MM')} - {format(etape.dateFin || etape.dateDebut || new Date(), 'dd/MM')})
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 ml-auto"
                      onClick={() => {
                        setEtapeSelectionnee(etape);
                        setDateDebutSelectionnee(etape.dateDebut || new Date());
                        setDateFinSelectionnee(etape.dateFin || etape.dateDebut || new Date());
                        setShowModalModification(true);
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Modal d'ajout de période */}
      <Dialog open={showModalAjout} onOpenChange={setShowModalAjout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une période</DialogTitle>
            <DialogDescription>
              Créez une nouvelle période dans le calendrier
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="typePeriode">Type de période</Label>
              <Select value={typePeriode} onValueChange={(value) => setTypePeriode(value as TypeEtapePipeline)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  {typesPeriodesDisponibles.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nomPeriode">Nom (optionnel)</Label>
              <Input
                id="nomPeriode"
                placeholder="Nom de la période"
                value={nomPeriode}
                onChange={(e) => setNomPeriode(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateDebutAjout">Date de début</Label>
                <Input
                  id="dateDebutAjout"
                  type="date"
                  value={dateDebutSelectionnee ? formatDateForInput(dateDebutSelectionnee) : ''}
                  onChange={(e) => setDateDebutSelectionnee(new Date(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFinAjout">Date de fin</Label>
                <Input
                  id="dateFinAjout"
                  type="date"
                  value={dateFinSelectionnee ? formatDateForInput(dateFinSelectionnee) : ''}
                  onChange={(e) => setDateFinSelectionnee(new Date(e.target.value))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModalAjout(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleAjouterPeriode}
              disabled={!typePeriode || !dateDebutSelectionnee || !dateFinSelectionnee}
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de modification de période */}
      <Dialog open={showModalModification} onOpenChange={setShowModalModification}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la période</DialogTitle>
            <DialogDescription>
              Modifiez les dates de la période "{etapeSelectionnee?.nom}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Type: {etapeSelectionnee?.nom}</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateDebutModif">Date de début</Label>
                <Input
                  id="dateDebutModif"
                  type="date"
                  value={dateDebutSelectionnee ? formatDateForInput(dateDebutSelectionnee) : ''}
                  onChange={(e) => setDateDebutSelectionnee(new Date(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFinModif">Date de fin</Label>
                <Input
                  id="dateFinModif"
                  type="date"
                  value={dateFinSelectionnee ? formatDateForInput(dateFinSelectionnee) : ''}
                  onChange={(e) => setDateFinSelectionnee(new Date(e.target.value))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModalModification(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleModifierPeriode}
              disabled={!dateDebutSelectionnee || !dateFinSelectionnee}
            >
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CalendrierAnnuel;
