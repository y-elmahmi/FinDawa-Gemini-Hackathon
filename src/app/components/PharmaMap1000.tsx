import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
// Note: Replace this with your actual image path or a public URL
// I've replaced the figma asset with a placeholder for the code to run immediately
const pharmaLogo = 'https://cdn-icons-png.flaticon.com/512/169/169837.png'; 

export const PharmaMap1000 = ({ externalRef }: { externalRef?: React.MutableRefObject<L.Map | null> }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        if (mapInstance.current) return;

        // Init Map centered on Morocco
        const map = L.map(containerRef.current, {
            center: [31.7917, -7.0926],
            zoom: 6,
            zoomControl: false
        });

        // Add Tile Layer (CartoDB Light for clean look)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: 'Map data &copy; OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Custom Icon using the Pharma Internationale Logo
        const icon = L.icon({
            iconUrl: pharmaLogo,
            iconSize: [40, 40], // Slightly larger to be visible
            iconAnchor: [20, 20],
            popupAnchor: [0, -20],
            className: 'rounded-full border-2 border-white shadow-lg bg-white' // Circular style
        });

        // Generate 1000 Markers centered around major Moroccan cities
        const cities = [
            { lat: 33.5731, lng: -7.5898, name: "Casablanca" },
            { lat: 34.0209, lng: -6.8416, name: "Rabat" },
            { lat: 31.6295, lng: -7.9811, name: "Marrakech" },
            { lat: 35.7595, lng: -5.8340, name: "Tangier" },
            { lat: 30.4278, lng: -9.5981, name: "Agadir" },
            { lat: 34.0181, lng: -5.0078, name: "Fes" },
            { lat: 33.8935, lng: -5.5473, name: "Meknes" },
            { lat: 35.1727, lng: -3.8447, name: "Al Hoceima" },
            { lat: 34.2610, lng: -6.5802, name: "Kenitra" },
            { lat: 32.8872, lng: -6.9063, name: "Khouribga" },
            { lat: 30.9335, lng: -6.9370, name: "Ouarzazate" },
            { lat: 27.1253, lng: -13.1625, name: "Laayoune" }
        ];

        const markers: L.Marker[] = [];
        
        // Generate 1000 pharmacies
        for (let i = 0; i < 1000; i++) {
            // Pick random city
            const city = cities[Math.floor(Math.random() * cities.length)];
            // Add random distribution (wider spread)
            // Approx 0.1 degree is ~11km. spread of 0.2 gives ~22km radius.
            const spread = 0.15;
            const lat = city.lat + (Math.random() - 0.5) * spread;
            const lng = city.lng + (Math.random() - 0.5) * spread;
            
            const marker = L.marker([lat, lng], { icon })
                .bindPopup(`
                    <div style="text-align: center; padding: 8px; font-family: sans-serif;">
                        <img src="${pharmaLogo}" style="height: 32px; margin: 0 auto 8px auto; display: block;" />
                        <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 4px; color: #1e293b;">International Pharmacy</h3>
                        <div style="font-size: 10px; color: #64748b; margin-bottom: 8px;">No.${1000 + i} - ${city.name}</div>
                        <div style="display: flex; gap: 4px; justify-content: center; margin-bottom: 8px;">
                            <span style="background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">Open</span>
                            <span style="background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px; font-size: 10px;">On Duty 24/7</span>
                        </div>
                        <button style="width: 100%; background: #10b981; color: white; border: none; padding: 6px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">
                            Order Now
                        </button>
                    </div>
                `);
            markers.push(marker);
        }

        // Add markers to map
        markers.forEach(m => m.addTo(map));

        mapInstance.current = map;
        if (externalRef) {
            externalRef.current = map;
        }

        return () => {
            map.remove();
            mapInstance.current = null;
            if (externalRef) {
                externalRef.current = null;
            }
        };
    }, []); // Run once on mount

    return (
        <div 
             ref={containerRef} 
             style={{ height: '100%', width: '100%', borderRadius: '24px' }} 
        />
    );
};