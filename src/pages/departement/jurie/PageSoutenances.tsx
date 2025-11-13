import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Video, ChevronLeft, ChevronRight, MessageSquare, Users, Edit, FileText, Search, Filter, Calendar, ArrowDown, ArrowUp, Clock } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '../../components/ui/calendar';
import { Link } from 'react-router-dom';

// Interface pour les soutenances
interface Soutenance {
  id: number;
  titre: string;
  date: Date;
  heureDebut: string;
  heureFin: string;
  lieu: string;
  modalite: "presentiel" | "ligne";
  etudiant: {
    nom: string;
    prenom: string;
    email: string;
    niveau: string;
    specialite: string;
    photo?: string;
  };
  jury: {
    nom: string;
    role: string;
    institution: string;
  }[];
  memoire: {
    titre: string;
    fichier: string;
    etat: "brouillon" | "soumis" | "valide" | "soutenu";
  };
  statut: "programmee" | "terminee" | "reportee" | "annulee";
  note?: number;
  feedback?: string;
}

const soutenances: Soutenance[] = [
  {
    id: 1,
    titre: "Soutenance - Aminata Diallo",
    date: new Date(2025, 4, 20),
    heureDebut: "09:00",
    heureFin: "11:00",
    lieu: "Amphithéâtre B",
    modalite: "presentiel",
    etudiant: {
      nom: "Diallo",
      prenom: "Aminata",
      email: "a.diallo@isi.sn",
      niveau: "Master 2",
      specialite: "Systèmes d'Information",
    },
    jury: [
      { nom: "Dr. Mbaye", role: "Président", institution: "ISI" },
      { nom: "Prof. Diop", role: "Rapporteur", institution: "ISI" },
      { nom: "Dr. Sow", role: "Examinateur", institution: "UCAD" }
    ],
    memoire: {
      titre: "Optimisation des systèmes distribués pour les applications bancaires",
      fichier: "memoire-diallo.pdf",
      etat: "valide"
    },
    statut: "programmee"
  },
  {
    id: 2,
    titre: "Soutenance - Omar Ndiaye",
    date: new Date(2025, 4, 18),
    heureDebut: "14:00",
    heureFin: "16:00",
    lieu: "Zoom (ID: 765-432-109)",
    modalite: "ligne",
    etudiant: {
      nom: "Ndiaye",
      prenom: "Omar",
      email: "o.ndiaye@isi.sn",
      niveau: "Licence 3",
      specialite: "Réseaux et Télécommunications",
    },
    jury: [
      { nom: "Dr. Fall", role: "Président", institution: "ISI" },
      { nom: "Prof. Sarr", role: "Rapporteur", institution: "ISI" },
      { nom: "Dr. Diouf", role: "Examinateur", institution: "EPT" }
    ],
    memoire: {
      titre: "Sécurisation des réseaux IoT en environnement industriel",
      fichier: "memoire-ndiaye.pdf",
      etat: "valide"
    },
    statut: "programmee"
  },
  {
    id: 3,
    titre: "Soutenance - Fatou Mbaye",
    date: new Date(2025, 4, 15),
    heureDebut: "10:00",
    heureFin: "12:00",
    lieu: "Salle de conférence C",
    modalite: "presentiel",
    etudiant: {
      nom: "Mbaye",
      prenom: "Fatou",
      email: "f.mbaye@isi.sn",
      niveau: "Master 2",
      specialite: "Intelligence Artificielle",
    },
    jury: [
      { nom: "Prof. Diop", role: "Président", institution: "ISI" },
      { nom: "Dr. Ndiaye", role: "Rapporteur", institution: "ISI" },
      { nom: "Dr. Ly", role: "Examinateur", institution: "UCAD" }
    ],
    memoire: {
      titre: "Détection d'anomalies dans les systèmes de santé par deep learning",
      fichier: "memoire-mbaye.pdf",
      etat: "soutenu"
    },
    statut: "terminee",
    note: 18,
    feedback: "Excellente présentation et projet très innovant. Publication recommandée."
  },
  {
    id: 4,
    titre: "Soutenance - Moussa Seck",
    date: new Date(2025, 4, 12),
    heureDebut: "11:00",
    heureFin: "13:00",
    lieu: "Google Meet",
    modalite: "ligne",
    etudiant: {
      nom: "Seck",
      prenom: "Moussa",
      email: "m.seck@isi.sn",
      niveau: "Licence 3",
      specialite: "Génie Logiciel",
    },
    jury: [
      { nom: "Dr. Sarr", role: "Président", institution: "ISI" },
      { nom: "Prof. Diop", role: "Rapporteur", institution: "ISI" },
      { nom: "Dr. Fall", role: "Examinateur", institution: "ISI" }
    ],
    memoire: {
      titre: "Méthodologies Agiles adaptées au contexte africain",
      fichier: "memoire-seck.pdf",
      etat: "soutenu"
    },
    statut: "terminee",
    note: 16,
    feedback: "Très bonne recherche avec des applications pratiques intéressantes."
  }
];

