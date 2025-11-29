import React, { useState } from 'react';
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

interface ModalNouvelleAnneeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: { code: string; libelle: string; dateDebut: string; dateFin: string }) => void;
}

const ModalNouvelleAnnee: React.FC<ModalNouvelleAnneeProps> = ({
  open,
  onOpenChange,
  onCreate
}) => {
  const [code, setCode] = useState('');
  const [libelle, setLibelle] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  const handleSubmit = () => {
    if (code && libelle && dateDebut && dateFin) {
      onCreate({ code, libelle, dateDebut, dateFin });
      // Reset form
      setCode('');
      setLibelle('');
      setDateDebut('');
      setDateFin('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle année académique</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle année académique
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input 
              id="code" 
              placeholder="2025-2026" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="libelle">Libellé</Label>
            <Input 
              id="libelle" 
              placeholder="Année académique 2025-2026" 
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
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
          <Button onClick={handleSubmit} disabled={!code || !libelle || !dateDebut || !dateFin}>
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNouvelleAnnee;

