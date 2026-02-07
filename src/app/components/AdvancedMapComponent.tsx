import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { Box, Layers, MapPin, Activity, Navigation } from 'lucide-react';
// Assuming these types and data exist in your project structure
import { MOROCCO_PHARMACIES, filterPharmacies, findNearestPharmacies, Pharmacy } from '@/app/data/pharmacyData';

const MAP_TRANSLATIONS: Record<string, any> = {
    fr: {
        found: "Pharmacies trouvées",
        mode3d: "Mode 3D",
        viewMode: "Mode d'affichage",
        myLocation: "Ma Position",
        directions: "Tracer l'itinéraire",
        open: "Ouvert",
        closed: "Fermé",
        guard: "Garde",
        address: "Adresse",
        phone: "Téléphone",
        rating: "Notation",
        services: "Services",
        location_popup: "Ma Position"
    },
    en: {
        found: "Pharmacies Found",
        mode3d: "3D Mode",
        viewMode: "View Mode",
        myLocation: "My Location",
        directions: "Get Directions",
        open: "Open",
        closed: "Closed",
        guard: "On Duty",
        address: "Address",
        phone: "Phone",
        rating: "Rating",
        services: "Services",
        location_popup: "My Location"
    },
    ar: {
        found: "صيدلية موجودة",
        mode3d: "وضع ثلاثي الأبعاد",
        viewMode: "وضع العرض",
        myLocation: "موقعي",
        directions: "تحديد المسار",
        open: "مفتوح",
        closed: "مغلق",
        guard: "حراسة",
        address: "العنوان",
        phone: "الهاتف",
        rating: "التقييم",
        services: "الخدمات",
        location_popup: "موقعي"
    }
};

interface AdvancedMapProps {
    searchQuery?: string;
    activeFilters?: {
        type?: string;
        status?: string;
    };
    lang?: string;
}

