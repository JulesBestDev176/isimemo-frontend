import { Etudiant, getEtudiantByEmail } from '../data/etudiants.data';
import { 
  Candidat,
  getCandidatByEmail, 
  addCandidat,
  checkEligibility
} from '../data/candidats.data';
import { sendRegistrationEmail } from './email.service';

export interface RegisterRequest {
  email: string;
}

export interface RegisterResponse {
  success: boolean;
  email?: string;
  temporaryPassword?: string;
  message?: string;
  mustChangePassword?: boolean;
  etudiant?: Etudiant;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id?: string;
    email: string;
    nom?: string;
    prenom?: string;
    role: string;
    mustChangePassword?: boolean;
  };
}

// Générer un mot de passe temporaire sécurisé
const genererMotDePasseTemporaire = (): string => {
  const majuscules = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const minuscules = 'abcdefghijklmnopqrstuvwxyz';
  const chiffres = '0123456789';
  const speciaux = '!@#$%&*';
  
  // Garantir au moins un de chaque type
  let password = '';
  password += majuscules.charAt(Math.floor(Math.random() * majuscules.length));
  password += minuscules.charAt(Math.floor(Math.random() * minuscules.length));
  password += chiffres.charAt(Math.floor(Math.random() * chiffres.length));
  password += speciaux.charAt(Math.floor(Math.random() * speciaux.length));
  
  // Compléter avec des caractères aléatoires
  const tousChars = majuscules + minuscules + chiffres + speciaux;
  for (let i = 0; i < 8; i++) {
    password += tousChars.charAt(Math.floor(Math.random() * tousChars.length));
  }
  
  // Mélanger le mot de passe
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export const authService = {
  register: async (email: string): Promise<RegisterResponse> => {
    // Simulation de délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Vérifier l'éligibilité de l'étudiant
    const eligibility = checkEligibility(email);
    
    if (!eligibility.eligible) {
      return {
        success: false,
        message: eligibility.raison || "Vous n'êtes pas éligible à l'inscription."
      };
    }
    
    const etudiant = eligibility.etudiant!;
    
    // Créer le compte candidat avec mot de passe temporaire
    const temporaryPassword = genererMotDePasseTemporaire();
    
    // Ajouter dans la liste des candidats
    addCandidat(etudiant, temporaryPassword);
    
    // Envoyer l'email avec le mot de passe temporaire
    const emailResult = await sendRegistrationEmail(email, etudiant.prenom, temporaryPassword);
    
    console.log('✅ Compte créé pour:', etudiant.prenom, etudiant.nom);
    console.log('🔑 Mot de passe temporaire:', temporaryPassword);
    
    return {
      success: true,
      email,
      temporaryPassword,
      mustChangePassword: true,
      message: `Inscription réussie ! Un email a été envoyé à ${email}.`,
      etudiant
    };
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Simulation de délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Vérifier si le candidat existe
    const candidat = getCandidatByEmail(email);
    
    if (candidat) {
      if (candidat.motDePasse === password) {
        // Connexion réussie
        console.log('✅ Connexion candidat réussie:', email);
        return {
          success: true,
          accessToken: 'mock-access-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now(),
          user: {
            id: candidat.id,
            email: candidat.email,
            nom: candidat.nom,
            prenom: candidat.prenom,
            role: 'CANDIDAT'
          }
        };
      } else {
        console.warn('❌ Tentative de connexion: Mot de passe incorrect pour', email);
      }
    } else {
      console.warn('❌ Tentative de connexion: Aucun compte candidat trouvé pour', email);
    }
    
    // Vérifier si c'est un étudiant qui n'est pas encore inscrit
    const etudiant = getEtudiantByEmail(email);
    if (etudiant && !candidat) {
      console.info('ℹ️ Étudiant non inscrit:', email);
      return {
        success: false,
        message: "Vous n'êtes pas encore inscrit sur la plateforme. Veuillez d'abord vous inscrire."
      };
    }
    
    return {
      success: false,
      message: 'Email ou mot de passe incorrect.'
    };
  },
  
  // Changer le mot de passe
  changePassword: async (email: string, oldPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const candidat = getCandidatByEmail(email);
    if (candidat && candidat.motDePasse === oldPassword) {
      candidat.motDePasse = newPassword;
      candidat.mustChangePassword = false; // Mark that password has been changed
      console.log('🔐 Mot de passe changé pour:', email);
      return { success: true, message: 'Mot de passe mis à jour avec succès.' };
    } else if (candidat && candidat.motDePasse !== oldPassword) {
      return { success: false, message: 'Ancien mot de passe incorrect.' };
    }
    
    return { success: false, message: 'Compte non trouvé.' };
  }
};
