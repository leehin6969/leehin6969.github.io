/**
 * Route preloader utility for improving navigation performance
 * Provides intelligent preloading of routes based on user interaction patterns
 */

class RoutePreloader {
    constructor() {
        this.prefetchedRoutes = new Set();
        this.preloadPromises = new Map();
        this.priorityRoutes = ['/projects', '/experience']; // Updated priority routes
        this.failedRoutes = new Set(); // Track failed preloads
    }

    /**
     * Preload a specific route with retry logic
     * @param {string} path - The route path to preload
     * @param {Function} importFn - The dynamic import function for the route
     * @param {number} retries - Number of retry attempts
     * @returns {Promise} - The preload promise
     */
    async preloadRoute(path, importFn, retries = 1) {
        if (this.prefetchedRoutes.has(path)) {
            return this.preloadPromises.get(path);
        }

        if (this.failedRoutes.has(path) && retries <= 0) {
            return Promise.resolve(false);
        }

        const preloadPromise = importFn()
            .then(() => {
                this.prefetchedRoutes.add(path);
                this.failedRoutes.delete(path); // Remove from failed list on success
                return true;
            })
            .catch((error) => {
                console.warn(`Failed to preload route ${path}:`, error);
                this.failedRoutes.add(path);

                // Retry if attempts remaining
                if (retries > 0) {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve(this.preloadRoute(path, importFn, retries - 1));
                        }, 100); // Short delay before retry
                    });
                }
                return false;
            });

        this.preloadPromises.set(path, preloadPromise);
        return preloadPromise;
    }

    /**
     * Preload priority routes in the background with higher priority
     * @param {Object} routeMap - Map of paths to import functions
     */
    async preloadPriorityRoutes(routeMap) {
        const preloadPromises = this.priorityRoutes
            .filter(path => !this.prefetchedRoutes.has(path) && !this.failedRoutes.has(path))
            .map(path => this.preloadRoute(path, routeMap[path], 2)); // More retries for priority routes

        return Promise.allSettled(preloadPromises);
    }

    /**
     * Preload all routes except the current one
     * @param {Object} routeMap - Map of paths to import functions
     * @param {string} currentPath - Current active path to exclude
     */
    async preloadAllRoutes(routeMap, currentPath = null) {
        const preloadPromises = Object.entries(routeMap)
            .filter(([path]) => path !== currentPath && !this.prefetchedRoutes.has(path) && !this.failedRoutes.has(path))
            .map(([path, importFn]) => this.preloadRoute(path, importFn, 1));

        return Promise.allSettled(preloadPromises);
    }

    /**
     * Force preload a route immediately (for critical navigation)
     * @param {string} path - The route path to preload
     * @param {Function} importFn - The dynamic import function for the route
     * @returns {Promise} - The preload promise
     */
    async forcePreloadRoute(path, importFn) {
        // Remove from failed routes to allow retry
        this.failedRoutes.delete(path);
        return this.preloadRoute(path, importFn, 3); // More aggressive retry
    }

    /**
     * Check if a route is already preloaded
     * @param {string} path - The route path to check
     * @returns {boolean} - Whether the route is preloaded
     */
    isPreloaded(path) {
        return this.prefetchedRoutes.has(path);
    }

    /**
     * Check if a route failed to preload
     * @param {string} path - The route path to check
     * @returns {boolean} - Whether the route failed to preload
     */
    isFailed(path) {
        return this.failedRoutes.has(path);
    }

    /**
     * Get preload statistics
     * @returns {Object} - Statistics about preloaded routes
     */
    getStats() {
        return {
            preloadedCount: this.prefetchedRoutes.size,
            preloadedRoutes: Array.from(this.prefetchedRoutes),
            failedCount: this.failedRoutes.size,
            failedRoutes: Array.from(this.failedRoutes),
            pendingCount: this.preloadPromises.size - this.prefetchedRoutes.size - this.failedRoutes.size
        };
    }

    /**
     * Clear all preloaded routes (useful for testing or memory management)
     */
    clear() {
        this.prefetchedRoutes.clear();
        this.preloadPromises.clear();
        this.failedRoutes.clear();
    }
}

// Export a singleton instance
export const routePreloader = new RoutePreloader();

// Export the class for custom instances if needed
export default RoutePreloader; 