const PageSoutenances: React.FC = () => {
  const [dateActuelle, setDateActuelle] = useState<Date>(new Date());
  const [filtre, setFiltre] = useState<string>("toutes");
  const [tri, setTri] = useState<string>("date");
  const [triDirection, setTriDirection] = useState<"asc" | "desc">("asc");
  const [recherche, setRecherche] = useState<string>("");
  
  // Filtrer les soutenances
  const soutenancesFiltrees = soutenances.filter(soutenance => {
    // Appliquer le filtre de statut
    if (filtre !== "toutes" && soutenance.statut !== filtre) {
      return false;
    }
    
    // Appliquer la recherche
    if (recherche) {
      const termeRecherche = recherche.toLowerCase();
      return (
        soutenance.titre.toLowerCase().includes(termeRecherche) ||
        soutenance.etudiant.nom.toLowerCase().includes(termeRecherche) ||
        soutenance.etudiant.prenom.toLowerCase().includes(termeRecherche) ||
        soutenance.memoire.titre.toLowerCase().includes(termeRecherche)
      );
    }
    
    return true;
  });
  
  // Trier les soutenances
  const soutenancesTriees = [...soutenancesFiltrees].sort((a, b) => {
    let resultatComparaison = 0;
    
    if (tri === "date") {
      resultatComparaison = a.date.getTime() - b.date.getTime();
    } else if (tri === "etudiant") {
      resultatComparaison = `${a.etudiant.nom} ${a.etudiant.prenom}`.localeCompare(`${b.etudiant.nom} ${b.etudiant.prenom}`);
    } else if (tri === "niveau") {
      resultatComparaison = a.etudiant.niveau.localeCompare(b.etudiant.niveau);
    }
    
    return triDirection === "asc" ? resultatComparaison : -resultatComparaison;
  });
  
  // Navigation dans le calendrier
  const gererMoisPrecedent = () => {
    setDateActuelle(subMonths(dateActuelle, 1));
  };
  
  const gererMoisSuivant = () => {
    setDateActuelle(addMonths(dateActuelle, 1));
  };
  
  // Changer la direction du tri
  const changerTriDirection = () => {
    setTriDirection(triDirection === "asc" ? "desc" : "asc");
  };
  
  // Couleur en fonction du statut
  const obtenirCouleurStatut = (statut: string) => {
    switch(statut) {
      case "programmee": return "bg-blue-100 text-blue-800";
      case "terminee": return "bg-green-100 text-green-800";
      case "reportee": return "bg-amber-100 text-amber-800";
      case "annulee": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Libellé en fonction du statut
  const obtenirLibelleStatut = (statut: string) => {
    switch(statut) {
      case "programmee": return "Programmée";
      case "terminee": return "Terminée";
      case "reportee": return "Reportée";
      case "annulee": return "Annulée";
      default: return statut;
    }
  };
  
  // Couleur en fonction de la modalité
  const obtenirCouleurModalite = (modalite: string) => {
    return modalite === "ligne" ? "bg-indigo-100 text-indigo-800" : "bg-teal-100 text-teal-800";
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestion des soutenances</h1>
        <div className="space-x-2">
          <Button asChild variant="default">
            <Link to="/calendrier/ajouter">
              Planifier une soutenance
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Calendrier</CardTitle>
                <div className="flex space-x-1">
                  <Button variant="outline" size="icon" onClick={gererMoisPrecedent}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={gererMoisSuivant}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {format(dateActuelle, 'MMMM yyyy', { locale: fr })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={dateActuelle}
                onSelect={(date) => date && setDateActuelle(date)}
                className="rounded-md border w-full"
                month={dateActuelle}
                classNames={{
                  months: "w-full",
                  month: "w-full",
                  table: "w-full border-collapse",
                  head_cell: "text-muted-foreground rounded-md w-10 font-normal text-sm",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50"
                }}
              />
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => setDateActuelle(new Date())}
              >
                Aujourd'hui
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Recherche</label>
                <div className="relative mt-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="pl-9"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Statut</label>
                <Select 
                  value={filtre} 
                  onValueChange={setFiltre}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Toutes les soutenances" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toutes">Toutes les soutenances</SelectItem>
                    <SelectItem value="programmee">Programmées</SelectItem>
                    <SelectItem value="terminee">Terminées</SelectItem>
                    <SelectItem value="reportee">Reportées</SelectItem>
                    <SelectItem value="annulee">Annulées</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Trier par</label>
                <div className="flex mt-1">
                  <Select 
                    value={tri} 
                    onValueChange={setTri}
                  >
                    <SelectTrigger className="rounded-r-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="etudiant">Étudiant</SelectItem>
                      <SelectItem value="niveau">Niveau</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    className="rounded-l-none border-l-0"
                    onClick={changerTriDirection}
                  >
                    {triDirection === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total:</span>
                  <Badge variant="outline">{soutenances.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Programmées:</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {soutenances.filter(s => s.statut === "programmee").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Terminées:</span>
                  <Badge className="bg-green-100 text-green-800">
                    {soutenances.filter(s => s.statut === "terminee").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">En présentiel:</span>
                  <Badge className="bg-teal-100 text-teal-800">
                    {soutenances.filter(s => s.modalite === "presentiel").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">En ligne:</span>
                  <Badge className="bg-indigo-100 text-indigo-800">
                    {soutenances.filter(s => s.modalite === "ligne").length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <Tabs defaultValue="liste">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="liste">Liste</TabsTrigger>
              <TabsTrigger value="cartes">Cartes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="liste">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="mr-2 h-5 w-5 text-green-500" />
                    Soutenances
                  </CardTitle>
                  <CardDescription>
                    {soutenancesTriees.length} soutenance(s) trouvée(s)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {soutenancesTriees.length > 0 ? (
                        soutenancesTriees.map((soutenance) => (
                          <div key={soutenance.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                            <div className={`p-2 rounded-full ${soutenance.statut === "terminee" ? "bg-green-100" : "bg-blue-100"}`}>
                              <Video className={`h-6 w-6 ${soutenance.statut === "terminee" ? "text-green-500" : "text-blue-500"}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-semibold">{soutenance.titre}</h3>
                                <div className="flex space-x-2">
                                  <Badge className={obtenirCouleurStatut(soutenance.statut)}>
                                    {obtenirLibelleStatut(soutenance.statut)}
                                  </Badge>
                                  <Badge className={obtenirCouleurModalite(soutenance.modalite)}>
                                    {soutenance.modalite === "ligne" ? "En ligne" : "Présentiel"}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="mt-2 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span>{format(soutenance.date, 'EEEE d MMMM yyyy', { locale: fr })}</span>
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  <span>{soutenance.heureDebut} - {soutenance.heureFin}</span>
                                </div>
                                <div className="mt-1">
                                  <strong>Étudiant:</strong> {soutenance.etudiant.prenom} {soutenance.etudiant.nom} ({soutenance.etudiant.niveau})
                                </div>
                                <div className="mt-1">
                                  <strong>Mémoire:</strong> {soutenance.memoire.titre}
                                </div>
                                <div className="mt-1">
                                  <strong>Lieu:</strong> {soutenance.lieu}
                                </div>
                                {soutenance.note && (
                                  <div className="mt-1">
                                    <strong>Note:</strong> {soutenance.note}/20
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-3 flex flex-wrap gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  asChild
                                >
                                  <Link to={`/calendrier/details/${soutenance.id}`}>
                                    Détails
                                  </Link>
                                </Button>
                                
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  asChild
                                >
                                  <Link to={`/calendrier/modifier/${soutenance.id}`}>
                                    Modifier
                                  </Link>
                                </Button>
                                
                                {soutenance.statut === "programmee" && (
                                  <Button variant="outline" size="sm">
                                    <FileText className="mr-1 h-3 w-3" />
                                    Procès-verbal
                                  </Button>
                                )}
                                
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="mr-1 h-3 w-3" />
                                  Notifier
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-8">
                          <Video className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                          <h3 className="text-lg font-medium text-gray-900">Aucune soutenance trouvée</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Aucune soutenance ne correspond à vos critères de recherche.
                          </p>
                          <Button 
                            className="mt-4" 
                            onClick={() => {
                              setFiltre("toutes");
                              setRecherche("");
                            }}
                          >
                            Réinitialiser les filtres
                          </Button>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cartes">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {soutenancesTriees.length > 0 ? (
                  soutenancesTriees.map((soutenance) => (
                    <Card key={soutenance.id} className="overflow-hidden">
                      <div className={`h-2 ${
                        soutenance.statut === "programmee" ? "bg-blue-500" : 
                        soutenance.statut === "terminee" ? "bg-green-500" : 
                        soutenance.statut === "reportee" ? "bg-amber-500" : 
                        "bg-red-500"
                      }`}></div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{soutenance.titre}</CardTitle>
                          <Badge className={obtenirCouleurStatut(soutenance.statut)}>
                            {obtenirLibelleStatut(soutenance.statut)}
                          </Badge>
                        </div>
                        <CardDescription>
                          {format(soutenance.date, 'EEEE d MMMM yyyy', { locale: fr })} • {soutenance.heureDebut} - {soutenance.heureFin}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="text-sm">
                              <strong>Étudiant:</strong> {soutenance.etudiant.prenom} {soutenance.etudiant.nom}
                            </div>
                            <Badge className={obtenirCouleurModalite(soutenance.modalite)}>
                              {soutenance.modalite === "ligne" ? "En ligne" : "Présentiel"}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Niveau:</strong> {soutenance.etudiant.niveau}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-2">
                            <strong>Mémoire:</strong> {soutenance.memoire.titre}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Lieu:</strong> {soutenance.lieu}
                          </div>
                          {soutenance.note && (
                            <div className="text-sm text-gray-600">
                              <strong>Note:</strong> {soutenance.note}/20
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="w-full flex justify-between gap-2">
                          <Button variant="outline" size="sm" asChild className="flex-1">
                            <Link to={`/calendrier/details/${soutenance.id}`}>
                              Détails
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild className="flex-1">
                            <Link to={`/calendrier/modifier/${soutenance.id}`}>
                              <Edit className="mr-1 h-3 w-3" />
                              Modifier
                            </Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-2 text-center p-8 border rounded-lg">
                    <Video className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">Aucune soutenance trouvée</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Aucune soutenance ne correspond à vos critères de recherche.
                    </p>
                    <Button 
                      className="mt-4" 
                      onClick={() => {
                        setFiltre("toutes");
                        setRecherche("");
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PageSoutenances;