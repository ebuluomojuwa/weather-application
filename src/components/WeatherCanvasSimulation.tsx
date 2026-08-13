import React, { useEffect, useRef } from 'react';
import { WeatherSimulationType } from '../types/weather';

interface WeatherCanvasSimulationProps {
  simulationType: WeatherSimulationType;
  isNight?: boolean;
  intensity?: number; // 0.5 to 1.5
}

export const WeatherCanvasSimulation: React.FC<WeatherCanvasSimulationProps> = ({
  simulationType,
  isNight = false,
  intensity = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Simulation particle pools
    interface RainDrop {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      thickness: number;
    }

    interface Splash {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
    }

    interface Snowflake {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      opacity: number;
      angle: number;
    }

    interface SunRayMote {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      opacity: number;
      pulse: number;
      pulseSpeed: number;
    }

    interface CloudMist {
      x: number;
      y: number;
      radius: number;
      speedX: number;
      opacity: number;
    }

    // Initialize arrays
    const rainDrops: RainDrop[] = [];
    const splashes: Splash[] = [];
    const snowflakes: Snowflake[] = [];
    const sunMotes: SunRayMote[] = [];
    const clouds: CloudMist[] = [];

    // Initialize rain
    const rainCount = Math.round((simulationType === 'heavy_rain' || simulationType === 'thunderstorm' ? 350 : 150) * intensity);
    for (let i = 0; i < rainCount; i++) {
      rainDrops.push({
        x: Math.random() * width * 1.2 - width * 0.1,
        y: Math.random() * height,
        length: Math.random() * 25 + 15,
        speed: Math.random() * 12 + 18,
        opacity: Math.random() * 0.4 + 0.3,
        thickness: Math.random() * 1.5 + 0.8,
      });
    }

    // Initialize snow
    const snowCount = Math.round((simulationType === 'blizzard' ? 300 : 120) * intensity);
    for (let i = 0; i < snowCount; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        speedY: Math.random() * 1.5 + 0.8,
        speedX: Math.random() * 0.8 - 0.4,
        opacity: Math.random() * 0.7 + 0.3,
        angle: Math.random() * Math.PI * 2,
      });
    }

    // Initialize sun motes / heat particles
    const moteCount = Math.round(70 * intensity);
    for (let i = 0; i < moteCount; i++) {
      sunMotes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        speedY: (Math.random() - 0.7) * 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    // Initialize fog/clouds
    const cloudCount = 12;
    for (let i = 0; i < cloudCount; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.7,
        radius: Math.random() * 150 + 100,
        speedX: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.15 + 0.05,
      });
    }

    // Lightning state
    let lightningTimer = 0;
    let lightningOpacity = 0;

    let tick = 0;

    // Render loop
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // --- SUNNY / EXTREME HOT SIMULATION ---
      if (simulationType === 'sunny' || simulationType === 'extreme_hot') {
        const sunX = width * 0.85;
        const sunY = height * 0.18;

        if (!isNight) {
          // Draw Sun radial glow
          const glowGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, width * 0.6);
          if (simulationType === 'extreme_hot') {
            glowGrad.addColorStop(0, 'rgba(255, 140, 0, 0.6)');
            glowGrad.addColorStop(0.2, 'rgba(255, 80, 0, 0.3)');
            glowGrad.addColorStop(0.6, 'rgba(255, 50, 0, 0.1)');
            glowGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');
          } else {
            glowGrad.addColorStop(0, 'rgba(255, 240, 180, 0.7)');
            glowGrad.addColorStop(0.2, 'rgba(255, 210, 100, 0.35)');
            glowGrad.addColorStop(0.5, 'rgba(255, 180, 50, 0.12)');
            glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          }

          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(sunX, sunY, width * 0.6, 0, Math.PI * 2);
          ctx.fill();

          // Rotating Solar Rays
          ctx.save();
          ctx.translate(sunX, sunY);
          ctx.rotate(tick * 0.001);
          const rayCount = simulationType === 'extreme_hot' ? 12 : 8;
          ctx.fillStyle = simulationType === 'extreme_hot' ? 'rgba(255, 180, 0, 0.05)' : 'rgba(255, 255, 200, 0.04)';
          for (let r = 0; r < rayCount; r++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, Math.max(width, height), (r * Math.PI * 2) / rayCount, ((r + 0.4) * Math.PI * 2) / rayCount);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();

          // Draw Sun Disc
          ctx.beginPath();
          ctx.arc(sunX, sunY, 45, 0, Math.PI * 2);
          ctx.fillStyle = simulationType === 'extreme_hot' ? '#fff176' : '#ffffff';
          ctx.shadowColor = simulationType === 'extreme_hot' ? '#ff6d00' : '#ffd54f';
          ctx.shadowBlur = 40;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          // Night moon glow
          const moonX = width * 0.85;
          const moonY = height * 0.18;

          const moonGlow = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 200);
          moonGlow.addColorStop(0, 'rgba(200, 220, 255, 0.4)');
          moonGlow.addColorStop(1, 'rgba(200, 220, 255, 0)');

          ctx.fillStyle = moonGlow;
          ctx.beginPath();
          ctx.arc(moonX, moonY, 200, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(moonX, moonY, 30, 0, Math.PI * 2);
          ctx.fillStyle = '#f0f4f8';
          ctx.shadowColor = '#90caf9';
          ctx.shadowBlur = 25;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Draw Floating Sun Motes / Heat Shimmer Particles
        for (let i = 0; i < sunMotes.length; i++) {
          const m = sunMotes[i];
          m.pulse += m.pulseSpeed;
          m.y += m.speedY;
          m.x += m.speedX;

          if (m.y < 0) m.y = height;
          if (m.y > height) m.y = 0;
          if (m.x < 0) m.x = width;
          if (m.x > width) m.x = 0;

          const currentOpacity = Math.sin(m.pulse) * 0.3 + m.opacity;

          ctx.beginPath();
          ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
          ctx.fillStyle = simulationType === 'extreme_hot' 
            ? `rgba(255, 200, 100, ${Math.max(0, currentOpacity)})`
            : isNight 
              ? `rgba(220, 240, 255, ${Math.max(0, currentOpacity)})`
              : `rgba(255, 235, 150, ${Math.max(0, currentOpacity)})`;
          ctx.fill();
        }
      }

      // --- RAINY / HEAVY RAIN / THUNDERSTORM SIMULATION ---
      if (
        simulationType === 'rainy' ||
        simulationType === 'heavy_rain' ||
        simulationType === 'thunderstorm'
      ) {
        // Draw Raindrops
        const windAngle = simulationType === 'heavy_rain' ? 0.25 : 0.12;
        ctx.strokeStyle = isNight ? 'rgba(180, 210, 255, 0.5)' : 'rgba(255, 255, 255, 0.55)';
        
        for (let i = 0; i < rainDrops.length; i++) {
          const drop = rainDrops[i];
          drop.y += drop.speed;
          drop.x += drop.speed * windAngle;

          if (drop.y > height) {
            // Chance to trigger ground splash
            if (Math.random() < 0.4) {
              splashes.push({
                x: drop.x,
                y: height - Math.random() * 20,
                radius: 1,
                maxRadius: Math.random() * 12 + 6,
                opacity: 0.6,
              });
            }
            drop.y = -drop.length;
            drop.x = Math.random() * width * 1.2 - width * 0.1;
          }

          ctx.lineWidth = drop.thickness;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + drop.length * windAngle, drop.y + drop.length);
          ctx.stroke();
        }

        // Draw Splashes
        for (let i = splashes.length - 1; i >= 0; i--) {
          const s = splashes[i];
          s.radius += 0.8;
          s.opacity -= 0.03;

          if (s.opacity <= 0 || s.radius >= s.maxRadius) {
            splashes.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.ellipse(s.x, s.y, s.radius * 1.5, s.radius * 0.5, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(220, 240, 255, ${s.opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Thunderstorm Lightning Flash
        if (simulationType === 'thunderstorm') {
          lightningTimer++;
          if (lightningTimer > 180 && Math.random() < 0.03) {
            lightningOpacity = 0.95;
            lightningTimer = 0;
          }

          if (lightningOpacity > 0) {
            lightningOpacity -= 0.05;
            ctx.fillStyle = `rgba(240, 245, 255, ${Math.max(0, lightningOpacity)})`;
            ctx.fillRect(0, 0, width, height);

            // Draw lightning bolt
            if (lightningOpacity > 0.6) {
              ctx.beginPath();
              let boltX = width * (0.3 + Math.random() * 0.4);
              let boltY = 0;
              ctx.moveTo(boltX, boltY);
              while (boltY < height * 0.7) {
                boltX += (Math.random() - 0.5) * 60;
                boltY += Math.random() * 40 + 20;
                ctx.lineTo(boltX, boltY);
              }
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 3;
              ctx.shadowColor = '#a5f3fc';
              ctx.shadowBlur = 20;
              ctx.stroke();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      // --- SNOWY / BLIZZARD / EXTREME COLD SIMULATION ---
      if (
        simulationType === 'snowy' ||
        simulationType === 'blizzard' ||
        simulationType === 'extreme_cold'
      ) {
        const windX = simulationType === 'blizzard' ? 2.5 : 0.5;

        for (let i = 0; i < snowflakes.length; i++) {
          const flake = snowflakes[i];
          flake.angle += 0.02;
          flake.y += flake.speedY;
          flake.x += Math.sin(flake.angle) * flake.speedX + windX;

          if (flake.y > height) {
            flake.y = -10;
            flake.x = Math.random() * width;
          }
          if (flake.x > width) flake.x = 0;
          if (flake.x < 0) flake.x = width;

          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
          ctx.shadowColor = '#e0f2fe';
          ctx.shadowBlur = flake.radius > 2 ? 6 : 0;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // --- FOGGY / CLOUDY SIMULATION ---
      if (
        simulationType === 'foggy' ||
        simulationType === 'cloudy' ||
        simulationType === 'partly_cloudy'
      ) {
        for (let i = 0; i < clouds.length; i++) {
          const c = clouds[i];
          c.x += c.speedX;
          if (c.x - c.radius > width) {
            c.x = -c.radius;
            c.y = Math.random() * height * 0.7;
          }

          const grad = ctx.createRadialGradient(c.x, c.y, c.radius * 0.2, c.x, c.y, c.radius);
          grad.addColorStop(0, `rgba(255, 255, 255, ${c.opacity})`);
          grad.addColorStop(0.8, `rgba(240, 245, 255, ${c.opacity * 0.4})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [simulationType, isNight, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
};
