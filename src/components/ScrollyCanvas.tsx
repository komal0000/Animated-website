import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 192;

export const ScrollyCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  // Store image objects 
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  useEffect(() => {
    // 1. High-speed preloader using Promise.all architecture
    const loadImages = async () => {
      const promises = [];
      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        const frameNumber = i.toString().padStart(4, '0');
        img.src = `/frames/frame_${frameNumber}.webp`;
        
        const p = new Promise<void>((resolve) => {
          img.onload = () => {
            setLoadedFrames((prev) => prev + 1);
            resolve();
          };
          img.onerror = () => {
            // resolve anyway to avoid hanging
            setLoadedFrames((prev) => prev + 1);
            resolve();
          };
        });
        
        imagesRef.current.push(img);
        promises.push(p);
      }
      
      await Promise.all(promises);
      setIsReady(true);
      
      // Draw initial frame
      requestAnimationFrame(() => renderFrame(0));
    };
    
    loadImages();
  }, []);

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = imagesRef.current[index];
    if (img && img.complete && img.naturalHeight > 0) {
      // Ensure canvas matches window dimensions perfectly
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Calculate object-fit: cover scaling
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
  };

  useEffect(() => {
    if (!isReady || !wrapperRef.current) return;
    
    // Resize handler to ensure canvas stays full screen and retains aspect ratio
    const handleResize = () => {
      renderFrame(Math.round(playhead.frame));
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);
    
    // Responsive Physics: Reduce scrub on mobile
    const isMobile = window.innerWidth <= 768;
    const scrubValue = isMobile ? 0.8 : 1.5;
    
    const playhead = { frame: 0 };
    
    const st = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: scrubValue,
      snap: 1 / (FRAME_COUNT - 1), // Exact frame alignment
      animation: gsap.to(playhead, {
        frame: FRAME_COUNT - 1,
        ease: 'none',
        onUpdate: () => renderFrame(Math.round(playhead.frame))
      })
    });

    return () => {
      st.kill();
      gsap.killTweensOf(playhead);
      window.removeEventListener('resize', handleResize);
    };
  }, [isReady]);

  // Loading Screen: Zero-G Loader
  if (!isReady) {
    const progress = Math.min((loadedFrames / FRAME_COUNT) * 100, 100);
    return (
      <div className="loader-container">
        <h2 className="loader-text mb-6">Initializing Physics</h2>
        <div className="zero-g-loader glass-panel">
          <div 
            className="zero-g-bar" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="loader-text mt-4">{Math.floor(progress)}%</div>
      </div>
    );
  }

  return (
    <div 
      ref={wrapperRef} 
      className="scrolly-wrapper w-full relative z-0" 
      style={{ height: '600vh' }}
    >
      <div className="sticky top-0 left-0 w-screen h-screen overflow-hidden">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>
    </div>
  );
};
