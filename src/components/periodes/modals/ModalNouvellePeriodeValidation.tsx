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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { TypePeriodeValidation } from '../../../models/commission/PeriodeValidation';

interface ModalNouvellePeriodeValidationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: { type: TypePeriodeValidation; dateDebut: string; dateFin?: string }) => void;
  etapeAModifier?: { type: TypePeriodeValidation; dateDebut: Date; dateFin?: Date } | null;
}

const ModalNouvellePeriodeValidation: React.FC<ModalNouvellePeriodeValidationProps> = ({
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
  
  const [type, setType] = useState<TypePeriodeValidation | ''>(etapeAModifier?.type || '');
  const [dateDebut, setDateDebut] = useState(etapeAModifier ? formatDateForInput(etapeAModifier.dateDebut) : '');
  const [dateFin, setDateFin] = useState(etapeAModifier?.dateFin ? formatDateForInput(etapeAModifier.dateFin) : '');
  
  // Réinitialiser les champs quand le modal s'ouvre avec une nouvelle étape
  useEffect(() => {
    if (open && etapeAModifier) {
      setType(etapeAModifier.type);
      setDateDebut(formatDateForInput(etapeAModifier.dateDebut));
      setDateFin(etapeAModifier.dateFin ? formatDateForInput(etapeAModifier.dateFin) : '');
    } else if (open && !etapeAModifier) {
      setType('');
      setDateDebut('');
      setDateFin('');
    }
  }, [open, etapeAModifier]);

  const handleSubmit = () => {
    if (type && dateDebut) {
      onCreate({ 
        type: type as TypePeriodeValidation, 
        dateDebut, 
        dateFin: dateFin || undefined 
      });
      // Reset form
      setType('');
      setDateDebut('');
      setDateFin('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isModification ? 'Modifier la période de validation' : 'Créer une nouvelle période de validation'}</DialogTitle>
          <DialogDescription>
            {isModification ? 'Modifiez les informations de la période de validation' : 'Définissez une période pour la validation des sujets ou des corrections'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="typePeriode">Type de période</Label>
            <Select value={type} onValueChange={(value) => setType(value as TypePeriodeValidation)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TypePeriodeValidation.VALIDATION_SUJETS}>Validation des Sujets</SelectItem>
                <SelectItem value={TypePeriodeValidation.VALIDATION_CORRECTIONS}>Validation des Corrections</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateDebutPeriode">Date de début</Label>
              <Input 
                id="dateDebutPeriode" 
                type="date" 
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFinPeriode">Date de fin (optionnel)</Label>
              <Input 
                id="dateFinPeriode" 
                type="date" 
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={!type || !dateDebut}>
            {isModification ? 'Modifier' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNouvellePeriodeValidation;

