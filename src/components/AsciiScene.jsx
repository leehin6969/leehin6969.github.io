import { useEffect, useRef, memo } from 'react';
import * as THREE from 'three';
import styled from '@emotion/styled';

// A full-screen container that will hold the AsciiEffect DOM element.
// It sits behind the main content (z-index -2) and covers the viewport.
const Container = styled.div`
  position: absolute;
  top: 0;
  left: -250px;
  width: 100%;
  height: 100%;
  z-index: 0; /* behind content inside the same parent */
  overflow: hidden;

  @media (max-width: 768px) {
    left: 0; /* Reset left position on mobile */
    top: 0;
    width: 100%;
    height: 100%;
  }
`;

/**
 * AsciiScene renders the classic three.js ASCII demo inside React.
 *
 * The effect is created once on mount and disposed on unmount to avoid leaks.
 *
 * Because it appends its own DOM element (effect.domElement), we keep a
 * ref to a Container <div> and append inside it so React can still manage
 * the overall DOM tree.
 */
const AsciiScene = memo(function AsciiScene() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let cleanup;

        // Dynamically load the helper classes so we don't need static imports
        Promise.all([
            import('three/examples/jsm/effects/AsciiEffect.js'),
            import('three/examples/jsm/controls/TrackballControls.js')
        ]).then(([{ AsciiEffect }, { TrackballControls }]) => {
            // Scene setup
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000000);

            const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
            // Camera position controls the initial view angle and distance
            // (x, y, z) - x: left/right, y: up/down, z: distance from scene
            camera.position.set(-250, 250, 700); // Default: centered, slightly above, far back
            // Examples:
            // camera.position.set(200, 100, 400); // Move right, closer
            // camera.position.set(-100, 200, 600); // Move left, higher, further

            // Lights
            const pointLight1 = new THREE.PointLight(0xffffff, 3, 0, 0);
            pointLight1.position.set(500, 500, 500);
            scene.add(pointLight1);

            const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0);
            pointLight2.position.set(-500, -500, -500);
            scene.add(pointLight2);

            // Objects
            const sphere = new THREE.Mesh(
                // Sphere size: (radius, widthSegments, heightSegments)
                new THREE.SphereGeometry(200, 20, 10), // Default: radius 200
                // Examples:
                // new THREE.SphereGeometry(150, 20, 10), // Smaller sphere
                // new THREE.SphereGeometry(300, 20, 10), // Larger sphere
                new THREE.MeshPhongMaterial({
                    flatShading: true,
                    color: 0xd86d73 // Coral-pink color matching the gradient
                    // Examples:
                    // color: 0xff0000 // Red
                    // color: 0x00ff00 // Green  
                    // color: 0x0066ff // Blue
                    // color: 0xff6600 // Orange
                    // color: 0x9966ff // Purple
                })
            );
            // You can also change the sphere's initial position:
            // sphere.position.set(0, 0, 0); // Default is (0, 0, 0)
            // sphere.position.set(100, -50, 0); // Move right and down
            scene.add(sphere);

            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(400, 400),
                new THREE.MeshBasicMaterial({ color: 0xe0e0e0 })
            );
            plane.position.y = -200;
            plane.rotation.x = -Math.PI / 2;
            scene.add(plane);

            // Renderer & effect
            const renderer = new THREE.WebGLRenderer({
                antialias: false, // Disable antialiasing for better performance
                powerPreference: "high-performance" // Request high-performance GPU
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
            renderer.outputColorSpace = THREE.SRGBColorSpace; // Optimize color space
            renderer.setSize(window.innerWidth, window.innerHeight);

            const effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
            effect.setSize(window.innerWidth, window.innerHeight);

            // Mobile-specific optimizations
            const isMobile = window.innerWidth <= 768;

            // Set ASCII color based on device type
            if (isMobile) {
                // Warm coral color matching your theme on mobile
                effect.domElement.style.color = '#ff8a95'; // Bright coral-pink
                effect.domElement.style.opacity = '0.4'; // Lower opacity for text readability
            } else {
                // Classic white color on desktop
                effect.domElement.style.color = 'white'; // Clean white
                effect.domElement.style.opacity = '0.8'; // Slightly transparent for text readability
            }

            effect.domElement.style.backgroundColor = '#181717';
            effect.domElement.style.width = '100%';
            effect.domElement.style.height = '100%';

            // Prevent text selection/highlighting when interacting with ASCII art
            effect.domElement.style.userSelect = 'none';
            effect.domElement.style.webkitUserSelect = 'none';
            effect.domElement.style.mozUserSelect = 'none';
            effect.domElement.style.msUserSelect = 'none';
            effect.domElement.style.webkitTouchCallout = 'none';
            effect.domElement.style.webkitTapHighlightColor = 'transparent';

            if (isMobile) {
                // Reduce animation complexity on mobile
                effect.domElement.style.fontSize = '6px'; // Smaller font for mobile
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Further limit pixel ratio on mobile
            }

            container.appendChild(effect.domElement);

            // Controls
            const controls = new TrackballControls(camera, effect.domElement);

            // Mobile-friendly controls
            if (isMobile) {
                controls.rotateSpeed = 0.5; // Slower rotation on mobile
                controls.zoomSpeed = 0.8; // Slower zoom on mobile
                controls.panSpeed = 0.5; // Slower pan on mobile
            }

            // Animation loop with ultra-optimized performance
            const start = Date.now();
            let frameId;
            let lastTime = 0;
            const targetFPS = isMobile ? 20 : 30; // Lower FPS on mobile for better performance
            const frameInterval = 1000 / targetFPS;
            let isPaused = false;
            let pausedTime = 0;
            let pausedY = 0;
            let pausedRotationX = 0;
            let pausedRotationZ = 0;

            // Ultra-aggressive performance monitoring
            let isPageTransitioning = false;
            let transitionTimeout;

            // Listen for any navigation events
            const handleNavigationStart = () => {
                isPageTransitioning = true;
                clearTimeout(transitionTimeout);
            };

            const handleNavigationEnd = () => {
                clearTimeout(transitionTimeout);
                transitionTimeout = setTimeout(() => {
                    isPageTransitioning = false;
                }, 150); // Wait longer for transition to complete
            };

            // Listen for clicks on navigation
            const handleSidebarClick = (e) => {
                if (e.target.closest('nav')) {
                    handleNavigationStart();
                    setTimeout(handleNavigationEnd, 100);
                }
            };

            // Click handler
            const handleClick = (event) => {
                // Get sphere's screen position
                const rect = effect.domElement.getBoundingClientRect();
                const clickX = event.clientX - rect.left;
                const clickY = event.clientY - rect.top;

                // Project sphere position to screen coordinates
                const sphereScreenPos = new THREE.Vector3();
                sphereScreenPos.copy(sphere.position);
                sphereScreenPos.project(camera);

                // Convert to pixel coordinates
                const sphereX = (sphereScreenPos.x * 0.5 + 0.5) * rect.width;
                const sphereY = (-sphereScreenPos.y * 0.5 + 0.5) * rect.height;

                // Calculate distance from click to sphere center
                const distance = Math.sqrt(
                    Math.pow(clickX - sphereX, 2) + Math.pow(clickY - sphereY, 2)
                );

                // If click is within sphere radius (adjust 100 for sensitivity)
                // Increase touch area on mobile for better usability
                const touchRadius = isMobile ? 150 : 100;
                if (distance < touchRadius) {
                    isPaused = !isPaused;

                    if (isPaused) {
                        pausedTime = Date.now() - start;
                        pausedY = sphere.position.y;
                        pausedRotationX = sphere.rotation.x;
                        pausedRotationZ = sphere.rotation.z;
                    }
                }
            };

            // Add click event listener
            effect.domElement.addEventListener('click', handleClick);
            // Add touch event listener for mobile
            effect.domElement.addEventListener('touchstart', handleClick);
            document.addEventListener('click', handleSidebarClick);

            const animate = (currentTime) => {
                // Completely pause during page transitions for maximum performance
                if (isPageTransitioning) {
                    frameId = requestAnimationFrame(animate);
                    return;
                }

                // Ultra-low frame rate during transitions
                const currentTargetFPS = isMobile ? 8 : 10; // Even lower on mobile
                const currentFrameInterval = 1000 / currentTargetFPS;

                // Frame rate limiting for consistent performance
                if (currentTime - lastTime < currentFrameInterval) {
                    frameId = requestAnimationFrame(animate);
                    return;
                }
                lastTime = currentTime;

                if (!isPaused) {
                    const timer = Date.now() - start;
                    // Ball jumping speed - slower for smoother appearance and better mobile performance
                    // Reduced from 0.001 to 0.0005 (50% slower), further reduced on mobile
                    const jumpSpeed = isMobile ? 0.0003 : 0.0005;
                    sphere.position.y = Math.abs(Math.sin(timer * jumpSpeed)) * 150;

                    // Ball rotation speeds - slower for smoother appearance and mobile optimization
                    // Reduced rotation speeds by ~50% for more fluid motion, further reduced on mobile
                    const rotationSpeedX = isMobile ? 0.0001 : 0.00015;
                    const rotationSpeedZ = isMobile ? 0.00007 : 0.0001;
                    sphere.rotation.x = timer * rotationSpeedX; // X-axis rotation speed
                    sphere.rotation.z = timer * rotationSpeedZ;  // Z-axis rotation speed
                } else {
                    // Keep sphere at paused position
                    sphere.position.y = pausedY;
                    sphere.rotation.x = pausedRotationX;
                    sphere.rotation.z = pausedRotationZ;
                }

                controls.update();
                effect.render(scene, camera);
                frameId = requestAnimationFrame(animate);
            };
            animate(0);

            // Listen for all possible navigation events
            window.addEventListener('beforeunload', handleNavigationStart);
            window.addEventListener('popstate', handleNavigationStart);
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    handleNavigationStart();
                } else {
                    handleNavigationEnd();
                }
            });

            // Resize handling with debouncing
            let resizeTimeout;
            const handleResize = () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    const newWidth = window.innerWidth;
                    const newHeight = window.innerHeight;

                    camera.aspect = newWidth / newHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(newWidth, newHeight);
                    effect.setSize(newWidth, newHeight);

                    // Update mobile detection and ASCII color on resize
                    const newIsMobile = newWidth <= 768;
                    if (newIsMobile !== isMobile) {
                        // Restart with new mobile settings if needed
                        if (newIsMobile) {
                            effect.domElement.style.fontSize = '6px';
                            effect.domElement.style.color = '#ff8a95'; // Warm coral on mobile
                            effect.domElement.style.opacity = '0.4';
                            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                        } else {
                            effect.domElement.style.fontSize = '';
                            effect.domElement.style.color = 'white'; // Clean white on desktop
                            effect.domElement.style.opacity = '0.8';
                            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                        }
                    }
                }, 100);
            };

            window.addEventListener('resize', handleResize);

            // Cleanup function
            cleanup = () => {
                if (frameId) {
                    cancelAnimationFrame(frameId);
                }

                // Remove event listeners
                effect.domElement.removeEventListener('click', handleClick);
                effect.domElement.removeEventListener('touchstart', handleClick);
                document.removeEventListener('click', handleSidebarClick);
                window.removeEventListener('beforeunload', handleNavigationStart);
                window.removeEventListener('popstate', handleNavigationStart);
                document.removeEventListener('visibilitychange', () => {
                    if (document.hidden) {
                        handleNavigationStart();
                    } else {
                        handleNavigationEnd();
                    }
                });
                window.removeEventListener('resize', handleResize);

                // Clean up Three.js objects
                scene.traverse((object) => {
                    if (object.geometry) {
                        object.geometry.dispose();
                    }
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(material => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });

                renderer.dispose();
                controls.dispose();

                // Remove DOM element
                if (container && effect.domElement) {
                    container.removeChild(effect.domElement);
                }

                clearTimeout(resizeTimeout);
                clearTimeout(transitionTimeout);
            };
        }).catch(console.error);

        return () => {
            if (cleanup) cleanup();
        };
    }, []);

    return <Container ref={containerRef} />;
});

export default AsciiScene; 