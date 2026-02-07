import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Box } from 'lucide-react';

interface InteractiveMapProps {
    active?: boolean;
    target?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ active, target }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const [is3D, setIs3D] = useState(false);

    useEffect(() => {
        if (!mapRef.current) return;
        if (mapInstance.current) return;

        // Init Map
        const map = L.map(mapRef.current, {
            center: [33.5731, -7.5898], // Casablanca
            zoom: 14,
            zoomControl: false,
            attributionControl: false
        });

        // Voyager theme for clean look
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap, &copy; CartoDB'
        }).addTo(map);

        mapInstance.current = map;

        // Cleanup
        return () => {
            map.remove();
            mapInstance.current = null;
        };
    }, []);

    // Effect to handle "Dijkstra" Path Animation
    useEffect(() => {
        const map = mapInstance.current;
        if (!map || !active) return;

        // Mock Nodes for "Shortest Path" (Dijkstra simulation)
        const start: [number, number] = [33.5731, -7.5898];
        const end: [number, number] = [33.5810, -7.5910]; // Target Pharmacy
        const pathNodes: [number, number][] = [
            start,
            [33.5750, -7.5920],
            [33.5770, -7.5900],
            [33.5790, -7.5930],
            end
        ];

        // Clear previous layers
        map.eachLayer((layer) => {
            if (layer instanceof L.Polyline || layer instanceof L.CircleMarker || layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Add Markers
        const startIcon = L.divIcon({
            html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>',
            className: 'bg-transparent',
            iconSize: [16, 16]
        });
        
        const endIcon = L.divIcon({
            html: '<div class="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">P</div>',
            className: 'bg-transparent',
            iconSize: [24, 24]
        });

        L.marker(start, { icon: startIcon }).addTo(map);
        L.marker(end, { icon: endIcon }).addTo(map).bindPopup(target || "Pharmacy").openPopup();

        // Animate Polyline
        const polyline = L.polyline([], { 
            color: '#10b981', // emerald-500
            weight: 5,
            opacity: 0.8,
            lineCap: 'round'
        }).addTo(map);

        let i = 0;
        const interval = setInterval(() => {
            if (i < pathNodes.length) {
                polyline.addLatLng(pathNodes[i]);
                map.flyTo(pathNodes[i], 15, { animate: true, duration: 0.5 });
                i++;
            } else {
                clearInterval(interval);
            }
        }, 600);

        return () => clearInterval(interval);

    }, [active, target]);

    return (
        <div className={`absolute inset-0 z-0 transition-all duration-1000 ${is3D ? 'scale-95' : ''}`} style={{ perspective: '1000px' }}>
            <div 
                ref={mapRef} 
                className="w-full h-full shadow-inner"
                style={{ 
                    transform: is3D ? 'rotateX(45deg) scale(1.1)' : 'none', 
                    transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' 
                }}
            />
            
            {/* 3D Toggle Button */}
            <button 
                onClick={() => setIs3D(!is3D)}
                className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur p-2 rounded-lg shadow-lg text-slate-700 hover:text-green-600 transition hover:scale-105 pointer-events-auto"
                title="3D Mode"
            >
                <Box size={20} className={is3D ? "text-green-600 fill-green-100" : ""} />
            </button>

            {/* Dijkstra Visualization Overlay (Mock) */}
            {active && (
                <div className="absolute bottom-20 right-4 z-[400] bg-slate-900/80 backdrop-blur text-green-400 p-2 rounded-lg text-xs font-mono animate-pulse">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                        DIJKSTRA: OPTIMAL
                    </div>
                </div>
            )}
        </div>
    );
};