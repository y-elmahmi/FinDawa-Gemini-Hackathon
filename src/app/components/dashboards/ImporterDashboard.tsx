import React, { useState } from 'react';
import { Package, TrendingUp, Globe, BarChart3, MapPin, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ImporterDashboardProps {
  onLogout: () => void;
}

export function ImporterDashboard({ onLogout }: ImporterDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const salesData = [
    { month: 'Jan', revenue: 245000 },
    { month: 'Feb', revenue: 289000 },
    { month: 'Mar', revenue: 315000 },
    { month: 'Apr', revenue: 298000 },
    { month: 'May', revenue: 342000 },
    { month: 'Jun', revenue: 378000 }
  ];

  const marketData = [
    { product: 'Doliprane', demand: 85, supply: 92, trend: 'up' },
    { product: 'Ventoline', demand: 92, supply: 78, trend: 'up' },
    { product: 'Amoxicilline', demand: 78, supply: 85, trend: 'stable' },
    { product: 'Aspégic', demand: 65, supply: 88, trend: 'down' }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl">Import Med International</h1>
              <p className="text-purple-100">B2B Platform & Logistics</p>
            </div>
            <Button onClick={onLogout} variant="outline" className="border-white text-white hover:bg-white/10">
              Logout
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl">
              <p className="text-purple-100 mb-1">Monthly Revenue</p>
              <h3 className="text-3xl">2.8M DH</h3>
              <p className="text-sm text-green-300 mt-1">+15% vs last month</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl">
              <p className="text-purple-100 mb-1">Orders</p>
              <h3 className="text-3xl">1,247</h3>
              <p className="text-sm text-green-300 mt-1">+8% this month</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl">
              <p className="text-purple-100 mb-1">Active Partners</p>
              <h3 className="text-3xl">342</h3>
              <p className="text-sm text-blue-300 mt-1">23 new</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl">
              <p className="text-purple-100 mb-1">Delivery Rate</p>
              <h3 className="text-3xl">98.5%</h3>
              <p className="text-sm text-green-300 mt-1">Excellent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex gap-4">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'logistics', label: 'Logistics', icon: MapPin },
              { id: 'intelligence', label: 'Market Intelligence', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-purple-600'
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
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl mb-6">Dashboard</h2>

              {/* Revenue Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-xl mb-4">Revenue Evolution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#9333ea" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Top Products */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl mb-4">Top Selling Products</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Doliprane 1000mg', sales: 45000, growth: '+12%' },
                      { name: 'Ventoline 100µg', sales: 38000, growth: '+8%' },
                      { name: 'Amoxicilline 500mg', sales: 32000, growth: '+15%' },
                      { name: 'Aspégic 1000mg', sales: 28000, growth: '+5%' }
                    ].map((product, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p>{product.name}</p>
                            <p className="text-sm text-gray-600">{product.sales} units</p>
                          </div>
                        </div>
                        <span className="text-green-600">{product.growth}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl mb-4">Geographic Distribution</h3>
                  <div className="space-y-3">
                    {[
                      { city: 'Casablanca', percentage: 35, color: 'bg-purple-600' },
                      { city: 'Rabat', percentage: 25, color: 'bg-purple-500' },
                      { city: 'Marrakech', percentage: 20, color: 'bg-purple-400' },
                      { city: 'Others', percentage: 20, color: 'bg-purple-300' }
                    ].map((location, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span>{location.city}</span>
                          <span>{location.percentage}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${location.color}`}
                            style={{ width: `${location.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logistics' && (
            <div>
              <h2 className="text-2xl mb-6">Smart Logistics</h2>

              {/* 3D Logistics Map Placeholder */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                <h3 className="text-xl mb-6">3D Logistics Map</h3>
                <div className="relative h-96 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Globe className="w-32 h-32 text-purple-600 mx-auto mb-4 animate-pulse" />
                      <h4 className="text-2xl text-gray-700 mb-2">3D Visualization</h4>
                      <p className="text-gray-500">Real-time tracking of deliveries and warehouses</p>
                    </div>
                  </div>

                  {/* Simulated Warehouse Markers */}
                  <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-purple-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-pulse">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-2/3 right-1/4 w-16 h-16 bg-green-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-pulse" style={{ animationDelay: '0.5s' }}>
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute bottom-1/4 left-1/2 w-16 h-16 bg-cyan-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-pulse" style={{ animationDelay: '1s' }}>
                    <Package className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Warehouses */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: 'Casablanca Warehouse', stock: '85%', status: 'Optimal', color: 'green' },
                  { name: 'Tangier Warehouse', stock: '62%', status: 'Good', color: 'blue' },
                  { name: 'Agadir Warehouse', stock: '45%', status: 'Fair', color: 'yellow' }
                ].map((warehouse, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-${warehouse.color}-100 rounded-xl flex items-center justify-center`}>
                        <MapPin className={`w-6 h-6 text-${warehouse.color}-600`} />
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full bg-${warehouse.color}-100 text-${warehouse.color}-700`}>
                        {warehouse.status}
                      </span>
                    </div>
                    <h3 className="text-lg mb-2">{warehouse.name}</h3>
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Capacity</span>
                        <span className="text-sm">{warehouse.stock}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-${warehouse.color}-600`}
                          style={{ width: warehouse.stock }}
                        ></div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'intelligence' && (
            <div>
              <h2 className="text-2xl mb-6">Market Intelligence</h2>

              {/* Market Trends */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-xl mb-4">Demand vs Supply Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="demand" fill="#9333ea" name="Demand" />
                    <Bar dataKey="supply" fill="#06b6d4" name="Supply" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Market Insights */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <h3 className="text-xl">Opportunities</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: 'High demand Ventolin', impact: 'High', trend: 'up' },
                      { title: 'Doliprane price rising', impact: 'Medium', trend: 'up' },
                      { title: 'New regulation', impact: 'Critical', trend: 'neutral' }
                    ].map((insight, idx) => (
                      <div key={idx} className="flex items-start justify-between p-4 bg-purple-50 rounded-xl">
                        <div>
                          <h4>{insight.title}</h4>
                          <span className={`text-xs px-3 py-1 rounded-full ${
                            insight.impact === 'High' ? 'bg-red-100 text-red-700' :
                            insight.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {insight.impact}
                          </span>
                        </div>
                        <TrendingUp className={`w-5 h-5 ${
                          insight.trend === 'up' ? 'text-green-600' : 'text-gray-600'
                        }`} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <h3 className="text-xl">Financial Performance</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                      <span className="text-gray-700">Average Margin</span>
                      <span className="text-2xl text-green-600">24.5%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                      <span className="text-gray-700">ROI</span>
                      <span className="text-2xl text-blue-600">18.2%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                      <span className="text-gray-700">YoY Growth</span>
                      <span className="text-2xl text-purple-600">+32%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}