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
const Register = lazy(() => import("./pages/public/Register"));
const ChangePassword = lazy(() => import('./pages/public/ChangePassword'));
const About = lazy(() => import("./pages/public/About"));
const Contact = lazy(() => import("./pages/public/Contact"));
const NotFound = lazy(() => import("./pages/public/NotFound"));
const CGU = lazy(() => import("./pages/public/CGU"));
const PolitiqueConfidentialite = lazy(() => import("./pages/public/PolitiqueConfidentialite"));
const MentionsLegales = lazy(() => import("./pages/public/MentionsLegales"));
const ISIMemoHub = lazy(() => import("./pages/public/ISIMemoHub"));

// Pages protégées - Lazy loaded
const Dashboard = lazy(() => import("./pages/common/Dashboard"));
const Profil = lazy(() => import("./pages/common/Profil"));
const Calendrier = lazy(() => import("./pages/common/Calendrier"));
const RessourcesSauvegardees = lazy(() => import("./pages/common/RessourcesSauvegardees"));
const Mediatheque = lazy(() => import("./pages/common/Mediatheque"));
const AssistantIA = lazy(() => import("./pages/common/AssistantIA"));
const NotificationsEtudiant = lazy(() => import("./pages/common/Notifications"));
const Encadrement = lazy(() => import("./pages/candidat/Encadrement"));
const Dossiers = lazy(() => import("./pages/candidat/dossiers"));
const DossierDetail = lazy(() => import("./pages/candidat/dossiers/DossierDetailPage"));
const Tickets = lazy(() => import("./pages/candidat/Tickets"));
const Encadrements = lazy(() => import("./pages/professeur/Encadrements"));
const EncadrementDetail = lazy(() => import("./pages/professeur/EncadrementDetail"));
const PanelEncadrant = lazy(() => import("./pages/professeur/PanelEncadrant"));
const DossierEtudiantDetail = lazy(() => import("./pages/professeur/DossierEtudiantDetail"));

// Pages Chef de Département
const PeriodesChef = lazy(() => import("./pages/departement/departement/PeriodesChef"));
const RolesChef = lazy(() => import("./pages/departement/departement/RolesChef"));
const SallesChef = lazy(() => import("./pages/departement/departement/SallesChef"));
const StudentsChef = lazy(() => import("./pages/departement/departement/StudentsChef"));
const ProfessorsChef = lazy(() => import("./pages/departement/departement/ProfessorsChef"));
const JuryDepartement = lazy(() => import("./pages/departement/departement/JuryDepartement"));
const SoutenanceChef = lazy(() => import("./pages/departement/departement/SoutenanceChef"));

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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
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
              path="/candidat/dossiers"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <Dossiers />
                  </MainLayout>
                </Suspense>
              }
            />
            <Route
              path="/candidat/dossiers/:id"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <DossierDetail />
                  </MainLayout>
                </Suspense>
              }
            />
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
                    <DossierDetail />
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



            {/* Routes Chef de Département */}
            <Route
              path="/departement/periodes"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <PeriodesChef />
                  </MainLayout>
                </Suspense>
              }
            />
            <Route
              path="/departement/roles"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <RolesChef />
                  </MainLayout>
                </Suspense>
              }
            />
            <Route
              path="/departement/salles"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <SallesChef />
                  </MainLayout>
                </Suspense>
              }
            />
            <Route
              path="/students"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <StudentsChef />
                  </MainLayout>
                </Suspense>
              }
            />
            <Route
              path="/professors"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <ProfessorsChef />
                  </MainLayout>
                </Suspense>
              }
            />
            <Route
              path="/departement/jury"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <JuryDepartement />
                  </MainLayout>
                </Suspense>
              }
            />
            <Route
              path="/departement/soutenance"
              element={
                <Suspense fallback={<PageLoader />}>
                  <MainLayout>
                    <SoutenanceChef />
                  </MainLayout>
                </Suspense>
              }
            />

            {/* TODO: Ajouter les autres routes protégées ici */}
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
