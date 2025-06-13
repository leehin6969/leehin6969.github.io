import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, Suspense, lazy, useCallback, useMemo } from 'react';
import { routePreloader } from './lib/routePreloader';

// Lazy load all pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Experience = lazy(() => import('./pages/Experience'));
const Contact = lazy(() => import('./pages/Contact'));

// Import AsciiScene normally since it's always needed
import AsciiScene from './components/AsciiScene';

// Prefetch functions for preloading routes
const prefetchRoutes = {
  '/': () => import('./pages/Home'),
  '/projects': () => import('./pages/Projects'),
  '/experience': () => import('./pages/Experience'),
  '/contact': () => import('./pages/Contact'),
};

// Component cache to store preloaded components
const componentCache = new Map();

const AppContainer = styled.div`
  height: 100vh;
  overflow: hidden;
  /* transparent so ASCII scene is visible */
  background: transparent;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a1a'};
  transition: all 0.3s ease;
  
  /* Prevent text selection globally */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;

  /* Prevent page scrolling on mobile */
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    height: 100dvh; /* Use dynamic viewport height for mobile */
    overflow: hidden;
  }
`;

const Frame = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  border: 2px solid transparent;
  border-image-slice: 1;
  border-image-source: ${props => `linear-gradient(${props.angle}deg, #5c2c23 0%, #a4453f 50%, #d86d73 100%)`};
  border-radius: 12px;
  background-color: rgba(24, 23, 23, 0.5); /* #181717 with transparency */
  display: flex;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border-radius: 8px;
    flex-direction: column;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    height: calc(100dvh - 16px); /* Use dynamic viewport height minus margins */
    max-height: calc(100dvh - 16px);
  }

  @media (max-width: 480px) {
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    border-radius: 6px;
    height: calc(100dvh - 8px);
    max-height: calc(100dvh - 8px);
  }
`;

const Watermark = styled.div`
  position: fixed;
  top: 5px;
  right: 30px;
  font-size: 0.5rem;
  font-weight: 300;
  color: ${props => props.theme === 'dark' ? '#666666' : '#999999'};
  opacity: 0.6;
  z-index: 10;
  pointer-events: none;
  user-select: none;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    top: 12px;
    right: 12px;
    font-size: 0.4rem;
  }

  @media (max-width: 480px) {
    top: 8px;
    right: 8px;
    font-size: 0.35rem;
  }
