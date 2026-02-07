import React from 'react';
import { Search, MapPin, Bell } from 'lucide-react';

export function ServicesGrid() {
  const services = [
    {
      icon: <Search className="w-12 h-12 text-green-600" />,
      title: 'Price Comparator',
      description: 'Find the best prices for your medicines in real-time across all pharmacies.',
      color: 'from-green-50 to-green-100'
    },
    {
      icon: <MapPin className="w-12 h-12 text-cyan-600" />,
      title: 'On-Duty Pharmacies',
      description: 'Instantly locate the nearest on-duty pharmacies to you, 24/7.',
      color: 'from-cyan-50 to-cyan-100'
    },
    {
      icon: <Bell className="w-12 h-12 text-purple-600" />,
      title: 'Stock Alerts',
      description: 'Receive notifications as soon as your medication is back in stock.',
      color: 'from-purple-50 to-purple-100'
    }
  ];

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Free Services</h2>
          <p className="text-xl text-gray-600">
            Powerful tools to facilitate your access to healthcare
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer"
            >
              <div className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              <h3 className="text-2xl mb-4">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}