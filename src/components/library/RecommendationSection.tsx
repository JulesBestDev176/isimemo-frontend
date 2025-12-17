import React from 'react';
import { motion } from 'framer-motion';
import type { ResourceRecommendation } from '../../models/recommendation/RecommendationEngine';
import type { RessourceMediatheque } from '../../models/ressource/RessourceMediatheque';

interface RecommendationSectionProps {
    recommendations: ResourceRecommendation[];
    onResourceClick: (resource: RessourceMediatheque) => void;
    isLoading?: boolean;
}

/**
 * Composant de section de recommandations simplifié
 * Version Netflix/TikTok : pas d'indicateurs visibles de recommandation
 * Les ressources apparaissent naturellement sans révéler qu'elles sont recommandées
 */
export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
    recommendations,
    onResourceClick,
    isLoading = false
}) => {
    if (isLoading) {
        return (
            <div className="bg-white border border-gray-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="animate-pulse">
                            <div className="h-32 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (recommendations.length === 0) {
        return null;
    }

    return (
        <div className="bg-white border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((recommendation, index) => (
                    <motion.div
                        key={recommendation.ressource.idRessource}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onResourceClick(recommendation.ressource)}
                        className="bg-white border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-all group"
                    >
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {recommendation.ressource.titre}
                        </h3>

                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {recommendation.ressource.description}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            {recommendation.ressource.categorie && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                    {recommendation.ressource.categorie}
                                </span>
                            )}
                            {recommendation.ressource.datePublication && (
                                <span>{new Date(recommendation.ressource.datePublication).getFullYear()}</span>
                            )}
                        </div>

                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs text-blue-600 font-medium">
                                Cliquez pour consulter →
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RecommendationSection;
