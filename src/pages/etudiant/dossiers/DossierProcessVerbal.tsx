import React from 'react';
import { FileText, Calendar, Award, CheckCircle, Users, Download, UserCheck, AlertCircle } from 'lucide-react';
import { ProcessVerbal, Mention } from '../../../models/soutenance/ProcessVerbal';
import { RoleJury } from '../../../models/soutenance/MembreJury';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

interface DossierProcessVerbalProps {
  processVerbal: ProcessVerbal;
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

const formatDateTime = (date: Date) => {
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getMentionLabel = (mention: Mention) => {
  const mentions: Record<Mention, string> = {
    [Mention.TRES_BIEN]: 'Très Bien',
    [Mention.BIEN]: 'Bien',
    [Mention.ASSEZ_BIEN]: 'Assez Bien',
    [Mention.PASSABLE]: 'Passable'
  };
  return mentions[mention] || mention;
};

const getMentionColor = (mention: Mention) => {
  switch (mention) {
    case Mention.TRES_BIEN:
      return 'bg-primary-100 text-primary-700 border-primary-300';
    case Mention.BIEN:
      return 'bg-primary-100 text-primary-700 border-primary-300';
    case Mention.ASSEZ_BIEN:
      return 'bg-primary-100 text-primary-700 border-primary-300';
    case Mention.PASSABLE:
      return 'bg-primary-100 text-primary-700 border-primary-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

const getRoleJuryLabel = (role: RoleJury) => {
  const roles: Record<RoleJury, string> = {
    [RoleJury.PRESIDENT]: 'Président',
    [RoleJury.RAPPORTEUR]: 'Rapporteur',
    [RoleJury.EXAMINATEUR]: 'Examinateur',
    [RoleJury.ENCADRANT]: 'Encadrant'
  };
  return roles[role] || role;
};

// Fonction pour générer et télécharger le PDF du procès-verbal
const generatePDF = async (processVerbal: ProcessVerbal) => {
  // Import dynamique de jsPDF pour éviter les problèmes de chargement
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Fonction pour ajouter une nouvelle page si nécessaire
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Fonction pour ajouter du texte avec gestion du retour à la ligne
  const addText = (text: string, fontSize: number, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    
    const maxWidth = pageWidth - 2 * margin;
    const lines = doc.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * 0.5;
    const totalHeight = lines.length * lineHeight;
    
    // Vérifier si on a besoin d'une nouvelle page
    if (yPosition + totalHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
    
    lines.forEach((line: string) => {
      // Vérifier à nouveau avant chaque ligne (au cas où on a changé de page)
      if (yPosition + lineHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
    
    yPosition += 5; // Espacement après le texte
    // Réinitialiser la couleur du texte à noir par défaut
    doc.setTextColor(0, 0, 0);
  };

  // En-tête
  doc.setFillColor(59, 130, 246); // Couleur primary (bleu)
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('PROCÈS-VERBAL DE SOUTENANCE', pageWidth / 2, 25, { align: 'center' });
  
  yPosition = 50;

  // Informations du mémoire
  if (processVerbal.soutenance?.dossierMemoire) {
    addText('Sujet du mémoire:', 12, true);
    addText(processVerbal.soutenance.dossierMemoire.titre, 11);
    if (processVerbal.soutenance.dossierMemoire.description) {
      addText(processVerbal.soutenance.dossierMemoire.description, 10, false, [100, 100, 100]);
    }
    yPosition += 5;
  }

  // Ligne de séparation
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Date de soutenance
  addText('Date de soutenance:', 12, true);
  const dateStr = formatDate(processVerbal.dateSoutenance);
  addText(dateStr, 11);
  if (processVerbal.soutenance) {
    addText(`Heure: ${processVerbal.soutenance.heureDebut} - ${processVerbal.soutenance.heureFin}`, 10, false, [100, 100, 100]);
  }
  yPosition += 5;

  // Note et mention
  addText('Note et mention:', 12, true);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text(`${processVerbal.noteFinale.toFixed(1)}/20`, margin, yPosition);
  yPosition += 8;
  addText(`Mention: ${getMentionLabel(processVerbal.mention)}`, 11);
  yPosition += 10;

  // Ligne de séparation
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Membres du jury
  if (processVerbal.membresJury && processVerbal.membresJury.length > 0) {
    addText('Membres du jury:', 12, true);
    processVerbal.membresJury.forEach((membre) => {
      const nomComplet = membre.professeur 
        ? `${membre.professeur.prenom} ${membre.professeur.nom}`
        : 'Membre du jury';
      const role = getRoleJuryLabel(membre.roleJury);
      addText(`• ${nomComplet} - ${role}`, 10);
      if (membre.professeur?.email) {
        addText(`  ${membre.professeur.email}`, 9, false, [100, 100, 100]);
      }
    });
    yPosition += 5;
  }

  // Ligne de séparation
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Observations
  if (processVerbal.observations) {
    addText('Observations:', 12, true);
    addText(processVerbal.observations, 10);
    yPosition += 5;
  }

  // Appréciations
  if (processVerbal.appreciations) {
    addText('Appréciations du jury:', 12, true);
    addText(processVerbal.appreciations, 10);
    yPosition += 5;
  }

  // Demandes de modifications
  if (processVerbal.demandesModifications) {
    checkPageBreak(30);
    doc.setDrawColor(255, 165, 0); // Orange
    doc.setFillColor(255, 248, 220); // Orange clair
    doc.roundedRect(margin, yPosition - 5, pageWidth - 2 * margin, 25, 3, 3, 'FD');
    
    addText('Demandes de modifications:', 11, true, [255, 140, 0]);
    addText(processVerbal.demandesModifications, 10);
    yPosition += 10;
  }

  // Ligne de séparation
  checkPageBreak(20);
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Informations complémentaires
  addText('Informations du document:', 12, true);
  addText(`Date de création: ${formatDateTime(processVerbal.dateCreation)}`, 10, false, [100, 100, 100]);
  addText(`Statut: ${processVerbal.estSigne ? 'Signé' : 'En attente de signature'}`, 10, false, [100, 100, 100]);
  if (processVerbal.dateSignature) {
    addText(`Date de signature: ${formatDateTime(processVerbal.dateSignature)}`, 10, false, [100, 100, 100]);
  }
  addText(`Nombre de signatures: ${processVerbal.nombreSignatures}`, 10, false, [100, 100, 100]);

  // Pied de page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} sur ${totalPages} - ISIMemo - Procès-verbal de soutenance`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Générer le nom du fichier
  const dateStrFile = processVerbal.dateSoutenance.toISOString().split('T')[0];
  const fileName = `Proces-Verbal-Soutenance-${dateStrFile}.pdf`;

  // Télécharger le PDF
  doc.save(fileName);
};

const DossierProcessVerbal: React.FC<DossierProcessVerbalProps> = ({ processVerbal }) => {
  return (
    <div className="space-y-6">
      {/* En-tête du procès-verbal */}
      <Card className="border-primary-200 bg-primary-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-100 rounded-lg p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Procès-Verbal de Soutenance</CardTitle>
                <CardDescription>
                  Document officiel de la soutenance du mémoire
                </CardDescription>
              </div>
            </div>
            {processVerbal.estSigne && (
              <Badge variant="default" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Signé
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Date de soutenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {formatDate(processVerbal.dateSoutenance)}
            </p>
            {processVerbal.soutenance && (
              <p className="text-sm text-gray-600 mt-2">
                {processVerbal.soutenance.heureDebut} - {processVerbal.soutenance.heureFin}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Note et mention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-bold text-gray-900">
                {processVerbal.noteFinale.toFixed(1)}/20
              </p>
              <Badge 
                variant="outline" 
                className={`${getMentionColor(processVerbal.mention)} border-2`}
              >
                {getMentionLabel(processVerbal.mention)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Observations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Observations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-line">
            {processVerbal.observations}
          </p>
        </CardContent>
      </Card>

      {/* Appréciations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appréciations du jury</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-line">
            {processVerbal.appreciations}
          </p>
        </CardContent>
      </Card>

      {/* Membres du jury */}
      {processVerbal.membresJury && processVerbal.membresJury.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Membres du jury
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processVerbal.membresJury.map((membre) => (
                <div key={membre.idMembre} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 rounded-full p-2">
                      <UserCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {membre.professeur 
                          ? `${membre.professeur.prenom} ${membre.professeur.nom}`
                          : 'Membre du jury'
                        }
                      </p>
                      {membre.professeur?.email && (
                        <p className="text-sm text-gray-600">{membre.professeur.email}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-300">
                    {getRoleJuryLabel(membre.roleJury)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demandes de modifications */}
      {processVerbal.demandesModifications && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-orange-900">
              <AlertCircle className="h-5 w-5" />
              Demandes de modifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-line">
              {processVerbal.demandesModifications}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Informations complémentaires */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations du document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Date de création</span>
              <span className="font-medium">{formatDateTime(processVerbal.dateCreation)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Statut</span>
              <Badge variant={processVerbal.estSigne ? 'default' : 'secondary'}>
                {processVerbal.estSigne ? 'Signé' : 'En attente de signature'}
              </Badge>
            </div>
            {processVerbal.dateSignature && (
              <div className="flex justify-between">
                <span className="text-gray-600">Date de signature</span>
                <span className="font-medium">{formatDateTime(processVerbal.dateSignature)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => {
                generatePDF(processVerbal).catch(console.error);
              }}
            >
              <Download className="h-4 w-4" />
              Télécharger le PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DossierProcessVerbal;