`;

const Sidebar = styled.nav`
  width: 280px;
  background: transparent;
  border-right: none;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  pointer-events: auto; /* Allow interactions with sidebar elements */
  
  /* But allow child elements to be interactive */
  * {
    pointer-events: auto;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem 1rem;
    flex-direction: row;
    align-items: center;
    min-height: auto;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0; /* Prevent shrinking on mobile */
  }

  @media (max-width: 480px) {
    padding: 0.75rem 0.75rem;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
`;

const Logo = styled.div`
  margin-bottom: 3rem;
  
  a {
    font-size: 3rem;
    font-weight: 200;
    word-spacing: 0.35em;
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#1a1a1a'};
    text-decoration: none;
    transition: text-shadow 0.3s ease;
    display: block;
    
    &:hover {
      text-shadow: 
        1px 0px 0px #5c2c23,
        2px 0px 0px #a4453f,
        3px 0px 0px #a4453f,
        4px 0px 0px #d86d73;
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 0;
    margin-right: auto;
    
    a {
      font-size: 1.75rem;
      word-spacing: 0.2em;
    }
  }

  @media (max-width: 480px) {
    a {
      font-size: 1.5rem;
    }
  }
`;

const Subtitle = styled.div`
  font-size: 0.9rem;
  font-weight: 300;
  color: ${props => props.theme === 'dark' ? '#aaaaaa' : '#666666'};
  margin-top: 0;
  letter-spacing: 0.1em;
  text-align: left;

  @media (max-width: 768px) {
    display: none; /* Hide subtitle on mobile to save space */
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;

  @media (max-width: 768px) {
    display: flex;
    gap: 1.25rem;
    flex-grow: 0;
    align-items: center;
  }

  @media (max-width: 480px) {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
`;

const NavLink = styled(Link)`
  display: block;
  padding: 0.15rem 0;
  color: ${props => props.active ? '#a4453f' : props.theme === 'dark' ? '#aaaaaa' : '#666666'};
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    color: ${props => props.active ? '#a4453f' : '#d86d73'};
  }
  
  ${props => props.active && `
    &::before {
      content: '';
      position: absolute;
      left: -1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 1.5rem;
      background: #a4453f;
      border-radius: 2px;
    }
  `}

  @media (max-width: 768px) {
    padding: 0.4rem 0;
    font-size: 0.85rem;
    
    ${props => props.active && `
      &::before {
        display: none;
      }
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: #a4453f;
        border-radius: 1px;
      }
    `}
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.3rem 0;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow: hidden;
  background: transparent;
  position: relative;
  z-index: 1;
  pointer-events: none; /* Let clicks pass through to ASCII scene */
  
  /* Performance optimizations for smoother transitions */
  transform: translateZ(0); /* Force hardware acceleration */
  backface-visibility: hidden; /* Optimize for 3D transforms */
  -webkit-transform: translateZ(0); /* WebKit support */
  -webkit-backface-visibility: hidden;
  will-change: contents; /* Optimize for content changes */
  
  /* But allow child elements to be interactive */
  * {
    pointer-events: auto;
  }

  @media (max-width: 768px) {
    padding: 1rem 1rem;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    flex: 1;
    height: 0; /* Allow flex to control height */
    min-height: 0; /* Allow flex to shrink */
  }

  @media (max-width: 480px) {
    padding: 0.75rem 0.75rem;
  }
`;

// Ultra-fast loading component - completely invisible
const PageLoader = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
`;

// Smooth fade transition - balanced performance and visual appeal
const PageTransition = ({ children, pathname }) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }} // Proper fade from invisible
        animate={{ opacity: 1 }} // Fade to fully visible
        exit={{ opacity: 0 }} // Fade out to invisible
        transition={{
          duration: 0.2, // Smooth but still fast transition
          ease: "easeInOut" // Smooth easing for better visual appeal
        }}
        style={{
          height: pathname === '/' ? '90%' : 'auto',
          pointerEvents: pathname === '/' ? 'none' : 'auto',
          willChange: 'opacity',
          transform: 'translateZ(0)', // Hardware acceleration
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Navigation items array for easier management
const navItems = [
  { path: '/', label: 'Home' },
  { path: '/projects', label: 'Projects' },
  { path: '/experience', label: 'Experience' },
  { path: '/contact', label: 'Contact' },
];

function App() {
  const theme = 'dark';
  const [angle, setAngle] = useState(135);
  const location = useLocation();

  // Ultra-aggressive prefetch handlers
  const handleRouteHover = useCallback((path) => {
    if (!routePreloader.isPreloaded(path) && prefetchRoutes[path]) {
      // Force immediate preloading
      routePreloader.forcePreloadRoute(path, prefetchRoutes[path]);
    }
  }, []);

  const handleRouteMouseDown = useCallback((path) => {
    if (!routePreloader.isPreloaded(path) && prefetchRoutes[path]) {
      routePreloader.forcePreloadRoute(path, prefetchRoutes[path]);
    }
  }, []);

  // Preload on focus/touch as well
  const handleRouteFocus = useCallback((path) => {
    if (!routePreloader.isPreloaded(path) && prefetchRoutes[path]) {
      routePreloader.forcePreloadRoute(path, prefetchRoutes[path]);
    }
  }, []);

  // Memoize heavy calculations
  const frameProps = useMemo(() => ({
    theme,
    angle
  }), [theme, angle]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    const target = { angle: 135 };
    let rafId = null;
    const handleMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const raw = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
      target.angle = Math.round(raw / 3) * 3; // snap
    };
    window.addEventListener('mousemove', handleMove);

    const animate = () => {
      setAngle(prev => {
        const diff = ((target.angle - prev + 540) % 360) - 180; // shortest path
        const step = diff * 0.05; // smoothing factor 0.05 (~0.5s to settle)
        if (Math.abs(diff) < 0.3) return prev; // close enough
        return (prev + step + 360) % 360;
      });
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Immediate and comprehensive route preloading
  useEffect(() => {
    // Start preloading everything immediately
    const preloadAll = async () => {
      // Priority routes first
      await routePreloader.preloadPriorityRoutes(prefetchRoutes);
      // Then all others
      await routePreloader.preloadAllRoutes(prefetchRoutes, location.pathname);
    };

    // Start immediately
    preloadAll();
  }, [location.pathname]);

  // Prevent body scroll on mobile with better mobile viewport handling
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.body.style.height = '100dvh'; // Dynamic viewport height
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
      document.body.style.left = '0';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.left = '';
    }

    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      if (newIsMobile) {
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        document.body.style.height = '100dvh';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = '0';
        document.body.style.left = '0';
      } else {
        document.body.style.overflow = '';
        document.body.style.height = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        document.body.style.left = '';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      // Reset on cleanup
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.left = '';
    };
  }, []);

  return (
    <AppContainer theme={theme}>
      <Watermark theme={theme}>
        @Jesse Lee
      </Watermark>
      <Frame {...frameProps}>
        <AsciiScene />
        <Sidebar theme={theme}>
          <Logo theme={theme}>
            <Link to="/">Jesse Lee</Link>
            <Subtitle theme={theme}>Developer & Support</Subtitle>
          </Logo>
          <NavList>
            {navItems.map(({ path, label }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  active={location.pathname === path}
                  onMouseEnter={() => handleRouteHover(path)}
                  onMouseDown={() => handleRouteMouseDown(path)}
                  onFocus={() => handleRouteFocus(path)}
                  onTouchStart={() => handleRouteFocus(path)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </NavList>
        </Sidebar>
        <MainContent>
          <PageTransition pathname={location.pathname}>
            <Suspense fallback={<PageLoader />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </MainContent>
      </Frame>
    </AppContainer>
  );
}

export default App;
