/**
 * Utilitaires pour optimiser les performances
 */

/**
 * Debounce une fonction
 * @param func Fonction à debouncer
 * @param wait Temps d'attente en ms
 * @returns Fonction debouncée
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle une fonction
 * @param func Fonction à throttler
 * @param limit Temps limite en ms
 * @returns Fonction throttlée
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load une image
 * @param src Source de l'image
 * @returns Promise qui se résout quand l'image est chargée
 */
export function lazyLoadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Prefetch une route
 * @param path Chemin de la route
 */
export function prefetchRoute(path: string): void {
  // Utiliser le prefetching natif du navigateur si disponible
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = path;
      document.head.appendChild(link);
    });
  }
}

/**
 * Mesurer les performances d'une fonction
 * @param name Nom de la fonction
 * @param fn Fonction à mesurer
 * @returns Résultat de la fonction
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<T> {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return fn();
}

/**
 * Vérifier si un élément est dans le viewport
 * @param element Élément à vérifier
 * @returns true si l'élément est visible
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Observer pour le lazy loading d'éléments
 * @param callback Fonction appelée quand l'élément est visible
 * @param options Options de l'IntersectionObserver
 * @returns IntersectionObserver
 */
export function createLazyObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  });
}


