import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SemanticSearchEngine } from '../../models/search/SemanticSearch';

// ============================================================================
// TYPES
// ============================================================================

interface SemanticSearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    recentSearches?: string[];
    onRecentSearchClick?: (search: string) => void;
}

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export const SemanticSearchBar: React.FC<SemanticSearchBarProps> = ({
    onSearch,
    placeholder = 'Recherche sémantique intelligente...',
    recentSearches = [],
    onRecentSearchClick
}) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Générer des suggestions quand l'utilisateur tape
    useEffect(() => {
        if (query.trim().length > 2) {
            const newSuggestions = SemanticSearchEngine.getSuggestions(query, recentSearches);
            setSuggestions(newSuggestions);
        } else {
            setSuggestions(recentSearches.slice(0, 5));
        }
    }, [query, recentSearches]);

    const handleSearch = (searchQuery: string) => {
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
            setIsFocused(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(query);
        } else if (e.key === 'Escape') {
            setIsFocused(false);
            inputRef.current?.blur();
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        handleSearch(suggestion);
        if (onRecentSearchClick) {
            onRecentSearchClick(suggestion);
        }
    };

    const clearQuery = () => {
        setQuery('');
        inputRef.current?.focus();
    };

    const showSuggestions = isFocused && (suggestions.length > 0 || recentSearches.length > 0);

    return (
        <div className="relative">
            {/* Barre de recherche */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                {query && (
                    <button
                        onClick={clearQuery}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Suggestions dropdown */}
            <AnimatePresence>
                {showSuggestions && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg max-h-64 overflow-y-auto"
                    >
                        {/* En-tête si recherches récentes */}
                        {query.trim().length === 0 && recentSearches.length > 0 && (
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Clock className="h-3 w-3" />
                                    <span>Recherches récentes</span>
                                </div>
                            </div>
                        )}

                        {/* En-tête si suggestions */}
                        {query.trim().length > 2 && suggestions.length > 0 && (
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>Suggestions</span>
                                </div>
                            </div>
                        )}

                        {/* Liste des suggestions */}
                        <div>
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors flex items-center gap-2 group"
                                >
                                    <Search className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                                    <span className="text-sm text-gray-700 group-hover:text-blue-600">
                                        {suggestion}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Message si aucune suggestion */}
                        {suggestions.length === 0 && query.trim().length > 0 && (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                Appuyez sur Entrée pour rechercher "{query}"
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SemanticSearchBar;
