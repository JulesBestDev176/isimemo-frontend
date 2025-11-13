import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  MessageSquare,
  BookOpen,
  Video,
  FileText,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  ChevronRight,
  Search,
  ExternalLink,
  Download,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Users,
  Settings,
  Calendar,
  Folder,
  MessageSquareMore
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'dossier' | 'soutenance' | 'ressources' | 'technique';
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "Comment créer un nouveau dossier de mémoire ?",
    answer: "Rendez-vous dans la section 'Mes Dossiers' et cliquez sur 'Créer un nouveau dossier'. Remplissez les informations requises (titre, sujet, encadrant) et validez. Votre dossier sera créé et vous pourrez commencer à y déposer vos documents.",
    category: 'dossier'
  },
  {
    question: "Quels documents dois-je déposer dans mon dossier ?",
    answer: "Vous devez déposer : votre mémoire finalisé, les annexes, le résumé, et tout document administratif requis. Consultez la section 'Documents administratifs' dans votre profil pour voir les documents généraux à déposer.",
    category: 'dossier'
  },
  {
    question: "Comment suivre l'avancement de la validation de mon mémoire ?",
    answer: "Dans la section 'Mes Dossiers', vous pouvez voir le statut de chaque document (Déposé, En attente, Validé, Rejeté). Vous recevrez également des notifications à chaque changement de statut.",
    category: 'dossier'
  },
  {
    question: "Comment planifier ma soutenance ?",
    answer: "Une fois votre mémoire validé, vous pouvez consulter le calendrier des soutenances dans la section 'Calendrier'. Si une date vous est proposée, vous pouvez la confirmer ou demander un changement.",
    category: 'soutenance'
  },
  {
    question: "Que faire si ma soutenance est rejetée ?",
    answer: "Si votre soutenance est rejetée, vous recevrez un commentaire détaillé avec les raisons. Vous pouvez corriger votre mémoire et le redéposer. Contactez votre encadrant pour plus d'informations.",
    category: 'soutenance'
  },
  {
    question: "Comment accéder aux ressources de la médiathèque ?",
    answer: "Rendez-vous dans 'Médiathèque' depuis le menu. Vous pouvez rechercher des ressources par catégorie (cours, mémoires, canevas) et les consulter ou télécharger.",
    category: 'ressources'
  },
  {
    question: "Comment sauvegarder une ressource pour plus tard ?",
    answer: "Lorsque vous consultez une ressource, cliquez sur l'icône 'Étoile' pour l'ajouter à vos ressources sauvegardées. Vous la retrouverez dans la section 'Ressources sauvegardées'.",
    category: 'ressources'
  },
  {
    question: "Comment utiliser l'Assistant IA ?",
    answer: "L'Assistant IA est disponible dans le menu. Posez-lui vos questions sur votre mémoire, demandez des conseils de rédaction, ou obtenez de l'aide pour structurer votre travail. L'IA vous guidera dans votre processus de rédaction.",
    category: 'general'
  },
  {
    question: "Comment modifier mes informations personnelles ?",
    answer: "Rendez-vous dans 'Mon Profil' et cliquez sur 'Modifier le profil'. Vous pouvez mettre à jour vos informations personnelles, votre adresse, votre téléphone, etc.",
    category: 'general'
  },
  {
    question: "Comment changer mon mot de passe ?",
    answer: "Dans 'Mon Profil', allez dans l'onglet 'Sécurité' pour changer votre mot de passe. Vous devrez saisir votre mot de passe actuel et le nouveau mot de passe.",
    category: 'technique'
  },
  {
    question: "Je ne reçois pas les notifications, que faire ?",
    answer: "Vérifiez vos paramètres de notification dans votre profil. Assurez-vous que votre adresse email est correcte et que vous avez autorisé les notifications dans les paramètres de votre navigateur.",
    category: 'technique'
  },
  {
    question: "Comment contacter mon encadrant ?",
    answer: "Vous pouvez contacter votre encadrant via la messagerie intégrée dans votre dossier de mémoire, ou utiliser les coordonnées disponibles dans la section 'Espace Encadrant'.",
    category: 'general'
  }
];

const GUIDE_CATEGORIES = [
  {
    id: 'debuter',
    title: 'Débuter avec ISIMemo',
    icon: <Lightbulb className="h-5 w-5" />,
    description: 'Guide pour les nouveaux utilisateurs',
    color: 'bg-primary-100 text-primary-600'
  },
  {
    id: 'dossier',
    title: 'Gérer mon dossier',
    icon: <Folder className="h-5 w-5" />,
    description: 'Tout savoir sur les dossiers de mémoire',
    color: 'bg-primary-100 text-primary-600'
  },
  {
    id: 'soutenance',
    title: 'Préparer ma soutenance',
    icon: <Video className="h-5 w-5" />,
    description: 'Guide complet pour la soutenance',
    color: 'bg-primary-100 text-primary-600'
  },
  {
    id: 'ressources',
    title: 'Utiliser les ressources',
    icon: <BookOpen className="h-5 w-5" />,
    description: 'Exploiter la médiathèque au maximum',
    color: 'bg-primary-100 text-primary-600'
  }
];

