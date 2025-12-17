// ============================================================================
// IMPORTS
// ============================================================================

import type { RessourceMediatheque, TypeCategorieRessource } from '../ressource/RessourceMediatheque';
import { simulateEmbedding, cosineSimilarity } from '../recommendation/RecommendationEngine';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface SearchFilters {
    categorie?: TypeCategorieRessource[];
    anneeMin?: number;
    anneeMax?: number;
    auteurs?: string[];
    departement?: string;
}

export interface SearchQuery {
    query: string;
    filters?: SearchFilters;
    sortBy?: 'relevance' | 'date' | 'popularity';
    limit?: number;
}

export interface SearchResult {
    ressource: RessourceMediatheque;
    score: number;
    highlights: string[];
    explanation: string;
}

// ============================================================================
// EXTRACTION DE MOTS-CLÉS
// ============================================================================

const FRENCH_STOP_WORDS = new Set([
    'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'à', 'au', 'aux',
    'et', 'ou', 'mais', 'donc', 'or', 'ni', 'car', 'qui', 'que', 'quoi',
    'dont', 'où', 'ce', 'cet', 'cette', 'ces', 'se', 'si', 'mon', 'ton',
    'son', 'ma', 'ta', 'sa', 'mes', 'tes', 'ses', 'notre', 'votre', 'leur',
    'nos', 'vos', 'leurs', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils',
    'elles', 'on', 'dans', 'sur', 'sous', 'avec', 'sans', 'pour', 'par',
    'en', 'y', 'a', 'est', 'sont', 'était', 'étaient', 'être', 'avoir',
    'fait', 'faire', 'dit', 'dire', 'peut', 'pouvoir', 'va', 'aller'
]);

export const extractKeywords = (text: string): string[] => {
    if (!text) return [];

    const words = text
        .toLowerCase()
        .replace(/[^\w\sàâäéèêëïîôùûüÿæœç]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !FRENCH_STOP_WORDS.has(word));

    const frequency = new Map<string, number>();
    words.forEach(word => {
        frequency.set(word, (frequency.get(word) || 0) + 1);
    });

    return Array.from(frequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word]) => word);
};

export const highlightMatches = (text: string, keywords: string[]): string[] => {
    if (!text || keywords.length === 0) return [];

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const highlights: string[] = [];

    sentences.forEach(sentence => {
        const sentenceLower = sentence.toLowerCase();
        const hasMatch = keywords.some(keyword =>
            sentenceLower.includes(keyword.toLowerCase())
        );

        if (hasMatch && highlights.length < 2) {
            highlights.push(sentence.trim() + '...');
        }
    });

    return highlights.length > 0 ? highlights : [text.substring(0, 100) + '...'];
};

// ============================================================================
// MOTEUR DE RECHERCHE SÉMANTIQUE
// ============================================================================

export class SemanticSearchEngine {
    static calculateRelevance(
        query: string,
        resource: RessourceMediatheque
    ): number {
        const queryKeywords = extractKeywords(query);
        const resourceText = `${resource.titre} ${resource.description || ''} ${resource.categorie}`;

        const queryVec = simulateEmbedding(query);
        const resourceVec = simulateEmbedding(resourceText);
        const vectorScore = cosineSimilarity(queryVec, resourceVec) * 40;

        const resourceKeywords = extractKeywords(resourceText);
        const commonKeywords = queryKeywords.filter(qk =>
            resourceKeywords.some(rk => rk.includes(qk) || qk.includes(rk))
        );
        const keywordScore = (commonKeywords.length / Math.max(queryKeywords.length, 1)) * 40;

        const titleLower = resource.titre.toLowerCase();
        const queryLower = query.toLowerCase();
        const titleScore = titleLower.includes(queryLower) ? 20 : 0;

        return vectorScore + keywordScore + titleScore;
    }

    static applyFilters(
        resource: RessourceMediatheque,
        filters?: SearchFilters
    ): boolean {
        if (!filters) return true;

        if (filters.categorie && filters.categorie.length > 0) {
            if (!filters.categorie.includes(resource.categorie)) {
                return false;
            }
        }

        const year = resource.datePublication ? new Date(resource.datePublication).getFullYear() : null;
        if (year) {
            if (filters.anneeMin && year < filters.anneeMin) return false;
            if (filters.anneeMax && year > filters.anneeMax) return false;
        }

        if (filters.auteurs && filters.auteurs.length > 0) {
            const hasAuthor = filters.auteurs.some(filterAuthor =>
                resource.auteur.toLowerCase().includes(filterAuthor.toLowerCase())
            );
            if (!hasAuthor) return false;
        }

        return true;
    }

    static search(
        searchQuery: SearchQuery,
        resources: RessourceMediatheque[]
    ): SearchResult[] {
        const { query, filters, sortBy = 'relevance', limit = 20 } = searchQuery;

        if (!query.trim()) {
            return resources
                .filter(r => this.applyFilters(r, filters))
                .slice(0, limit)
                .map(r => ({
                    ressource: r,
                    score: 0,
                    highlights: [],
                    explanation: 'Aucune recherche appliquée'
                }));
        }

        const keywords = extractKeywords(query);

        const results = resources
            .filter(resource => this.applyFilters(resource, filters))
            .map(resource => {
                const score = this.calculateRelevance(query, resource);
                const highlights = highlightMatches(
                    resource.description || resource.titre,
                    keywords
                );

                let explanation = '';
                if (score > 70) {
                    explanation = 'Très pertinent pour votre recherche';
                } else if (score > 40) {
                    explanation = 'Correspond partiellement à votre recherche';
                } else {
                    explanation = 'Peut être intéressant';
                }

                return {
                    ressource: resource,
                    score,
                    highlights,
                    explanation
                };
            })
            .filter(result => result.score > 10);

        if (sortBy === 'relevance') {
            results.sort((a, b) => b.score - a.score);
        } else if (sortBy === 'date' && resources[0]?.datePublication) {
            results.sort((a, b) => {
                const dateA = a.ressource.datePublication ? new Date(a.ressource.datePublication).getTime() : 0;
                const dateB = b.ressource.datePublication ? new Date(b.ressource.datePublication).getTime() : 0;
                return dateB - dateA;
            });
        } else if (sortBy === 'popularity') {
            results.sort((a, b) => {
                const viewsA = a.ressource.vues || 0;
                const viewsB = b.ressource.vues || 0;
                return viewsB - viewsA;
            });
        }

        return results.slice(0, limit);
    }

    static getSuggestions(
        partialQuery: string,
        recentSearches: string[]
    ): string[] {
        if (!partialQuery.trim()) return recentSearches.slice(0, 5);

        const queryLower = partialQuery.toLowerCase();

        const matchingRecent = recentSearches.filter(search =>
            search.toLowerCase().includes(queryLower)
        );

        const commonSuggestions = [
            'intelligence artificielle',
            'machine learning',
            'deep learning',
            'blockchain',
            'cybersécurité',
            'big data',
            'développement web',
            'mobile application',
            'cloud computing',
            'IoT internet of things'
        ].filter(suggestion =>
            suggestion.toLowerCase().includes(queryLower)
        );

        const combined = [...new Set([...matchingRecent, ...commonSuggestions])];

        return combined.slice(0, 5);
    }
}
