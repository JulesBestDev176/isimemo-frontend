import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Calendar as IconeCalendrier, ChevronLeft, ChevronRight, MessageSquare, Users, Presentation, Globe, MapPin } from 'lucide-react';
import { format, addMonths, subMonths, setDate, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '../../components/ui/calendar';
import { Link } from 'react-router-dom';

// Type pour les événements
interface Evenement {
  id: number;
  titre: string;
  date: Date;
  dateFin: Date;
  type: "reunion" | "seminaire";
  modalite: "presentiel" | "ligne";
  lieu?: string;
  lien?: string;
  participants: string[];
  description?: string;
}

const PageReunions: React.FC = () => {
  const [dateActuelle, setDateActuelle] = useState<Date>(new Date());
  const [ongletSelectionne, setOngletSelectionne] = useState<string>("reunions");
  
  // Données factices pour les réunions
  const evenements: Evenement[] = [
    {
      id: 1,
      titre: "Réunion départementale",
      date: new Date(2025, 4, 15, 10, 0),
      dateFin: new Date(2025, 4, 15, 11, 30),
      type: "reunion",
      modalite: "presentiel",
      lieu: "Salle de conférence A",
      participants: ["Prof. Diop", "Prof. Seck", "Dr. Ndiaye"],
      description: "Réunion mensuelle du département pour discuter des avancées pédagogiques et des projets en cours."
    },
    {
      id: 2,
      titre: "Réunion comité pédagogique",
      date: new Date(2025, 4, 20, 14, 0),
      dateFin: new Date(2025, 4, 20, 16, 0),
      type: "reunion",
      modalite: "ligne",
      lien: "https://zoom.us/j/123456789",
      participants: ["Prof. Mbaye", "Dr. Fall", "Dr. Sarr", "Mme Diallo"],
      description: "Discussion sur les révisions du programme de Bachelor."
    },
    {
      id: 3,
      titre: "Séminaire IA et données",
      date: new Date(2025, 4, 18, 9, 0),
      dateFin: new Date(2025, 4, 18, 12, 0),
      type: "seminaire",
      modalite: "ligne",
      lien: "https://meet.google.com/abc-defg-hij",
      participants: ["Prof. Diop", "Dr. Ndiaye", "Étudiants M2"],
      description: "Présentation des avancées récentes en IA et traitement des données massives."
    },
    {
      id: 4,
      titre: "Séminaire Cybersécurité",
      date: new Date(2025, 4, 25, 14, 0),
      dateFin: new Date(2025, 4, 25, 17, 0),
      type: "seminaire",
      modalite: "presentiel",
      lieu: "Amphithéâtre A",
      participants: ["Dr. Fall", "Experts invités", "Étudiants L3 et Master"],
      description: "Séminaire sur les dernières tendances en cybersécurité et protection des données."
    }
  ];
  
  // Filtrer les événements par type
  const reunions = evenements.filter(evenement => evenement.type === "reunion");
  const seminaires = evenements.filter(evenement => evenement.type === "seminaire");
  
  // Navigation dans le calendrier
  const gererMoisPrecedent = () => {
    setDateActuelle(subMonths(dateActuelle, 1));
  };
  
  const gererMoisSuivant = () => {
    setDateActuelle(addMonths(dateActuelle, 1));
  };
  
  // Obtenir l'icône et la couleur en fonction du type d'événement
  const obtenirIconeEvenement = (type: string) => {
    switch(type) {
      case "reunion": return <Users className="h-5 w-5 text-blue-500" />;
      case "seminaire": return <Presentation className="h-5 w-5 text-purple-500" />;
      default: return <IconeCalendrier className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const obtenirCouleurBadge = (type: string) => {
    switch(type) {
      case "reunion": return "bg-blue-100 text-blue-800";
      case "seminaire": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const obtenirLibelleType = (type: string) => {
    switch(type) {
      case "reunion": return "Réunion";
      case "seminaire": return "Séminaire";
      default: return type;
    }
  };
  
  const obtenirCouleurModalite = (modalite: string) => {
    return modalite === "ligne" ? "bg-indigo-100 text-indigo-800" : "bg-teal-100 text-teal-800";
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestion des réunions et séminaires</h1>
        <div className="space-x-2">
          <Button asChild variant="default">
            <Link to="/calendrier/ajouter">
              Nouvel événement
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
              <Calendar
                mode="single"
                selected={dateActuelle}
                onSelect={(date) => date && setDateActuelle(date)}
                className="rounded-md border"
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
              <CardTitle>Filtre rapide</CardTitle>
              <CardDescription>
                Sélectionnez un type d'événement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant={ongletSelectionne === "reunions" ? "default" : "outline"} 
                  className="w-full justify-start"
                  onClick={() => setOngletSelectionne("reunions")}
                >
                  <Users className="mr-2 h-4 w-4 text-blue-500" />
                  Réunions ({reunions.length})
                </Button>
                <Button 
                  variant={ongletSelectionne === "seminaires" ? "default" : "outline"} 
                  className="w-full justify-start"
                  onClick={() => setOngletSelectionne("seminaires")}
                >
                  <Presentation className="mr-2 h-4 w-4 text-purple-500" />
                  Séminaires ({seminaires.length})
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <Tabs defaultValue={ongletSelectionne} value={ongletSelectionne} onValueChange={setOngletSelectionne}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="reunions">Réunions</TabsTrigger>
              <TabsTrigger value="seminaires">Séminaires</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reunions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-500" />
                    Réunions
                  </CardTitle>
                  <CardDescription>
                    Gérez les réunions départementales et pédagogiques
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {reunions.length > 0 ? (
                        reunions.map((evenement) => (
                          <div key={evenement.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <Users className="h-6 w-6 text-blue-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{evenement.titre}</h3>
                              <div className="text-sm text-gray-500 mt-1">
                                {format(evenement.date, 'EEEE d MMMM yyyy', { locale: fr })} • 
                                {format(evenement.date, ' HH:mm')} - {format(evenement.dateFin, 'HH:mm')}
                              </div>
                              <div className="flex mt-1 items-center">
                                <Badge className={obtenirCouleurModalite(evenement.modalite)}>
                                  {evenement.modalite === "ligne" ? "En ligne" : "Présentiel"}
                                </Badge>
                              </div>
                              <div className="mt-1 text-sm text-gray-600">
                                {evenement.modalite === "presentiel" ? (
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                                    {evenement.lieu}
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <Globe className="h-4 w-4 text-gray-400 mr-1" />
                                    <a 
                                      href={evenement.lien} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="text-blue-600 hover:underline"
                                    >
                                      {evenement.lien?.split('//')[1]?.split('/')[0] || 'Lien de connexion'}
                                    </a>
                                  </div>
                                )}
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {evenement.participants.map((participant, index) => (
                                  <Badge key={index} variant="outline" className="bg-gray-50">
                                    {participant}
                                  </Badge>
                                ))}
                              </div>
                              <div className="mt-2 text-sm text-gray-700">
                                {evenement.description}
                              </div>
                              <div className="mt-3 flex space-x-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/calendrier/details/${evenement.id}`}>
                                    Détails
                                  </Link>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/calendrier/modifier/${evenement.id}`}>
                                    Modifier
                                  </Link>
                                </Button>
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="mr-1 h-3 w-3" />
                                  Envoyer notification
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-8">
                          <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                          <h3 className="text-lg font-medium text-gray-900">Aucune réunion</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Vous n'avez pas encore planifié de réunions.
                          </p>
                          <Button className="mt-4" asChild>
                            <Link to="/calendrier/ajouter">
                              Planifier une réunion
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="seminaires">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Presentation className="mr-2 h-5 w-5 text-purple-500" />
                    Séminaires
                  </CardTitle>
                  <CardDescription>
                    Gérez les séminaires et ateliers académiques
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {seminaires.length > 0 ? (
                        seminaires.map((evenement) => (
                          <div key={evenement.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                            <div className="bg-purple-100 p-2 rounded-full">
                              <Presentation className="h-6 w-6 text-purple-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{evenement.titre}</h3>
                              <div className="text-sm text-gray-500 mt-1">
                                {format(evenement.date, 'EEEE d MMMM yyyy', { locale: fr })} • 
                                {format(evenement.date, ' HH:mm')} - {format(evenement.dateFin, 'HH:mm')}
                              </div>
                              <div className="flex mt-1 items-center">
                                <Badge className={obtenirCouleurModalite(evenement.modalite)}>
                                  {evenement.modalite === "ligne" ? "En ligne" : "Présentiel"}
                                </Badge>
                              </div>
                              <div className="mt-1 text-sm text-gray-600">
                                {evenement.modalite === "presentiel" ? (
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                                    {evenement.lieu}
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <Globe className="h-4 w-4 text-gray-400 mr-1" />
                                    <a 
                                      href={evenement.lien} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="text-blue-600 hover:underline"
                                    >
                                      {evenement.lien?.split('//')[1]?.split('/')[0] || 'Lien de connexion'}
                                    </a>
                                  </div>
                                )}
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {evenement.participants.map((participant, index) => (
                                  <Badge key={index} variant="outline" className="bg-gray-50">
                                    {participant}
                                  </Badge>
                                ))}
                              </div>
                              <div className="mt-2 text-sm text-gray-700">
                                {evenement.description}
                              </div>
                              <div className="mt-3 flex space-x-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/calendrier/details/${evenement.id}`}>
                                    Détails
                                  </Link>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/calendrier/modifier/${evenement.id}`}>
                                    Modifier
                                  </Link>
                                </Button>
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="mr-1 h-3 w-3" />
                                  Envoyer notification
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-8">
                          <Presentation className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                          <h3 className="text-lg font-medium text-gray-900">Aucun séminaire</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Vous n'avez pas encore planifié de séminaires.
                          </p>
                          <Button className="mt-4" asChild>
                            <Link to="/calendrier/ajouter">
                              Planifier un séminaire
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PageReunions;