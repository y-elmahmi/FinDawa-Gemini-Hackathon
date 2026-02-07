import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '../ui/button';

export function MapSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4">Find a Pharmacy</h2>
          <p className="text-xl text-gray-600">
            Real-time geolocation of open pharmacies near you
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Map Placeholder */}
          <div className="relative h-[500px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl overflow-hidden shadow-xl">
            {/* Simulated Map Interface */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-24 h-24 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl text-gray-700 mb-2">Interactive Map</h3>
                <p className="text-gray-500">Google Maps API - Real-time location</p>
              </div>
            </div>

            {/* Overlay Pins (Simulated) */}
            <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-green-600 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
            <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-green-600 rounded-full border-4 border-white shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-1/3 left-1/2 w-8 h-8 bg-green-600 rounded-full border-4 border-white shadow-lg animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Search Bar Overlay */}
            <div className="absolute top-6 left-6 right-6">
              <div className="bg-white rounded-2xl shadow-xl p-4 flex gap-3">
                <input
                  type="text"
                  placeholder="Search for a medicine or pharmacy..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <Button className="bg-green-600 hover:bg-green-700">
                  <Navigation className="w-5 h-5 mr-2" />
                  Locate
                </Button>
              </div>
            </div>

            {/* Info Cards (Simulated Pharmacies) */}
            <div className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-xl p-4 w-80">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4>Central Pharmacy</h4>
                  <p className="text-sm text-gray-600">Mohammed V Avenue, Casablanca</p>
                  <p className="text-sm text-green-600 mt-1">Open • 0.8 km</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}