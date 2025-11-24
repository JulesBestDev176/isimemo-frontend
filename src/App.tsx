import { Suspense, lazy } from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./contexts/AuthContext";

// Layouts - Lazy loaded
const MainLayout = lazy(() => import("./layouts/MainLayout"));

// Pages publiques - Lazy loaded
// Pages publiques - Lazy loaded
const Index = lazy(() => import("./pages/public/Index"));
const Memoires = lazy(() => import("./pages/public/Memoires"));
const Login = lazy(() => import("./pages/public/Login"));
const About = lazy(() => import("./pages/public/About"));
const Contact = lazy(() => import("./pages/public/Contact"));
const NotFound = lazy(() => import("./pages/public/NotFound"));
const CGU = lazy(() => import("./pages/public/CGU"));
const PolitiqueConfidentialite = lazy(() => import("./pages/public/PolitiqueConfidentialite"));
const MentionsLegales = lazy(() => import("./pages/public/MentionsLegales"));
const ISIMemoHub = lazy(() => import("./pages/public/ISIMemoHub"));

// Pages protégées - Lazy loaded
// Pages protégées - Lazy loaded
const Dashboard = lazy(() => import("./pages/common/Dashboard"));
const Dossiers = lazy(() => import("./pages/etudiant/Dossiers"));
const Profil = lazy(() => import("./pages/common/Profil"));
const Calendrier = lazy(() => import("./pages/common/Calendrier"));
const RessourcesPersonnelles = lazy(() => import("./pages/etudiant/RessourcesPersonnelles"));
const RessourcesSauvegardees = lazy(() => import("./pages/common/RessourcesSauvegardees"));
const Mediatheque = lazy(() => import("./pages/common/Mediatheque"));
const AssistantIA = lazy(() => import("./pages/common/AssistantIA"));
const NotificationsEtudiant = lazy(() => import("./pages/common/Notifications"));
const Encadrement = lazy(() => import("./pages/candidat/Encadrement"));
const Tickets = lazy(() => import("./pages/candidat/Tickets"));
const Sujets = lazy(() => import("./pages/professeur/Sujets"));
const Encadrements = lazy(() => import("./pages/professeur/Encadrements"));
const EncadrementDetail = lazy(() => import("./pages/professeur/EncadrementDetail"));
const PanelEncadrant = lazy(() => import("./pages/professeur/PanelEncadrant"));
const DossierEtudiantDetail = lazy(() => import("./pages/professeur/DossierEtudiantDetail"));
const Disponibilites = lazy(() => import("./pages/professeur/Disponibilites"));
const EspaceJury = lazy(() => import("./pages/jurie/EspaceJury"));
const DossierCandidatJury = lazy(() => import("./pages/jurie/DossierCandidatJury"));
const EspaceCommission = lazy(() => import("./pages/commission/EspaceCommission"));

// Composants non-lazy (utilisés partout)
import Navbar from "./components/Navbar";

// Loading fallback component - Non lazy car utilisé partout
import PageLoader from "./components/common/PageLoader";

const queryClient = new QueryClient();

// Composant pour gérer les animations de transition entre les pages
const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Routes qui nécessitent la navbar
  const routesWithNavbar = ['/', '/memoires', '/about', '/contact'];
  const shouldDisplayNavbar = routesWithNavbar.includes(location.pathname);
  
  return (
    <>
      {/* Navbar conditionnelle */}
      {shouldDisplayNavbar && <Navbar />}
      
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
            {/* Routes publiques */}
          <Route path="/" element={<Index />} />
          <Route path="/memoires" element={<Memoires />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/isimemo-hub" element={<ISIMemoHub />} />
            
            {/* Routes protégées avec MainLayout */}
            <Route 
              path="/dashboard" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </Suspense>
              } 
            />
            
            {/* Routes étudiant */}
            <Route 
              path="/etudiant/dossiers" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <Dossiers />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/etudiant/dossiers/:id" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <Dossiers />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/etudiant/profil" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <Profil />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/etudiant/calendrier" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <Calendrier />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/etudiant/ressources/personnelles" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <RessourcesPersonnelles />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/etudiant/ressources/sauvegardees" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <RessourcesSauvegardees />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/etudiant/notifications" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <NotificationsEtudiant />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/etudiant/ressources/mediatheque" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <Mediatheque />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/etudiant/chatbot" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <AssistantIA />
                  </MainLayout>
                </Suspense>
              } 
            />
            
            {/* Routes candidat */}
            <Route 
              path="/candidat/encadrement" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <Encadrement />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/candidat/tickets" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <Tickets />
                  </MainLayout>
                </Suspense>
              } 
            />
            
            {/* Routes professeur */}
            <Route 
              path="/sujets-professeurs" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <Sujets />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/professeur/encadrements" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <Encadrements />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/professeur/encadrements/:id" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <EncadrementDetail />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/professeur/encadrements/:id/panel" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <PanelEncadrant />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/professeur/encadrements/:id/dossier/:dossierId" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <DossierEtudiantDetail />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/professeur/disponibilites" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <Disponibilites />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/professeur/ressources/personnelles" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <RessourcesPersonnelles />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/professeur/ressources/sauvegardees" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <RessourcesSauvegardees />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/professeur/ressources/mediatheque" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <Mediatheque />
                  </MainLayout>
                </Suspense>
              } 
            />
            
            {/* Routes jury */}
            <Route 
              path="/jurie/soutenances" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <EspaceJury />
                  </MainLayout>
                </Suspense>
              } 
            />
            <Route 
              path="/jurie/soutenances/:soutenanceId/dossier/:dossierId/candidat/:candidatId" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <DossierCandidatJury />
                  </MainLayout>
                </Suspense>
              } 
            />
            
            {/* Routes commission */}
            <Route 
              path="/commission" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <EspaceCommission />
                  </MainLayout>
                </Suspense>
              } 
            />
            
            {/* TODO: Ajouter les autres routes protégées ici */}
            {/* Routes departement */}
            {/* Routes etude */}
            {/* Routes admin */}
            
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
