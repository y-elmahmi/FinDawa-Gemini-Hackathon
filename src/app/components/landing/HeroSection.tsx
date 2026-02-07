import React from 'react';
import { Button } from '../ui/button';

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen bg-slate-900 text-white flex items-center overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-green-900 opacity-90"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-green-600 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-600 rounded-full blur-3xl opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-7xl mb-4">
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                FinDawa
              </span>
            </h1>
          </div>

          {/* Main Heading */}
          <h2 className="text-5xl mb-6">
            Your Health, Our Priority
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            The connected health ecosystem that unites patients, pharmacists, doctors, and importers for healthcare accessible to all.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-6 justify-center mb-16">
            <Button
              onClick={() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-2xl shadow-xl"
            >
              Free Services
            </Button>
            <Button
              onClick={() => onNavigate('auth')}
              variant="outline"
              className="border-2 border-green-600 text-white hover:bg-green-600/10 px-8 py-6 text-lg rounded-2xl"
            >
              Pro Area
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl">
              <h3 className="text-4xl text-green-400 mb-2">5000+</h3>
              <p className="text-gray-300">Partner Pharmacies</p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl">
              <h3 className="text-4xl text-cyan-400 mb-2">1200+</h3>
              <p className="text-gray-300">Connected Doctors</p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl">
              <h3 className="text-4xl text-purple-400 mb-2">100K+</h3>
              <p className="text-gray-300">Active Patients</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}