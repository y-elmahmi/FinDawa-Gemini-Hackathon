import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '../ui/button';

interface PricingSectionProps {
  onNavigate: (page: string) => void;
}

export function PricingSection({ onNavigate }: PricingSectionProps) {
  const plans = [
    {
      name: 'Patient',
      price: 'Free',
      color: 'from-blue-500 to-blue-600',
      features: [
        'Price comparator',
        'Pharmacy locator',
        'Stock alerts',
        'Digital health record',
        'Digital prescriptions'
      ]
    },
    {
      name: 'Pharmacist',
      price: '199 DH/month',
      color: 'from-green-500 to-green-600',
      popular: true,
      features: [
        'Smart stock management',
        'B2B Marketplace',
        'Professional network',
        'Advanced analytics',
        'Priority support',
        'Integration API'
      ]
    },
    {
      name: 'Importer',
      price: '999 DH/month',
      color: 'from-purple-500 to-purple-600',
      features: [
        'Complete B2B platform',
        'Smart logistics',
        'Market Intelligence',
        'Multi-warehouse management',
        'Advanced reporting',
        'Dedicated account manager'
      ]
    }
  ];

  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Transparent Pricing</h2>
          <p className="text-xl text-gray-400">
            Choose the plan that fits your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 bg-white/10 backdrop-blur-lg rounded-3xl border ${
                plan.popular ? 'border-green-400 scale-105' : 'border-white/20'
              } hover:border-green-400 transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-full text-sm">
                  Popular
                </div>
              )}

              <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl mb-6`}></div>
              
              <h3 className="text-2xl mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl">{plan.price}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => onNavigate('auth')}
                className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white py-6 rounded-2xl`}
              >
                {plan.price === 'Free' ? 'Get Started' : 'Subscribe'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}