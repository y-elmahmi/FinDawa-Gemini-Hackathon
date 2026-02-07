import React, { useState } from 'react';
import { Heart, MapPin, FileText, Calendar, AlertCircle, Search, Navigation } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface PatientDashboardProps {
  onLogout: () => void;
  showNotification: (message: string) => void;
}

export function PatientDashboard({ onLogout, showNotification }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState('map');
  const [searchQuery, setSearchQuery] = useState('');

  const prescriptions = [
    { id: 1, doctor: 'Dr. Hassan Alami', medication: 'Doliprane 1000mg', date: '20 Dec 2024', status: 'active' },
    { id: 2, doctor: 'Dr. Sara Bennani', medication: 'Amoxicilline 500mg', date: '15 Dec 2024', status: 'completed' },
    { id: 3, doctor: 'Dr. Hassan Alami', medication: 'Ventoline 100µg', date: '10 Dec 2024', status: 'active' }
  ];

  const healthRecords = [
    { type: 'Vaccination', title: 'COVID-19 Booster', date: '1 Dec 2024', provider: 'Al Madina Health Center' },
    { type: 'Consultation', title: 'General Consultation', date: '20 Nov 2024', provider: 'Dr. Hassan Alami' },
    { type: 'Lab Test', title: 'Blood Work', date: '15 Nov 2024', provider: 'BioMed Laboratory' }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl">Hello, Ahmed</h1>
              <p className="text-green-100">Your health dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => showNotification('SOS Service activated - A doctor will contact you shortly')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                SOS
              </Button>
              <Button onClick={onLogout} variant="outline" className="border-white text-white hover:bg-white/10">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex gap-4">
            {[
              { id: 'map', label: 'Find Medicine', icon: MapPin },
              { id: 'prescriptions', label: 'My Prescriptions', icon: FileText },
              { id: 'health', label: 'Health Record', icon: Heart }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-600 hover:text-green-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">
          {activeTab === 'map' && (
            <div>
              <h2 className="text-2xl mb-6">Find Medicine</h2>

              {/* Map Container */}
              <div className="relative h-[600px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl overflow-hidden shadow-xl mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-24 h-24 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl text-gray-700 mb-2">Interactive Map</h3>
                    <p className="text-gray-500">Search for a medicine to see available pharmacies</p>
                  </div>
                </div>

                {/* Map Pins */}
                <div className="absolute top-1/4 left-1/4 w-10 h-10 bg-green-600 rounded-full border-4 border-white shadow-lg animate-pulse flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="absolute top-1/2 right-1/3 w-10 h-10 bg-green-600 rounded-full border-4 border-white shadow-lg animate-pulse flex items-center justify-center" style={{ animationDelay: '0.5s' }}>
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="absolute bottom-1/3 left-1/2 w-10 h-10 bg-green-600 rounded-full border-4 border-white shadow-lg animate-pulse flex items-center justify-center" style={{ animationDelay: '1s' }}>
                  <MapPin className="w-5 h-5 text-white" />
                </div>

                {/* Search Bar */}
                <div className="absolute top-6 left-6 right-6">
                  <div className="bg-white rounded-2xl shadow-xl p-4 flex gap-3">
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for medicine (e.g., Doliprane)..."
                      className="flex-1"
                    />
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Search className="w-5 h-5 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline">
                      <Navigation className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Pharmacy Cards */}
                <div className="absolute bottom-6 left-6 right-6 flex gap-4 overflow-x-auto pb-2">
                  {[
                    { name: 'Central Pharmacy', address: 'Mohammed V Avenue', distance: '0.8 km', price: '15 DH', stock: 'In stock' },
                    { name: 'Al Madina Pharmacy', address: 'Hassan II Street', distance: '1.2 km', price: '16 DH', stock: 'In stock' },
                    { name: 'On-Duty Pharmacy', address: 'Zerktouni Boulevard', distance: '2.1 km', price: '14 DH', stock: 'Low stock' }
                  ].map((pharmacy, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-xl p-4 min-w-[320px]">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3>{pharmacy.name}</h3>
                          <p className="text-sm text-gray-600">{pharmacy.address}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          pharmacy.stock === 'In stock' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {pharmacy.stock}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{pharmacy.distance}</p>
                          <p className="text-lg text-green-600">{pharmacy.price}</p>
                        </div>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Directions
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div>
              <h2 className="text-2xl mb-6">My Prescriptions</h2>

              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-cyan-600" />
                        </div>
                        <div>
                          <h3 className="text-lg mb-1">{prescription.medication}</h3>
                          <p className="text-sm text-gray-600">Prescribed by {prescription.doctor}</p>
                          <p className="text-sm text-gray-500">{prescription.date}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm ${
                        prescription.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {prescription.status === 'active' ? 'Active' : 'Completed'}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => showNotification('Click & Collect order created - Ready in 30 minutes')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Order (Click & Collect)
                      </Button>
                      <Button variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div>
              <h2 className="text-2xl mb-6">Digital Health Record</h2>

              <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Blood Type</p>
                    <p className="text-xl">O+</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Age</p>
                    <p className="text-xl">32 years</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Records</p>
                    <p className="text-xl">24</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl mb-4">Medical History</h3>
              <div className="space-y-4">
                {healthRecords.map((record, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      {record.type === 'Vaccination' && <Heart className="w-6 h-6 text-green-600" />}
                      {record.type === 'Consultation' && <FileText className="w-6 h-6 text-cyan-600" />}
                      {record.type === 'Lab Test' && <Calendar className="w-6 h-6 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          {record.type}
                        </span>
                        <span className="text-sm text-gray-500">{record.date}</span>
                      </div>
                      <h4 className="mb-1">{record.title}</h4>
                      <p className="text-sm text-gray-600">{record.provider}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}