import { useRef, useEffect, useState, useCallback } from 'react';
import GlobeGL from 'react-globe.gl';
import { useGlobeStore } from '@/stores/useGlobeStore';
import type { GlobePin } from '@/types/globe';

interface GlobeProps {
  onPinClick?: (pin: GlobePin) => void;
}

export function Globe({ onPinClick }: GlobeProps) {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const {
    activeTopic,
    pins,
    topics,
    isRotating,
    setSelectedPin,
    setIsRotating,
  } = useGlobeStore();

  // Get pins for active topic
  const visiblePins = activeTopic 
    ? pins.filter(p => p.topicId === activeTopic)
    : [];

  // Get topic color for pins
  const getTopicColor = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    return topic?.color || '#8B9A7B';
  };

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Configure globe on mount
  useEffect(() => {
    if (globeRef.current) {
      // Set initial camera position
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 0);
      
      // Configure controls
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = isRotating;
        controls.autoRotateSpeed = 0.3;
        controls.enableZoom = true;
        controls.minDistance = 150;
        controls.maxDistance = 500;
      }
    }
  }, [isRotating]);

  // Update auto-rotate when isRotating changes
  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = isRotating;
      }
    }
  }, [isRotating]);

  // Handle pin click
  const handlePinClick = useCallback((pin: GlobePin) => {
    setSelectedPin(pin.id);
    setIsRotating(false);
    
    // Fly to pin location
    if (globeRef.current) {
      globeRef.current.pointOfView(
        { lat: pin.location.lat, lng: pin.location.lng, altitude: 1.5 },
        1000
      );
    }
    
    onPinClick?.(pin);
  }, [setSelectedPin, setIsRotating, onPinClick]);

  // Handle globe click (deselect)
  const handleGlobeClick = useCallback(() => {
    setSelectedPin(null);
  }, [setSelectedPin]);

  // Stop rotation on interaction
  const handleInteractionStart = useCallback(() => {
    setIsRotating(false);
  }, [setIsRotating]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full absolute inset-0"
      onMouseDown={handleInteractionStart}
      onTouchStart={handleInteractionStart}
    >
      <GlobeGL
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        
        // Globe appearance - clean, minimal style
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl=""
        backgroundColor="rgba(0,0,0,0)"
        
        // Atmosphere
        atmosphereColor="#8B9A7B"
        atmosphereAltitude={0.15}
        
        // Points (pins)
        pointsData={visiblePins}
        pointLat={(d: any) => d.location.lat}
        pointLng={(d: any) => d.location.lng}
        pointColor={(d: any) => getTopicColor(d.topicId)}
        pointAltitude={0.01}
        pointRadius={0.5}
        pointsMerge={false}
        onPointClick={(point: any) => handlePinClick(point as GlobePin)}
        
        // Labels
        labelsData={visiblePins}
        labelLat={(d: any) => d.location.lat}
        labelLng={(d: any) => d.location.lng}
        labelText={(d: any) => d.title}
        labelSize={1.2}
        labelDotRadius={0.4}
        labelColor={() => 'rgba(255, 255, 255, 0.9)'}
        labelResolution={2}
        labelAltitude={0.02}
        onLabelClick={(label: any) => handlePinClick(label as GlobePin)}
        
        // Interaction
        onGlobeClick={handleGlobeClick}
      />
    </div>
  );
}
