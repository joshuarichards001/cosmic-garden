import { useEffect, useRef } from 'react';

interface Particle {
  size: number;
  color: string;
  angle: number;
  distance: number;
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

    const mouse = { x: -1000, y: -1000 };
    let cachedRect: DOMRect | null = null;

    const updateRect = () => {
      cachedRect = canvas.getBoundingClientRect();
    };

    const handleScroll = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      updateRect();
    };

    const particleCount = 3000;
    const armCount = 4;
    const armSpread = 1.0;
    const rotationSpeed = 0.0005;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const newWidth = parent.clientWidth;
      if (newWidth === width) return;

      width = newWidth;
      height = width < 640 ? width : Math.min(width * 0.7, 550);
      canvas.width = width;
      canvas.height = height;
      centerX = width / 2;
      centerY = height / 2;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const maxRadius = Math.min(width, height) / 2 - 20;

      for (let i = 0; i < particleCount; i++) {
        const t = Math.random();
        const distance = t * maxRadius;
        const spiralAngle = t * 5;
        const armIndex = Math.floor(Math.random() * armCount);
        const armAngle = (armIndex * Math.PI * 2) / armCount;
        const angle = armAngle + spiralAngle + (Math.random() - 0.5) * armSpread;

        const hue = (distance / maxRadius) * 360 + Math.random() * 50;
        const lightness = 50 + Math.random() * 50;

        particles.push({
          size: Math.random() * 2 + (1 - t) * 2,
          color: `hsla(${hue}, 80%, ${lightness}%, ${0.5 + Math.random() * 0.5})`,
          angle,
          distance,
        });
      }
    };

    let globalRotation = 0;
    const interactionRadius = 150;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      globalRotation -= rotationSpeed;

      for (const p of particles) {
        const currentAngle = p.angle + globalRotation;
        let x = centerX + Math.cos(currentAngle) * p.distance;
        let y = centerY + Math.sin(currentAngle) * p.distance;

        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < interactionRadius) {
          const force = (interactionRadius - dist) / interactionRadius;
          const angleToMouse = Math.atan2(dy, dx);
          x -= Math.cos(angleToMouse) * force * 20;
          y -= Math.sin(angleToMouse) * force * 20;
        }

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!cachedRect) return;
      mouse.x = e.clientX - cachedRect.left;
      mouse.y = e.clientY - cachedRect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!cachedRect || !touch) return;
      mouse.x = touch.clientX - cachedRect.left;
      mouse.y = touch.clientY - cachedRect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!cachedRect || !touch) return;
      mouse.x = touch.clientX - cachedRect.left;
      mouse.y = touch.clientY - cachedRect.top;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleMouseLeave);

    resize();
    updateRect();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
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
