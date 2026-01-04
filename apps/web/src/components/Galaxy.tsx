import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  angle: number;
  distance: number;
  speed: number;
  randomOffset: number;
}

export default function Galaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;

    // Interaction state
    const mouse = { x: -1000, y: -1000 };

    // Configuration
    const particleCount = 3000;
    const armCount = 4;
    const armSpread = 1.0; // How spread out the arms are
    const rotationSpeed = 0.0005; // Constant background rotation

    // Resize handler
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        width = parent.clientWidth;
        const isMobile = width < 640;
        height = isMobile ? width : Math.min(width * 0.7, 550);
        canvas.width = width;
        canvas.height = height;
        centerX = width / 2;
        centerY = height / 2;
        initParticles();
      }
    };

    // Initialize particles
    const initParticles = () => {
      particles = [];
      const maxRadius = Math.min(width, height) / 2 - 20;

      for (let i = 0; i < particleCount; i++) {
        // Logarithmic spiral distribution
        // distance from center (0 to 1)
        const t = Math.random();
        // More particles in the center
        const distance = t * maxRadius;

        // Angle based on arms + spiral factor + randomness
        const spiralAngle = t * 5;
        const armIndex = Math.floor(Math.random() * armCount);
        const armAngle = (armIndex * Math.PI * 2) / armCount;
        const randomSpread = (Math.random() - 0.5) * armSpread;

        const angle = armAngle + spiralAngle + randomSpread;

        // Colors: Full spectrum but weighted towards galaxy vibe
        // Center is hotter (white/yellow), edges are cooler (blue/purple) or varied
        const hue = (distance / maxRadius) * 360 + Math.random() * 50;
        const lightness = 50 + Math.random() * 50;
        const color = `hsla(${hue}, 80%, ${lightness}%, ${0.5 + Math.random() * 0.5})`;

        particles.push({
          x: 0,
          y: 0,
          baseX: 0,
          baseY: 0, // Will be calculated in loop
          size: Math.random() * 2 + (1 - t) * 2, // Larger in center
          color,
          angle,
          distance,
          speed: rotationSpeed,
          randomOffset: Math.random() * Math.PI * 2 // Start at random rotation phase
        });
      }
    };

    // Animation Loop
    let globalRotation = 0;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Trail effect
      ctx.clearRect(0, 0, width, height);

      // Optional: draw faint background instead of clear for trails? 
      // For "clean" style, clearRect is better. 
      // If trails desired, use fillRect with low opacity.
      // Let's stick to clean for now as trails can look messy on resize.

      globalRotation += rotationSpeed;

      particles.forEach(p => {
        // Calculate base position with global rotation
        const currentAngle = p.angle + globalRotation;

        // Base orbital position
        let x = centerX + Math.cos(currentAngle) * p.distance;
        let y = centerY + Math.sin(currentAngle) * p.distance;

        // Mouse interaction (displacement)
        // Calculate distance to mouse
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 150;

        if (dist < interactionRadius) {
          const force = (interactionRadius - dist) / interactionRadius;
          const angleToMouse = Math.atan2(dy, dx);
          // Push away slightly
          x -= Math.cos(angleToMouse) * force * 20;
          y -= Math.sin(angleToMouse) * force * 20;
        }

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Event Listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };


    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchend', handleMouseLeave);

    // Init
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchend', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center py-6 sm:py-10 px-4 sm:px-0">
      <canvas ref={canvasRef} className="cursor-crosshair" />
    </div>
  );
}