export const AdvancedMapComponent: React.FC<AdvancedMapProps> = ({ searchQuery = '', activeFilters = {}, lang = 'en' }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markersLayerRef = useRef<L.MarkerClusterGroup | null>(null);
    const heatLayerRef = useRef<L.LayerGroup | null>(null);
    const routeLayerRef = useRef<L.LayerGroup | null>(null);

    const [is3D, setIs3D] = useState(false);
    const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [viewMode, setViewMode] = useState<'markers' | 'heat' | 'cluster'>('cluster');
    const [pharmacyCount, setPharmacyCount] = useState(0);

    const t = MAP_TRANSLATIONS[lang] || MAP_TRANSLATIONS['en'];

    // Filter pharmacies based on search and filters
    const filteredPharmacies = filterPharmacies(MOROCCO_PHARMACIES, {
        ...activeFilters,
        searchQuery
    });

    // Custom marker icon creator with enhanced visuals
    const createPharmacyIcon = (pharmacy: Pharmacy, isSelected: boolean = false) => {
        let bgColor = '#10b981'; // emerald-500
        let icon = '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>';
        
        if (pharmacy.status === 'garde') {
            bgColor = '#f59e0b'; // amber-500
            icon = '<circle cx="12" cy="12" r="5"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>';
        } else if (pharmacy.status === 'closed') {
            bgColor = '#64748b'; // slate-500
        }

        if (pharmacy.type === 'Laboratory') {
            bgColor = '#8b5cf6'; // violet-500
            icon = '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 18l3-3-3-3"/>';
        }

        const size = isSelected ? 48 : 36;
        const pulseAnimation = isSelected ? 'animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;' : '';

        return L.divIcon({
            className: '',
            html: `
                <div style="position: relative; width: ${size}px; height: ${size}px;">
                    <style>
                        @keyframes pulse {
                            0%, 100% { opacity: 1; }
                            50% { opacity: .5; }
                        }
                    </style>
                    <div style="
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background: ${bgColor};
                        border: 3px solid white;
                        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        ${pulseAnimation}
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            ${icon}
                        </svg>
                    </div>
                    ${pharmacy.status === 'garde' ? `
                        <div style="
                            position: absolute;
                            top: -5px;
                            right: -5px;
                            width: 16px;
                            height: 16px;
                            background: #ef4444;
                            border: 2px solid white;
                            border-radius: 50%;
                            animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                        "></div>
                    ` : ''}
                </div>
            `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
            popupAnchor: [0, -size / 2 - 10]
        });
    };

    // Initialize map
    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        // Configure Leaflet icon paths
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        const timer = setTimeout(() => {
            if (!mapRef.current) return;

            const map = L.map(mapRef.current, {
                center: [31.7917, -7.0926], // Morocco center
                zoom: 6,
                zoomControl: false,
                attributionControl: false,
            });

            // Add modern tile layer (Voyager theme for clean look)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CartoDB',
                maxZoom: 19,
            }).addTo(map);

            // Add zoom control to bottom right
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            // Initialize marker cluster group
            const markerClusterGroup = (L as any).markerClusterGroup({
                chunkedLoading: true,
                spiderfyOnMaxZoom: true,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: true,
                maxClusterRadius: 60,
                iconCreateFunction: (cluster: any) => {
                    const count = cluster.getChildCount();
                    let size = 'small';
                    let sizeNum = 40;
                    
                    if (count > 100) {
                        size = 'large';
                        sizeNum = 60;
                    } else if (count > 20) {
                        size = 'medium';
                        sizeNum = 50;
                    }

                    return L.divIcon({
                        html: `
                            <div style="
                                width: ${sizeNum}px;
                                height: ${sizeNum}px;
                                border-radius: 50%;
                                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                                border: 4px solid white;
                                box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-weight: bold;
                                font-size: ${sizeNum > 50 ? '16px' : '14px'};
                                cursor: pointer;
                                transition: all 0.3s ease;
                            ">${count}</div>
                        `,
                        className: 'marker-cluster',
                        iconSize: [sizeNum, sizeNum]
                    });
                }
            });

            // Initialize other layers
            const heatLayer = L.layerGroup();
            const routeLayer = L.layerGroup().addTo(map);

            markersLayerRef.current = markerClusterGroup;
            heatLayerRef.current = heatLayer;
            routeLayerRef.current = routeLayer;
            mapInstance.current = map;
        }, 100);

        return () => {
            clearTimeout(timer);
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    // Update markers when filters change
    useEffect(() => {
        if (!mapInstance.current || !markersLayerRef.current) return;

        const map = mapInstance.current;
        const markerClusterGroup = markersLayerRef.current;

        // Clear existing markers
        markerClusterGroup.clearLayers();

        // Add filtered markers
        filteredPharmacies.forEach((pharmacy) => {
            const marker = L.marker([pharmacy.lat, pharmacy.lng], {
                icon: createPharmacyIcon(pharmacy, selectedPharmacy?.id === pharmacy.id)
            });

            // Create rich popup content
            const popupContent = `
                <div style="min-width: 250px; font-family: system-ui, -apple-system, sans-serif; direction: ${lang === 'ar' ? 'rtl' : 'ltr'}; text-align: ${lang === 'ar' ? 'right' : 'left'};">
                    <div style="
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: white;
                        padding: 12px;
                        margin: -12px -12px 12px -12px;
                        border-radius: 8px 8px 0 0;
                    ">
                        <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 700;">
                            ${pharmacy.name}
                        </h3>
                        <div style="font-size: 12px; opacity: 0.9;">
                            <span style="
                                display: inline-block;
                                padding: 2px 8px;
                                background: rgba(255,255,255,0.2);
                                border-radius: 12px;
                                margin-right: 6px;
                            ">${pharmacy.type}</span>
                            <span style="
                                display: inline-block;
                                padding: 2px 8px;
                                background: ${pharmacy.status === 'open' ? 'rgba(74,222,128,0.3)' : pharmacy.status === 'garde' ? 'rgba(251,191,36,0.3)' : 'rgba(148,163,184,0.3)'};
                                border-radius: 12px;
                            ">${pharmacy.status === 'open' ? '🟢 ' + t.open : pharmacy.status === 'garde' ? '⭐ ' + t.guard : '🔴 ' + t.closed}</span>
                        </div>
                    </div>
                    <div style="padding: 4px 0;">
                        <div style="margin-bottom: 8px;">
                            <div style="font-size: 12px; color: #64748b; margin-bottom: 2px;">📍 ${t.address}</div>
                            <div style="font-size: 14px; color: #1e293b; font-weight: 500;">${pharmacy.address}</div>
                        </div>
                        ${pharmacy.phone ? `
                            <div style="margin-bottom: 8px;">
                                <div style="font-size: 12px; color: #64748b; margin-bottom: 2px;">📞 ${t.phone}</div>
                                <div style="font-size: 14px; color: #1e293b; font-weight: 500;">${pharmacy.phone}</div>
                            </div>
                        ` : ''}
                        ${pharmacy.rating ? `
                            <div style="margin-bottom: 8px;">
                                <div style="font-size: 12px; color: #64748b; margin-bottom: 2px;">⭐ ${t.rating}</div>
                                <div style="font-size: 14px; color: #1e293b; font-weight: 700;">${pharmacy.rating.toFixed(1)}/5.0</div>
                            </div>
                        ` : ''}
                        ${pharmacy.services && pharmacy.services.length > 0 ? `
                            <div style="margin-bottom: 4px;">
                                <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">✨ ${t.services}</div>
                                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                                    ${pharmacy.services.map(s => `
                                        <span style="
                                            font-size: 11px;
                                            padding: 3px 8px;
                                            background: #f1f5f9;
                                            color: #475569;
                                            border-radius: 10px;
                                            font-weight: 500;
                                        ">${s}</span>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup'
            });

            marker.on('click', () => {
                setSelectedPharmacy(pharmacy);
            });

            markerClusterGroup.addLayer(marker);
        });

        // Add cluster group to map based on view mode
        if (viewMode === 'cluster') {
            if (map.hasLayer(markerClusterGroup)) {
                map.removeLayer(markerClusterGroup);
            }
            map.addLayer(markerClusterGroup);
        }

        setPharmacyCount(filteredPharmacies.length);
    }, [filteredPharmacies, selectedPharmacy, viewMode, lang, t]);

    // Handle user location
    const handleMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const userPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                setUserLocation(userPos);
                
                if (mapInstance.current) {
                    mapInstance.current.flyTo(userPos, 14, { duration: 1.5 });
                    
                    // Add user location marker
                    L.marker(userPos, {
                        icon: L.divIcon({
                            className: '',
                            html: `
                                <div style="
                                    width: 20px;
                                    height: 20px;
                                    background: #3b82f6;
                                    border: 4px solid white;
                                    border-radius: 50%;
                                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
                                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                                "></div>
                            `,
                            iconSize: [20, 20],
                            iconAnchor: [10, 10]
                        })
                    }).addTo(mapInstance.current).bindPopup(t.location_popup);

                    // Find and show nearest pharmacies
                    const nearest = findNearestPharmacies(userPos[0], userPos[1], filteredPharmacies, 5);
                    console.log('Nearest pharmacies:', nearest);
                }
            });
        }
    };

    // Draw route with Dijkstra visualization
    const drawRouteToPharmacy = (pharmacy: Pharmacy) => {
        if (!mapInstance.current || !routeLayerRef.current || !userLocation) return;

        const routeLayer = routeLayerRef.current;
        routeLayer.clearLayers();

        // Simplified Dijkstra path (in real app, use routing API)
        const start = userLocation;
        const end: [number, number] = [pharmacy.lat, pharmacy.lng];
        
        // Create animated path
        const pathPoints: [number, number][] = [
            start,
            [(start[0] + end[0]) / 3, (start[1] + end[1]) / 2],
            [(start[0] + end[0]) * 2/3, (start[1] + end[1]) / 1.5],
            end
        ];

        const polyline = L.polyline([], {
            color: '#10b981',
            weight: 5,
            opacity: 0.8,
            lineCap: 'round',
            dashArray: '10, 10',
            className: 'animated-route'
        }).addTo(routeLayer);

        // Animate the route drawing
        let i = 0;
        const interval = setInterval(() => {
            if (i < pathPoints.length) {
                polyline.addLatLng(pathPoints[i]);
                if (mapInstance.current) {
                    mapInstance.current.flyTo(pathPoints[i], 13, { duration: 0.5 });
                }
                i++;
            } else {
                clearInterval(interval);
            }
        }, 500);
    };

    return (
        <div className="relative w-full h-full">
            {/* Map Container with 3D Effect */}
            <div 
                className={`absolute inset-0 transition-all duration-1000 ${is3D ? 'scale-95' : ''}`}
                style={{ perspective: '1500px' }}
            >
                <div
                    ref={mapRef}
                    className="w-full h-full"
                    style={{
                        transform: is3D ? 'rotateX(45deg) scale(1.1)' : 'none',
                        transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: '24px'
                    }}
                />
            </div>

            {/* Control Panel - Top Right */}
            <div className={`absolute top-4 right-4 z-[1000] flex flex-col gap-2 ${lang === 'ar' ? 'left-4 right-auto' : 'right-4 left-auto'}`}>
                {/* 3D Toggle */}
                <button
                    onClick={() => setIs3D(!is3D)}
                    className={`p-3 rounded-xl shadow-2xl backdrop-blur-md transition-all hover:scale-110 ${
                        is3D 
                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white' 
                            : 'bg-white/90 text-slate-700 hover:bg-emerald-50'
                    }`}
                    title={t.mode3d}
                >
                    <Box size={20} className={is3D ? 'fill-white' : ''} />
                </button>

                {/* View Mode Switcher */}
                <button
                    onClick={() => setViewMode(viewMode === 'cluster' ? 'markers' : 'cluster')}
                    className="p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl text-slate-700 hover:bg-emerald-50 transition-all hover:scale-110"
                    title={t.viewMode}
                >
                    <Layers size={20} />
                </button>

                {/* My Location */}
                <button
                    onClick={handleMyLocation}
                    className="p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl text-slate-700 hover:bg-blue-50 transition-all hover:scale-110"
                    title={t.myLocation}
                >
                    <Navigation size={20} />
                </button>
            </div>

            {/* Stats Badge - Bottom Left */}
            <div className={`absolute bottom-20 z-[1000] bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg text-white px-4 py-2 rounded-xl shadow-2xl ${lang === 'ar' ? 'right-4' : 'left-4'}`}>
                <div className="flex items-center gap-3">
                    <Activity size={18} className="text-emerald-400" />
                    <div>
                        <div className="text-xs opacity-75">{t.found}</div>
                        <div className="text-xl font-bold">{pharmacyCount.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Selected Pharmacy Info Card */}
            {selectedPharmacy && (
                <div className={`absolute bottom-20 z-[1000] bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-4 max-w-xs animate-in slide-in-from-bottom ${lang === 'ar' ? 'left-4' : 'right-4'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <button
                        onClick={() => setSelectedPharmacy(null)}
                        className={`absolute top-2 text-slate-400 hover:text-slate-700 transition ${lang === 'ar' ? 'left-2' : 'right-2'}`}
                    >
                        ✕
                    </button>
                    <div className="mb-2">
                        <h4 className="font-bold text-slate-900">{selectedPharmacy.name}</h4>
                        <p className="text-xs text-slate-500">{selectedPharmacy.city}</p>
                    </div>
                    <div className="text-sm text-slate-600 mb-3">{selectedPharmacy.address}</div>
                    {userLocation && (
                        <button
                            onClick={() => drawRouteToPharmacy(selectedPharmacy)}
                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
                        >
                            <MapPin size={16} />
                            {t.directions}
                        </button>
                    )}
                </div>
            )}

            {/* Custom CSS for animations */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
                .marker-cluster {
                    transition: all 0.3s ease;
                }
                .marker-cluster:hover {
                    transform: scale(1.1);
                }
                .custom-popup .leaflet-popup-content-wrapper {
                    border-radius: 12px;
                    overflow: hidden;
                    padding: 12px;
                }
                .custom-popup .leaflet-popup-tip {
                    display: none;
                }
                .animated-route {
                    animation: dash 20s linear infinite;
                }
                @keyframes dash {
                    to {
                        stroke-dashoffset: -1000;
                    }
                }
                @keyframes slide-in-from-bottom {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-in {
                    animation: slide-in-from-bottom 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};