const Aide: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'faq' | 'guides' | 'contact'>('faq');

  const filteredFAQ = FAQ_DATA.filter(item => {
    const matchesSearch = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: null, label: 'Toutes', count: FAQ_DATA.length },
    { id: 'general', label: 'Général', count: FAQ_DATA.filter(f => f.category === 'general').length },
    { id: 'dossier', label: 'Dossier', count: FAQ_DATA.filter(f => f.category === 'dossier').length },
    { id: 'soutenance', label: 'Soutenance', count: FAQ_DATA.filter(f => f.category === 'soutenance').length },
    { id: 'ressources', label: 'Ressources', count: FAQ_DATA.filter(f => f.category === 'ressources').length },
    { id: 'technique', label: 'Technique', count: FAQ_DATA.filter(f => f.category === 'technique').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 rounded-full p-3">
              <HelpCircle className="h-8 w-8 text-primary-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Aide & Support</h1>
              <p className="text-gray-600 mt-1">Trouvez des réponses à vos questions et obtenez de l'aide</p>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('faq')}
                className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'faq'
                    ? 'border-primary text-primary bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  FAQ
                </div>
              </button>
              <button
                onClick={() => setActiveTab('guides')}
                className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'guides'
                    ? 'border-primary text-primary bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Guides
                </div>
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'contact'
                    ? 'border-primary text-primary bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Nous contacter
                </div>
              </button>
            </div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Onglet FAQ */}
              {activeTab === 'faq' && (
                <motion.div
                  key="faq"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Barre de recherche */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Rechercher dans la FAQ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Filtres par catégorie */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((cat) => (
                      <button
                        key={cat.id || 'all'}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === cat.id
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat.label} ({cat.count})
                      </button>
                    ))}
                  </div>

                  {/* Liste des FAQ */}
                  <div className="space-y-3">
                    {filteredFAQ.length > 0 ? (
                      filteredFAQ.map((item, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:border-primary transition-colors"
                          onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-base flex items-start gap-3">
                                  <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                  <span>{item.question}</span>
                                </CardTitle>
                                <Badge
                                  variant="outline"
                                  className="mt-2 ml-8"
                                >
                                  {categories.find(c => c.id === item.category)?.label || 'Général'}
                                </Badge>
                              </div>
                              {openFAQ === index ? (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </CardHeader>
                          <AnimatePresence>
                            {openFAQ === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <CardContent className="pt-0 pb-4">
                                  <p className="text-gray-700 leading-relaxed ml-8">
                                    {item.answer}
                                  </p>
                                </CardContent>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      ))
                    ) : (
                      <Card>
                        <CardContent className="py-8 text-center">
                          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">Aucune question trouvée pour votre recherche.</p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedCategory(null);
                            }}
                          >
                            Réinitialiser les filtres
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Onglet Guides */}
              {activeTab === 'guides' && (
                <motion.div
                  key="guides"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {GUIDE_CATEGORIES.map((guide) => (
                      <Card
                        key={guide.id}
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className={`${guide.color} rounded-lg p-3`}>
                              {guide.icon}
                            </div>
                            <ExternalLink className="h-5 w-5 text-gray-400" />
                          </div>
                          <CardTitle className="mt-4">{guide.title}</CardTitle>
                          <CardDescription>{guide.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger le guide
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Onglet Contact */}
              {activeTab === 'contact' && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Support technique */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-primary-100 rounded-lg p-2">
                            <Settings className="h-6 w-6 text-primary-600" />
                          </div>
                          <CardTitle>Support technique</CardTitle>
                        </div>
                        <CardDescription>
                          Problèmes techniques, bugs, questions sur l'utilisation de la plateforme
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>support@isimemo.edu.sn</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>+221 33 XXX XX XX</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>Lun - Ven : 8h - 18h</span>
                        </div>
                        <Button className="w-full mt-4">
                          <MessageSquareMore className="h-4 w-4 mr-2" />
                          Ouvrir un ticket
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Support académique */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-primary-100 rounded-lg p-2">
                            <Users className="h-6 w-6 text-primary-600" />
                          </div>
                          <CardTitle>Support académique</CardTitle>
                        </div>
                        <CardDescription>
                          Questions sur votre mémoire, soutenance, encadrement
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>academique@isimemo.edu.sn</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>+221 33 XXX XX XX</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>Lun - Ven : 9h - 17h</span>
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          <MessageSquareMore className="h-4 w-4 mr-2" />
                          Contacter le service
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Formulaire de contact rapide */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Formulaire de contact rapide</CardTitle>
                      <CardDescription>
                        Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sujet
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option>Question générale</option>
                            <option>Problème technique</option>
                            <option>Question académique</option>
                            <option>Autre</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message
                          </label>
                          <textarea
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Décrivez votre question ou problème..."
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          <Mail className="h-4 w-4 mr-2" />
                          Envoyer le message
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Section rapide - Liens utiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 rounded-lg p-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Assistant IA</p>
                  <p className="text-xs text-gray-500">Obtenez de l'aide instantanée</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 rounded-lg p-2">
                  <FileText className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Documentation</p>
                  <p className="text-xs text-gray-500">Guides complets disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 rounded-lg p-2">
                  <Video className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Tutoriels vidéo</p>
                  <p className="text-xs text-gray-500">Apprenez en regardant</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Aide;

