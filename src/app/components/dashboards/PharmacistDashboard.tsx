import React, { useState } from 'react';
import { Store, Package, Users, Network, ShoppingCart, Scan, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface PharmacistDashboardProps {
  onLogout: () => void;
  showNotification: (message: string) => void;
}

export function PharmacistDashboard({ onLogout, showNotification }: PharmacistDashboardProps) {
  const [activeTab, setActiveTab] = useState('stock');
  const [scanModalOpen, setScanModalOpen] = useState(false);

  const stockItems = [
    { id: 1, name: 'Doliprane 1000mg', quantity: 250, status: 'available', price: '15 DH' },
    { id: 2, name: 'Ventoline 100µg', quantity: 45, status: 'low', price: '85 DH' },
    { id: 3, name: 'Amoxicilline 500mg', quantity: 180, status: 'available', price: '45 DH' },
    { id: 4, name: 'Aspégic 1000mg', quantity: 12, status: 'critical', price: '25 DH' }
  ];

  const b2bProducts = [
    { id: 1, supplier: 'MedImport SA', product: 'Doliprane Pack x500', price: '6000 DH', delivery: '2 days' },
    { id: 2, supplier: 'PharmaDistrib', product: 'Ventoline Pack x100', price: '7500 DH', delivery: '1 day' },
    { id: 3, supplier: 'HealthSupply', product: 'FFP2 Masks x1000', price: '4200 DH', delivery: '3 days' }
  ];

  const handleScanSale = () => {
    setScanModalOpen(false);
    showNotification('Sale recorded successfully!');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl">Al Madina Pharmacy</h1>
              <p className="text-green-100">Mohammed V Avenue, Casablanca</p>
            </div>
            <Button onClick={onLogout} variant="outline" className="border-white text-white hover:bg-white/10">
              Logout
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl">
              <p className="text-green-100 mb-1">Revenue Today</p>
              <h3 className="text-3xl">8,450 DH</h3>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl">
              <p className="text-green-100 mb-1">Sales</p>
              <h3 className="text-3xl">127</h3>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl">
              <p className="text-green-100 mb-1">Patients</p>
              <h3 className="text-3xl">89</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex gap-4">
            {[
              { id: 'stock', label: 'Stock', icon: Package },
              { id: 'patients', label: 'Patients', icon: Users },
              { id: 'b2b', label: 'B2B Market', icon: ShoppingCart },
              { id: 'network', label: 'Network', icon: Network }
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
          {activeTab === 'stock' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Stock Management</h2>
                <Button
                  onClick={() => setScanModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Scan className="w-4 h-4 mr-2" />
                  Scan Sale
                </Button>
              </div>

              <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left">Medication</th>
                      <th className="px-6 py-4 text-left">Quantity</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-left">Price</th>
                      <th className="px-6 py-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockItems.map((item) => (
                      <tr key={item.id} className="border-t border-gray-100">
                        <td className="px-6 py-4">{item.name}</td>
                        <td className="px-6 py-4">{item.quantity}</td>
                        <td className="px-6 py-4">
                          {item.status === 'available' && (
                            <span className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              Available
                            </span>
                          )}
                          {item.status === 'low' && (
                            <span className="flex items-center gap-2 text-yellow-600">
                              <AlertTriangle className="w-4 h-4" />
                              Low Stock
                            </span>
                          )}
                          {item.status === 'critical' && (
                            <span className="flex items-center gap-2 text-red-600">
                              <AlertTriangle className="w-4 h-4" />
                              Critical
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">{item.price}</td>
                        <td className="px-6 py-4">
                          <Button variant="outline" size="sm">
                            Restock
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'b2b' && (
            <div>
              <h2 className="text-2xl mb-6">B2B Marketplace</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {b2bProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-purple-600" />
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        {product.delivery}
                      </span>
                    </div>
                    <h3 className="text-lg mb-2">{product.product}</h3>
                    <p className="text-sm text-gray-600 mb-4">{product.supplier}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl text-green-600">{product.price}</span>
                      <Button
                        onClick={() => showNotification('Product added to cart')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div>
              <h2 className="text-2xl mb-6">My Patients</h2>
              <div className="bg-white rounded-2xl shadow">
                <div className="p-6">
                  <Input placeholder="Search for a patient..." className="mb-4" />
                </div>
                <div className="divide-y divide-gray-100">
                  {['Ahmed Benali', 'Sara El Amrani', 'Mohamed Ziani'].map((name, idx) => (
                    <div key={idx} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg">{name}</h3>
                          <p className="text-sm text-gray-600">Last visit: {idx + 1} day(s) ago</p>
                        </div>
                        <Button variant="outline">View History</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'network' && (
            <div>
              <h2 className="text-2xl mb-6">Professional Network</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow p-6">
                  <Network className="w-12 h-12 text-cyan-600 mb-4" />
                  <h3 className="text-xl mb-2">127</h3>
                  <p className="text-gray-600">Connected Pharmacies</p>
                </div>
                <div className="bg-white rounded-2xl shadow p-6">
                  <Users className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="text-xl mb-2">45</h3>
                  <p className="text-gray-600">Partner Doctors</p>
                </div>
                <div className="bg-white rounded-2xl shadow p-6">
                  <Store className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-xl mb-2">12</h3>
                  <p className="text-gray-600">Active Suppliers</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scan Sale Modal */}
      {scanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-2xl mb-6">Scan Sale</h2>
            <div className="bg-gray-100 rounded-2xl h-64 mb-6 flex items-center justify-center">
              <Scan className="w-24 h-24 text-gray-400" />
            </div>
            <p className="text-center text-gray-600 mb-6">
              Scan the medication barcode
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setScanModalOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleScanSale}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Validate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}