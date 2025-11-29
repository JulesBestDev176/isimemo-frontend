import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

interface ModalNouvelleSessionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: { nom: string; dateDebut: string; dateFin: string; typeSession?: string }) => void;
  etapeAModifier?: { nom: string; dateDebut: Date; dateFin: Date; typeSession?: string } | null;
}

const ModalNouvelleSession: React.FC<ModalNouvelleSessionProps> = ({
  open,
  onOpenChange,
  onCreate,
  etapeAModifier
}) => {
  const isModification = !!etapeAModifier;
  
  // Formater une date pour l'input type="date"
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  const [nom, setNom] = useState(etapeAModifier?.nom || '');
  const [dateDebut, setDateDebut] = useState(etapeAModifier ? formatDateForInput(etapeAModifier.dateDebut) : '');
  const [dateFin, setDateFin] = useState(etapeAModifier ? formatDateForInput(etapeAModifier.dateFin) : '');
  const [typeSession, setTypeSession] = useState(etapeAModifier?.typeSession || '');
  
  // Réinitialiser les champs quand le modal s'ouvre avec une nouvelle étape
  useEffect(() => {
    if (open && etapeAModifier) {
      setNom(etapeAModifier.nom);
      setDateDebut(formatDateForInput(etapeAModifier.dateDebut));
      setDateFin(formatDateForInput(etapeAModifier.dateFin));
      setTypeSession(etapeAModifier.typeSession || '');
    } else if (open && !etapeAModifier) {
      setNom('');
      setDateDebut('');
      setDateFin('');
      setTypeSession('');
    }
  }, [open, etapeAModifier]);

  const handleSubmit = () => {
    if (nom && dateDebut && dateFin) {
      onCreate({ 
        nom, 
        dateDebut, 
        dateFin,
        typeSession: typeSession || undefined
      });
      setNom('');
      setDateDebut('');
      setDateFin('');
      setTypeSession('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isModification ? 'Modifier la session de soutenance' : 'Créer une nouvelle session de soutenance'}</DialogTitle>
          <DialogDescription>
            {isModification ? 'Modifiez les informations de la session de soutenance' : 'Définissez la période de la session de soutenance'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nomSession">Nom de la session</Label>
            <Input 
              id="nomSession" 
              placeholder="Session Juin 2025" 
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="typeSession">Type de session (optionnel)</Label>
            <Input 
              id="typeSession" 
              placeholder="Juin, Septembre, Décembre, Spéciale" 
              value={typeSession}
              onChange={(e) => setTypeSession(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateDebut">Date de début</Label>
              <Input 
                id="dateDebut" 
                type="date" 
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFin">Date de fin</Label>
              <Input 
                id="dateFin" 
                type="date" 
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={!nom || !dateDebut || !dateFin}>
            {isModification ? 'Modifier' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNouvelleSession;

