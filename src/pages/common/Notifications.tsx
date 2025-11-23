import { useMemo, useState } from "react";
import {
  AlertCircle,
  Bell,
  CalendarDays,
  CheckCircle,
  Clock,
  Inbox,
  Star,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { useAuth } from "../../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { 
  Notification, 
  NotificationStatus, 
  NotificationPriority, 
  NotificationCategory,
  mockNotifications 
} from "../../models/notification";


const FILTERS = [
  { id: "all", label: "Toutes" },
  { id: "unread", label: "Non lues" },
  { id: "urgent", label: "Urgentes" },
  { id: "memoire", label: "Mémoire" },
  { id: "ressource", label: "Ressources" },
  { id: "agenda", label: "Agenda" },
  { id: "general", label: "Général" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getCategoryColor = (category: NotificationCategory) => {
  switch (category) {
    case "mémoire":
      return "bg-primary-100 text-primary-600";
    case "soutenance":
      return "bg-primary-100 text-primary-600";
    case "ressource":
      return "bg-primary-100 text-primary-600";
    case "agenda":
      return "bg-primary-100 text-primary-600";
    default:
      return "bg-primary-100 text-primary-600";
  }
};

const StudentNotifications = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const unreadCount = useMemo(
    () => notifications.filter((notif) => notif.status === "unread").length,
    [notifications]
  );
  const urgentCount = useMemo(
    () =>
      notifications.filter(
        (notif) => notif.priority === "urgent" && notif.status === "unread"
      ).length,
    [notifications]
  );
  const agendaNotifications = useMemo(
    () =>
      notifications.filter(
        (notif) =>
          notif.category === "soutenance" || notif.category === "agenda"
      ),
    [notifications]
  );
  const nextEvent = useMemo(() => {
    const now = new Date();
    return [...agendaNotifications]
      .sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      .find((notif) => new Date(notif.date) >= now);
  }, [agendaNotifications]);
  const recentUnread = useMemo(
    () =>
      [...notifications]
        .filter((notif) => notif.status === "unread")
        .sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 3),
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(search.toLowerCase()) ||
        notification.message.toLowerCase().includes(search.toLowerCase()) ||
        notification.source.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) {
        return false;
      }

      switch (filter) {
        case "unread":
          return notification.status === "unread";
        case "urgent":
          return notification.priority === "urgent";
        case "memoire":
          return notification.category === "mémoire";
        case "ressource":
          return notification.category === "ressource";
        case "agenda":
          return notification.category === "agenda";
        case "general":
          return notification.category === "général";
        default:
          return true;
      }
    });
  }, [notifications, search, filter]);

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, status: "read" }
          : notification
      )
    );
  };

  const handleMarkAsUnread = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, status: "unread" }
          : notification
      )
    );
  };

  const handleToggleFavorite = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              priority:
                notification.priority === "urgent" ? "normal" : "urgent",
            }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.status === "unread"
          ? { ...notification, status: "read" }
          : notification
      )
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bell className="h-4 w-4 text-primary" />
            Notifications • {unreadCount} non lues
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Bonjour {user?.name?.split(" ")[0] ?? "Étudiant"}, voici vos
            notifications
          </h1>
          <p className="text-muted-foreground">
            Restez informé de l&apos;avancement de vos dossiers, soutenances et
            nouvelles ressources importantes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle className="h-4 w-4" />
            Marquer tout comme lu
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Bell className="h-4 w-4" />
                Centre de notifications
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Centre de notifications</DialogTitle>
                <DialogDescription>
                  Aperçu rapide de vos alertes, échéances et actions à venir.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="flex items-start justify-between border border-gray-200 bg-gray-50 p-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Non lues
                      </p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        {unreadCount}
                      </p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Bell className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex items-start justify-between border border-gray-200 bg-gray-50 p-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Urgentes
                      </p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        {urgentCount}
                      </p>
                    </div>
                    <div className="rounded-full bg-primary-100 p-2 text-primary-600">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex items-start justify-between border border-gray-200 bg-gray-50 p-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Agenda & soutenances
                      </p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        {agendaNotifications.length}
                      </p>
                    </div>
                    <div className="rounded-full bg-primary-100 p-2 text-primary-600">
                      <CalendarDays className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Dernières notifications non lues
                  </h3>
                  {recentUnread.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Vous êtes à jour, aucune notification non lue restante.
                    </p>
                  ) : (
                    recentUnread.map((notification) => (
                      <div
                        key={notification.id}
                        className="border border-gray-200 bg-gray-50 p-3"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-900">
                            {notification.title}
                          </span>
                          <Badge className={getCategoryColor(notification.category)}>
                            {notification.category}
                          </Badge>
                          {notification.priority === "urgent" && (
                            <Badge className="bg-primary-100 text-primary-600">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(notification.date)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3 w-3 text-primary" />
                            {notification.source}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {nextEvent && (
                  <>
                    <Separator />
                    <div className="border border-dashed border-gray-300 bg-blue-50 p-4">
                      <p className="text-xs font-semibold uppercase text-blue-600">
                        Prochain rendez-vous
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">
                        {nextEvent.title}
                      </p>
                      <p className="text-sm text-slate-700">
                        {nextEvent.message}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-blue-700">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(nextEvent.date)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {nextEvent.source}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
              <AlertCircle className="h-5 w-5" />
              Résumé du jour
            </h2>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0
                ? `Vous avez ${unreadCount} notification${
                    unreadCount > 1 ? "s" : ""
                  } non lue${unreadCount > 1 ? "s" : ""}.`
                : "Vous êtes à jour, aucune notification non lue."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              Mise à jour : {formatDate(new Date().toISOString())}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="lg:w-72">
          <div className="bg-white border border-gray-200">
            <div className="p-6">
              <h3 className="text-base font-semibold mb-1">
                Filtres rapides
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Affinez les notifications selon vos besoins
              </p>
            </div>
            <div className="px-6 pb-6 space-y-2">
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Separator />
              <div className="flex flex-col gap-2">
                {FILTERS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFilter(item.id)}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-all ${
                      filter === item.id
                        ? "bg-primary text-white shadow-sm"
                        : "border border-transparent bg-muted/40 text-muted-foreground hover:border-primary/20 hover:bg-muted"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.id === "unread" && unreadCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white border border-dashed border-primary/30 bg-primary/5 p-6">
            <h3 className="text-base font-semibold mb-1">
                Astuce ISIMemo
            </h3>
            <p className="text-sm text-muted-foreground">
                Activez les notifications navigateur pour être alerté en temps
                réel lors de nouvelles mises à jour.
            </p>
          </div>
        </div>

        <div className="flex-1 bg-white border border-gray-200">
          <div className="p-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold">
                Toutes les notifications
              </h2>
              <p className="text-sm text-muted-foreground">
                {filteredNotifications.length} notification
                {filteredNotifications.length > 1 ? "s" : ""} affichée
                {filteredNotifications.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Inbox className="h-4 w-4" />
              Triées par date décroissante
            </div>
          </div>
          <div className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex flex-col gap-3 p-4 transition hover:bg-muted/50 md:flex-row md:items-start md:gap-4 ${
                      notification.status === "unread"
                        ? "bg-primary/5"
                        : "bg-background"
                    }`}
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {notification.title}
                          </h3>
                          <Badge
                            className={getCategoryColor(notification.category)}
                          >
                            {notification.category}
                          </Badge>
                          {notification.priority === "urgent" && (
                            <Badge className="bg-primary-100 text-primary-600">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {formatDate(notification.date)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-4 w-4 text-primary" />
                          {notification.source}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {notification.status === "unread" ? (
                          <Button
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Marquer comme lu
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsUnread(notification.id)}
                            className="gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Marquer comme non lu
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-2"
                          onClick={() => handleToggleFavorite(notification.id)}
                        >
                          <AlertCircle className="h-4 w-4" />
                          {notification.priority === "urgent"
                            ? "Marquer comme normal"
                            : "Marquer comme urgent"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredNotifications.length === 0 && (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                  <Bell className="h-10 w-10 text-primary" />
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Aucun résultat
                    </h3>
                    <p className="text-sm">
                      Modifiez votre recherche ou vos filtres pour voir d&apos;autres
                      notifications.
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentNotifications;

