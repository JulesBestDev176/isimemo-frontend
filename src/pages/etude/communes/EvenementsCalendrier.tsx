import React, { useMemo, useState } from "react";
import {
  Calendar as IconeCalendrier,
  Clock,
  Users,
  Presentation,
  FileText,
  AlertCircle,
  Globe,
  MapPin,
  Filter,
} from "lucide-react";
import { Calendar } from "../../components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import {
  format,
  isSameDay,
  isAfter,
} from "date-fns";
import { fr } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";

// Interface pour les événements
interface Evenement {
  id: number;
  titre: string;
  date: Date;
  dateFin: Date;
  type: "reunion" | "seminaire" | "deadline" | "autre" | "soutenance";
  modalite?: "presentiel" | "ligne";
  lieu?: string;
  lien?: string;
  participants?: string[];
  description?: string;
  important?: boolean;
}

const EvenementsCalendrier: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [filtres, setFiltres] = useState({
    toutes: true,
    reunion: true,
    seminaire: true,
    deadline: true,
    autre: true,
    soutenance: true,
  });
  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Données factices pour les événements (adaptées à l'usage étudiant)
  const evenements: Evenement[] = [
    {
      id: 1,
      titre: "Soutenance Master - Blockchain",
      date: new Date(2025, 4, 20, 14, 0),
      dateFin: new Date(2025, 4, 20, 16, 0),
      type: "reunion",
      modalite: "presentiel",
      lieu: "Amphithéâtre A",
      participants: ["Jury", "Étudiants", "Encadrants"],
      description: "Soutenance de mémoire sur l'implémentation de la blockchain dans les systèmes bancaires",
    },
    {
      id: 2,
      titre: "Réunion avec encadrant",
      date: new Date(2025, 4, 22, 10, 0),
      dateFin: new Date(2025, 4, 22, 11, 0),
      type: "reunion",
      modalite: "ligne",
      lien: "https://meet.isimemo.edu.sn/etudiant-encadrant",
      participants: ["Encadrant", "Étudiant"],
      description: "Point sur l'avancement du projet de fin d'études",
    },
    {
      id: 3,
      titre: "Séminaire Intelligence Artificielle",
      date: new Date(2025, 4, 25, 9, 0),
      dateFin: new Date(2025, 4, 25, 12, 0),
      type: "seminaire",
      modalite: "ligne",
      lien: "https://meet.google.com/abc-defg-hij",
      participants: ["Professeurs", "Étudiants", "Invités"],
      description: "Dernières avancées en IA et applications pratiques",
    },
    {
      id: 4,
      titre: "Deadline - Rapport d'avancement",
      date: new Date(2025, 4, 28, 23, 59),
      dateFin: new Date(2025, 4, 28, 23, 59),
      type: "deadline",
      important: true,
      description: "Date limite pour soumettre le rapport d'avancement mensuel",
    },
    {
      id: 5,
      titre: "Cours spécialisé - DevOps",
      date: new Date(2025, 5, 2, 8, 0),
      dateFin: new Date(2025, 5, 2, 12, 0),
      type: "autre",
      modalite: "presentiel",
      lieu: "Lab Informatique",
      participants: ["Étudiants Master"],
      description: "Formation pratique aux outils DevOps modernes",
    },
  ];

  // Gérer le changement des filtres
  const toggleFiltre = (type: keyof typeof filtres) => {
    if (type === "toutes") {
      const newState = !filtres.toutes;
      setFiltres({
        toutes: newState,
        reunion: newState,
        seminaire: newState,
        deadline: newState,
        autre: newState,
        soutenance: newState,
      });
    } else {
      setFiltres((prev) => {
        const newFiltres = {
          ...prev,
          [type]: !prev[type],
          toutes: false, // Désactiver "Toutes" si on modifie un filtre spécifique
        };
        if (
          newFiltres.reunion &&
          newFiltres.seminaire &&
          newFiltres.deadline &&
          newFiltres.autre &&
          newFiltres.soutenance
        ) {
          newFiltres.toutes = true;
        }
        return newFiltres;
      });
    }
  };

  // Ouvrir le modal avec les détails de l'événement
  const openEventDetails = (event: Evenement) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Filtrer les événements selon les filtres actifs
  const evenementsFiltres = useMemo(() => {
    if (filtres.toutes) return evenements;
    return evenements.filter((evenement) => filtres[evenement.type]);
  }, [evenements, filtres]);

  // Filtrer les événements pour la date sélectionnée
  const evenementsPourDateSelectionnee = useMemo(() => {
    if (!date) return [];
    return evenementsFiltres.filter((evenement) =>
      isSameDay(evenement.date, date)
    );
  }, [date, evenementsFiltres]);

  // Filtrer les événements à venir (à partir d'aujourd'hui, limité à 6)
  const evenementsAVenir = useMemo(() => {
    const aujourdhui = new Date();
    return evenementsFiltres
      .filter(
        (evenement) =>
          isAfter(evenement.date, aujourdhui) ||
          isSameDay(evenement.date, aujourdhui)
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 6);
  }, [evenementsFiltres]);

  // Créer un ensemble des jours qui ont des événements
  const joursAvecEvenements = useMemo(() => {
    return evenementsFiltres.map((ev) => format(ev.date, "yyyy-MM-dd"));
  }, [evenementsFiltres]);

  // Fonction pour obtenir l'icône selon le type d'événement
  const obtenirIconeEvenement = (type: string) => {
    switch (type) {
      case "reunion":
        return <Users className="h-5 w-5 text-blue-500" />;
      case "seminaire":
        return <Presentation className="h-5 w-5 text-purple-500" />;
      case "deadline":
        return <Clock className="h-5 w-5 text-red-500" />;
      case "soutenance":
        return <Presentation className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Fonction pour obtenir la couleur du badge selon le type d'événement
  const obtenirCouleurBadge = (type: string) => {
    switch (type) {
      case "reunion":
        return "bg-blue-100 text-blue-800";
      case "seminaire":
        return "bg-purple-100 text-purple-800";
      case "deadline":
        return "bg-red-100 text-red-800";
      case "soutenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fonction pour obtenir le libellé du type d'événement
  const obtenirLibelleType = (type: string) => {
    switch (type) {
      case "reunion":
        return "Réunion";
      case "seminaire":
        return "Séminaire";
      case "deadline":
        return "Date limite";
      case "soutenance":
        return "Soutenance";
      default:
        return "Autre";
    }
  };

  // Fonction pour obtenir la couleur du badge selon la modalité
  const obtenirCouleurModalite = (modalite: string) => {
    return modalite === "ligne"
      ? "bg-indigo-100 text-indigo-800"
      : "bg-teal-100 text-teal-800";
  };

  // Fonction pour obtenir la couleur de pastille selon le type d'événement (pour le calendrier)
  const getEventDotColor = (type: string) => {
    switch (type) {
      case "reunion":
        return "bg-blue-500";
      case "seminaire":
        return "bg-purple-500";
      case "deadline":
        return "bg-red-500";
      case "soutenance":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  // Générer les modifiers pour chaque type d'événement
  const eventTypeModifiers: Record<string, (date: Date) => boolean> = {
    reunion: (date) => evenementsFiltres.some(ev => ev.type === 'reunion' && isSameDay(ev.date, date)),
    seminaire: (date) => evenementsFiltres.some(ev => ev.type === 'seminaire' && isSameDay(ev.date, date)),
    deadline: (date) => evenementsFiltres.some(ev => ev.type === 'deadline' && isSameDay(ev.date, date)),
    autre: (date) => evenementsFiltres.some(ev => ev.type === 'autre' && isSameDay(ev.date, date)),
    soutenance: (date) => evenementsFiltres.some(ev => ev.type === 'soutenance' && isSameDay(ev.date, date)),
  };

  // ModifiersClassNames pour chaque type
  const eventTypeModifiersClassNames = {
    reunion: 'after:absolute after:bottom-1 after:left-1/2 after:w-1.5 after:h-1.5 after:bg-blue-500 after:rounded-full after:-translate-x-1/2',
    seminaire: 'after:absolute after:bottom-1 after:left-1/2 after:w-1.5 after:h-1.5 after:bg-purple-500 after:rounded-full after:-translate-x-1/2',
    deadline: 'after:absolute after:bottom-1 after:left-1/2 after:w-1.5 after:h-1.5 after:bg-red-500 after:rounded-full after:-translate-x-1/2',
    autre: 'after:absolute after:bottom-1 after:left-1/2 after:w-1.5 after:h-1.5 after:bg-gray-500 after:rounded-full after:-translate-x-1/2',
    soutenance: 'after:absolute after:bottom-1 after:left-1/2 after:w-1.5 after:h-1.5 after:bg-yellow-500 after:rounded-full after:-translate-x-1/2',
  };

  function gererSelectionDate(day: Date | undefined): void {
    if (day) {
      setDate(day);
    } else {
      setDate(undefined);
    }
  }

  return (
    <div>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Calendrier des événements</h1>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtres
                  {!filtres.toutes && (
                    <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-2 py-1">
                      {Object.values(filtres).slice(1).filter(Boolean).length}/5
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Types d'événements</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={filtres.toutes}
                  onCheckedChange={() => toggleFiltre("toutes")}
                >
                  <IconeCalendrier className="mr-2 h-4 w-4" />
                  Tous les événements
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filtres.reunion}
                  onCheckedChange={() => toggleFiltre("reunion")}
                >
                  <Users className="mr-2 h-4 w-4 text-blue-500" />
                  Réunions
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filtres.seminaire}
                  onCheckedChange={() => toggleFiltre("seminaire")}
                >
                  <Presentation className="mr-2 h-4 w-4 text-purple-500" />
                  Séminaires
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filtres.deadline}
                  onCheckedChange={() => toggleFiltre("deadline")}
                >
                  <Clock className="mr-2 h-4 w-4 text-red-500" />
                  Dates limites
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filtres.autre}
                  onCheckedChange={() => toggleFiltre("autre")}
                >
                  <FileText className="mr-2 h-4 w-4 text-gray-500" />
                  Autres
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filtres.soutenance}
                  onCheckedChange={() => toggleFiltre("soutenance")}
                >
                  <Presentation className="mr-2 h-4 w-4 text-yellow-500" />
                  Soutenances
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="col-span-2 relative">
            {/* Légende déplacée au-dessus du calendrier */}
            <div className="mb-4 flex flex-col items-center justify-center">
              <div className="font-medium mb-2">Légende :</div>
              <div className="flex flex-row flex-wrap gap-3 p-2 bg-gray-50 rounded-lg shadow-sm overflow-x-auto max-w-full justify-center">
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div><span className="text-xs">Réunion</span></div>
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div><span className="text-xs">Séminaire</span></div>
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div><span className="text-xs">Soutenance</span></div>
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div><span className="text-xs">Date limite</span></div>
                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-gray-500"></div><span className="text-xs">Autre</span></div>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center text-xl">
                    <IconeCalendrier className="mr-2 h-5 w-5" />
                    Calendrier
                  </CardTitle>
                  <CardDescription>
                    Sélectionnez une date pour voir les événements
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="w-full p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={gererSelectionDate}
                  className="rounded-md border w-full mx-auto"
                  modifiers={{
                    ...eventTypeModifiers,
                  }}
                  modifiersClassNames={{
                    ...eventTypeModifiersClassNames,
                  }}
                  classNames={{
                    months: "w-full",
                    month: "w-full space-y-4",
                    caption:
                      "flex justify-center pt-1 relative items-center text-base font-semibold",
                    caption_label: "text-base font-semibold",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse",
                    head_row: "flex w-full mt-2",
                    head_cell:
                      "text-muted-foreground rounded-md w-10 font-medium text-sm flex-1 text-center",
                    row: "flex w-full mt-1",
                    cell: "relative p-0 text-center text-sm hover:bg-accent hover:text-accent-foreground focus-within:relative focus-within:z-20 flex-1",
                    day: "h-11 w-11 p-0 font-normal text-base aria-selected:opacity-100 m-auto flex items-center justify-center",
                    day_range_end: "day-range-end",
                    day_selected:
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
                    day_today:
                      "bg-accent text-accent-foreground font-bold rounded-md",
                    day_outside:
                      "text-muted-foreground opacity-50 pointer-events-none",
                    day_disabled:
                      "text-muted-foreground opacity-50 pointer-events-none",
                    day_range_middle:
                      "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                  styles={{
                    months: { width: "100%" },
                    month: { width: "100%" },
                  }}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setDate(new Date())}
                className="w-full"
              >
                Aujourd'hui
              </Button>
            </CardFooter>
          </Card>

          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    Événements du{" "}
                    {date?.toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </CardTitle>
                  <CardDescription>
                    {evenementsPourDateSelectionnee.length} événement(s) prévu(s)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[450px] pr-4">
                {evenementsPourDateSelectionnee.length > 0 ? (
                  <div className="space-y-4">
                    {evenementsPourDateSelectionnee.map((evenement) => (
                      <div
                        key={evenement.id}
                        className={`rounded-lg border p-4 ${
                          evenement.important ? "border-red-300 bg-red-50" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div
                              className={`p-2 rounded-full ${
                                evenement.type === "reunion"
                                  ? "bg-blue-100"
                                  : evenement.type === "seminaire"
                                  ? "bg-purple-100"
                                  : evenement.type === "deadline"
                                  ? "bg-red-100"
                                  : evenement.type === "soutenance"
                                  ? "bg-yellow-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              {obtenirIconeEvenement(evenement.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">
                                {evenement.titre}
                              </h3>
                              <div className="flex mt-1 space-x-2">
                                <Badge
                                  className={obtenirCouleurBadge(evenement.type)}
                                >
                                  {obtenirLibelleType(evenement.type)}
                                </Badge>
                                {evenement.modalite && (
                                  <Badge
                                    className={obtenirCouleurModalite(evenement.modalite ?? "")}
                                  >
                                    {evenement.modalite === "ligne"
                                      ? "En ligne"
                                      : "Présentiel"}
                                  </Badge>
                                )}
                                {evenement.important && (
                                  <Badge variant="destructive">Important</Badge>
                                )}
                              </div>
        </div>
      </div>

                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            {evenement.date.toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {evenement.type !== "deadline" &&
                              evenement.type !== "autre" && (
                                <>
                                  {" "}-{" "}
                                  {evenement.dateFin.toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </>
                              )}
                          </div>
                        </div>

                        {evenement.description && (
                          <div className="mt-2 text-sm text-gray-700">
                            {evenement.description}
                          </div>
                        )}

                        {(evenement.type === "reunion" ||
                          evenement.type === "seminaire") && (
                          <div className="mt-2">
                            {evenement.modalite === "presentiel" &&
                            evenement.lieu ? (
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                                Lieu: {evenement.lieu}
                              </div>
                            ) : evenement.modalite === "ligne" &&
                              evenement.lien ? (
                              <div className="flex flex-col text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Globe className="h-4 w-4 text-gray-400 mr-1" />
                                  Plateforme: {evenement.lien?.split("//")[1]?.split("/")[0] || "Plateforme virtuelle"}
                                </div>
                                <a
                                  href={evenement.lien}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 hover:underline mt-1"
                                >
                                  Rejoindre la réunion
                                </a>
                              </div>
                            ) : null}
        </div>
                        )}

                        {evenement.participants &&
                          evenement.participants.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 text-gray-400 mr-1" />
                                Participants: {evenement.participants.join(", ")}
            </div>
        </div>
                          )}

                        <div className="mt-3 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEventDetails(evenement)}
                          >
                            Détails
                          </Button>
                        </div>
                  </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <IconeCalendrier className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      Aucun événement prévu pour cette date
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Événements à venir</h2>
            <div className="text-sm text-muted-foreground">
              {!filtres.toutes && (
                <span>
                  Filtres actifs: {Object.entries(filtres)
                    .filter(([type, active]) => active && type !== "toutes")
                    .map(([type]) => obtenirLibelleType(type))
                    .join(", ")}
                </span>
              )}
            </div>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evenementsAVenir.map((evenement) => (
              <Card
                key={evenement.id}
                className={`overflow-hidden ${
                  evenement.important ? "border-red-300" : ""
                }`}
              >
                <div
                  className={`h-2 ${
                    evenement.type === "reunion"
                      ? "bg-blue-500"
                      : evenement.type === "seminaire"
                      ? "bg-purple-500"
                      : evenement.type === "deadline"
                      ? "bg-red-500"
                      : evenement.type === "soutenance"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                ></div>
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {evenement.titre}
                        {evenement.important && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        {format(evenement.date, "EEEE d MMMM yyyy", {
                          locale: fr,
                        })}
                      </CardDescription>
                    </div>
                    <Badge className={obtenirCouleurBadge(evenement.type)}>
                      {obtenirLibelleType(evenement.type)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center mb-1">
                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">
                      {evenement.date.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {evenement.type !== "deadline" &&
                        evenement.type !== "autre" && (
                          <>
                            {" "}-{" "}
                            {evenement.dateFin.toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </>
                        )}
                    </span>
                  </div>

                  {(evenement.type === "reunion" ||
                    evenement.type === "seminaire") &&
                    evenement.modalite && (
                      <div className="flex items-center mb-1">
                        {evenement.modalite === "presentiel" ? (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            {evenement.lieu}
                          </div>
                        ) : (
                          <div className="flex items-center text-sm text-gray-600">
                            <Globe className="h-4 w-4 text-gray-400 mr-1" />
                            {evenement.lien?.split("//")[1]?.split("/")[0] ||
                              "Plateforme virtuelle"}
          </div>
        )}
      </div>
                    )}

                  {evenement.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {evenement.description}
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => openEventDetails(evenement)}
                  >
                    Voir détails
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
                </div>

        {/* Modal de détails */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedEvent ? (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {obtenirIconeEvenement(selectedEvent.type)}
                    {selectedEvent.titre}
                  </DialogTitle>
                  <DialogDescription>
                    {format(selectedEvent.date, "EEEE d MMMM yyyy", {
                      locale: fr,
                    })}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={obtenirCouleurBadge(selectedEvent.type)}>
                      {obtenirLibelleType(selectedEvent.type)}
                    </Badge>
                    {selectedEvent.modalite && (
                      <Badge
                        className={obtenirCouleurModalite(selectedEvent.modalite ?? "")}
                      >
                        {selectedEvent.modalite === "ligne"
                          ? "En ligne"
                          : "Présentiel"}
                      </Badge>
                    )}
                    {selectedEvent.important && (
                      <Badge variant="destructive">Important</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        {selectedEvent.date.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {selectedEvent.type !== "deadline" &&
                          selectedEvent.type !== "autre" && (
                            <>
                              {" "}-{" "}
                              {selectedEvent.dateFin.toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </>
                          )}
                      </span>
                  </div>

                    {selectedEvent.modalite === "presentiel" &&
                      selectedEvent.lieu && (
                        <div className="flex items-center col-span-2">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Lieu: {selectedEvent.lieu}</span>
                    </div>
                  )}

                    {selectedEvent.modalite === "ligne" && selectedEvent.lien && (
                      <div className="flex items-center col-span-2">
                        <Globe className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          Lien: {" "}
                          <a
                            href={selectedEvent.lien}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedEvent.lien}
                          </a>
                        </span>
                    </div>
                  )}
                  </div>

                  {selectedEvent.description && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Description</h3>
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedEvent.description}
                      </p>
                    </div>
                  )}

                  {selectedEvent.participants &&
                    selectedEvent.participants.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">Participants</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedEvent.participants?.map(
                            (participant, index) => (
                              <Badge key={index} variant="outline">
                                {participant}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </>
            ) : null}
          </DialogContent>
        </Dialog>
          </div>
    </div>
  );
};

export default EvenementsCalendrier;