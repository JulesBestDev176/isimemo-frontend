import { useEffect, useRef } from 'react';
import { trackInteraction } from '../models/tracking/UserInteraction';

/**
 * Hook pour tracker le temps passé sur une ressource
 * Enregistre automatiquement le temps toutes les 30 secondes
 */
export const usePageTimer = (
    userId: number | undefined,
    resourceId: number | undefined,
    isActive: boolean = true
) => {
    const startTimeRef = useRef<number>(Date.now());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const totalTimeRef = useRef<number>(0);

    useEffect(() => {
        if (!userId || !resourceId || !isActive) {
            return;
        }

        // Réinitialiser le compteur au montage
        startTimeRef.current = Date.now();
        totalTimeRef.current = 0;

        // Enregistrer le temps toutes les 30 secondes
        intervalRef.current = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.floor((now - startTimeRef.current) / 1000);
            totalTimeRef.current += elapsed;

            if (elapsed > 0) {
                trackInteraction(userId, resourceId, 'time_spent', {
                    duration: elapsed,
                    scrollDepth: calculateScrollDepth()
                });

                // Réinitialiser le compteur
                startTimeRef.current = now;
            }
        }, 30000); // 30 secondes

        // Cleanup au démontage ou changement de ressource
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            // Enregistrer le temps final
            const finalTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
            if (finalTime > 0) {
                trackInteraction(userId, resourceId, 'time_spent', {
                    duration: finalTime,
                    scrollDepth: calculateScrollDepth()
                });
            }
        };
    }, [userId, resourceId, isActive]);

    return totalTimeRef.current;
};

/**
 * Calcule la profondeur de scroll de la page (0-100%)
 */
const calculateScrollDepth = (): number => {
    if (typeof window === 'undefined') return 0;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const maxScroll = documentHeight - windowHeight;
    if (maxScroll <= 0) return 100;

    return Math.min(100, Math.round((scrollTop / maxScroll) * 100));
};

/**
 * Hook pour gérer l'historique de recherche
 */
export const useSearchHistory = (storageKey: string = 'search_history') => {
    const getHistory = (): string[] => {
        if (typeof window === 'undefined') return [];

        try {
            const stored = localStorage.getItem(storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    };

    const addToHistory = (query: string) => {
        if (!query.trim() || typeof window === 'undefined') return;

        const history = getHistory();
        const filtered = history.filter(q => q.toLowerCase() !== query.toLowerCase());
        const newHistory = [query, ...filtered].slice(0, 10); // Max 10 recherches

        try {
            localStorage.setItem(storageKey, JSON.stringify(newHistory));
        } catch (error) {
            console.error('Error saving search history:', error);
        }
    };

    const clearHistory = () => {
        if (typeof window === 'undefined') return;

        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            console.error('Error clearing search history:', error);
        }
    };

    return {
        getHistory,
        addToHistory,
        clearHistory
    };
};
