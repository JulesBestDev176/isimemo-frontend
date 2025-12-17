// ============================================================================
// IMPORTS
// ============================================================================

import type { RessourceMediatheque } from '../ressource/RessourceMediatheque';
import { getUserTopResources, getPopularResources, getLastInteractedResource } from '../tracking/UserInteraction';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ResourceRecommendation {
    ressource: RessourceMediatheque;
    score: number;
    reasons: string[];
    source: 'content' | 'behavior' | 'popular' | 'recent';
}

// ============================================================================
// SIMULATION DE VECTORISATION
// ============================================================================

/**
 * Génère un vecteur simplifié basé sur le texte (simulation)
 * En production, utiliser un vrai modèle comme Sentence-BERT
 */
export const simulateEmbedding = (text: string): number[] => {
    if (!text) return new Array(20).fill(0);

    const normalized = text.toLowerCase().trim();
    const vector = new Array(20).fill(0);

    // Hash simple basé sur les caractères
    for (let i = 0; i < normalized.length; i++) {
        const char = normalized.charCodeAt(i);
        vector[char % 20] += 1;
    }

    // Normalisation L2
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
};

/**
 * Calcule la similarité cosinus entre deux vecteurs
 */
export const cosineSimilarity = (vec1: number[], vec2: number[]): number => {
    if (vec1.length !== vec2.length) return 0;

    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    return Math.max(0, Math.min(1, dotProduct)); // Clamp entre 0 et 1
};

/**
 * Calcule la similarité entre deux ressources basée sur leur contenu
 */
export const calculateContentSimilarity = (
    resource1: RessourceMediatheque,
    resource2: RessourceMediatheque
): number => {
    // Combiner titre + description pour l'embedding
    const text1 = `${resource1.titre} ${resource1.description || ''} ${resource1.categorie}`;
    const text2 = `${resource2.titre} ${resource2.description || ''} ${resource2.categorie}`;

    const vec1 = simulateEmbedding(text1);
    const vec2 = simulateEmbedding(text2);

    return cosineSimilarity(vec1, vec2);
};

// ============================================================================
// MOTEUR DE RECOMMANDATION
// ============================================================================

export class RecommendationEngine {
    /**
     * Récupère les recommandations basées sur le contenu similaire
     */
    static getContentBasedRecommendations(
        userId: number,
        userTopResources: number[],
        allResources: RessourceMediatheque[],
        limit = 6
    ): ResourceRecommendation[] {
        if (userTopResources.length === 0) {
            return [];
        }

        const recommendations = new Map<number, ResourceRecommendation>();

        // Pour chaque ressource aimée par l'utilisateur
        userTopResources.forEach(likedResourceId => {
            const likedResource = allResources.find(r => r.idRessource === likedResourceId);
            if (!likedResource) return;

            // Trouver des ressources similaires
            allResources.forEach(resource => {
                // Ne pas recommander les ressources déjà consultées
                if (userTopResources.includes(resource.idRessource)) return;

                const similarity = calculateContentSimilarity(likedResource, resource);

                if (similarity > 0.3) { // Seuil de similarité
                    const existing = recommendations.get(resource.idRessource);
                    const newScore = similarity * 100;

                    if (!existing || existing.score < newScore) {
                        recommendations.set(resource.idRessource, {
                            ressource: resource,
                            score: newScore,
                            reasons: [], // Raisons cachées pour une expérience naturelle
                            source: 'content'
                        });
                    }
                }
            });
        });

        return Array.from(recommendations.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    /**
     * Récupère les ressources populaires
     */
    static getPopularRecommendations(
        allResources: RessourceMediatheque[],
        limit = 6
    ): ResourceRecommendation[] {
        const popular = getPopularResources(limit * 2);

        return popular
            .map(({ idRessource, count }) => {
                const resource = allResources.find(r => r.idRessource === idRessource);
                if (!resource) return null;

                return {
                    ressource: resource,
                    score: count * 10,
                    reasons: [], // Raisons cachées pour une expérience naturelle
                    source: 'popular' as const
                };
            })
            .filter((r): r is ResourceRecommendation => r !== null)
            .slice(0, limit);
    }

    /**
     * Récupère les ressources récentes
     */
    static getRecentRecommendations(
        allResources: RessourceMediatheque[],
        limit = 6
    ): ResourceRecommendation[] {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        return allResources
            .filter(r => r.dateCreation && new Date(r.dateCreation) > threeMonthsAgo)
            .sort((a, b) => {
                const dateA = a.dateCreation ? new Date(a.dateCreation).getTime() : 0;
                const dateB = b.dateCreation ? new Date(b.dateCreation).getTime() : 0;
                return dateB - dateA;
            })
            .slice(0, limit)
            .map(resource => ({
                ressource: resource,
                score: 50,
                reasons: [], // Raisons cachées pour une expérience naturelle
                source: 'recent' as const
            }));
    }

    /**
     * Récupère les recommandations hybrides (mix de toutes les sources)
     * Style Netflix/TikTok : priorité à la dernière interaction
     */
    static getHybridRecommendations(
        userId: number,
        allResources: RessourceMediatheque[],
        limit = 6
    ): ResourceRecommendation[] {
        // Récupérer la dernière ressource avec laquelle l'utilisateur a interagi
        const lastInteracted = getLastInteractedResource(userId);

        // Récupérer les ressources top de l'utilisateur
        const userTop = getUserTopResources(userId, 5);
        let userTopIds = userTop.map(r => r.idRessource);

        // Si une dernière interaction existe, la mettre en priorité
        if (lastInteracted && !userTopIds.includes(lastInteracted)) {
            userTopIds = [lastInteracted, ...userTopIds.slice(0, 4)];
        } else if (lastInteracted) {
            // Déplacer la dernière interaction en première position
            userTopIds = [lastInteracted, ...userTopIds.filter(id => id !== lastInteracted)];
        }

        let recommendations: ResourceRecommendation[] = [];

        if (userTopIds.length > 0) {
            // Si l'utilisateur a un historique, privilégier content-based
            // avec boost pour les ressources similaires à la dernière interaction
            const contentBased = this.getContentBasedRecommendations(userId, userTopIds, allResources, limit);

            // Boost les recommandations similaires à la dernière interaction
            if (lastInteracted) {
                const lastResource = allResources.find(r => r.idRessource === lastInteracted);
                if (lastResource) {
                    contentBased.forEach(rec => {
                        const similarity = calculateContentSimilarity(lastResource, rec.ressource);
                        if (similarity > 0.5) {
                            rec.score *= 1.5; // Boost de 50% pour les très similaires
                        }
                    });
                }
            }

            recommendations = contentBased;
        } else {
            // Nouvel utilisateur : afficher dans un ordre pseudo-aléatoire mais cohérent
            // Basé sur les vues et la date pour simuler un tri naturel
            const shuffled = [...allResources]
                .sort((a, b) => {
                    const scoreA = (a.vues || 0) * 0.3 + (a.likes || 0) * 0.7;
                    const scoreB = (b.vues || 0) * 0.3 + (b.likes || 0) * 0.7;
                    return scoreB - scoreA;
                })
                .slice(0, limit)
                .map(resource => ({
                    ressource: resource,
                    score: (resource.vues || 0) * 0.3 + (resource.likes || 0) * 0.7,
                    reasons: [],
                    source: 'popular' as const
                }));

            recommendations = shuffled;
        }

        // Dédupliquer et limiter
        const uniqueRecommendations = Array.from(
            new Map(
                recommendations.map(r => [r.ressource.idRessource, r])
            ).values()
        );

        return uniqueRecommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
}
