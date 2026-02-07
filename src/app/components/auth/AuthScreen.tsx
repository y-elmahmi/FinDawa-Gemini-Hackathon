import React, { useState } from 'react';
import { User, Briefcase, Stethoscope, Package, Shield, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export type UserRole = 'patient' | 'pharmacist' | 'doctor' | 'importer' | 'admin';

interface AuthScreenProps {
  onLogin: (role: UserRole) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: ''
  });

  const roles = [
    { id: 'patient' as UserRole, name: 'Patient', icon: User, color: 'bg-blue-600' },
    { id: 'pharmacist' as UserRole, name: 'Pharmacist', icon: Briefcase, color: 'bg-green-600' },
    { id: 'doctor' as UserRole, name: 'Doctor', icon: Stethoscope, color: 'bg-cyan-600' },
    { id: 'importer' as UserRole, name: 'Importer', icon: Package, color: 'bg-purple-600' },
    { id: 'admin' as UserRole, name: 'Admin', icon: Shield, color: 'bg-slate-600' }
  ];

  const isPro = selectedRole !== 'patient';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl mb-2">
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              FinDawa
            </span>
          </h1>
          <p className="text-gray-400">Log in to your space</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Role Tabs */}
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex gap-2 overflow-x-auto">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                      selectedRole === role.id
                        ? `${role.color} text-white shadow-lg`
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{role.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Full Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Password</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="••••••••"
                />
              </div>

              {/* Payment Section for Pro Roles */}
              {isPro && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg">Payment Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Card Number</label>
                      <Input
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        required={isPro}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2">Expiration Date</label>
                        <Input
                          value={formData.cardExpiry}
                          onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                          required={isPro}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">CVV</label>
                        <Input
                          value={formData.cardCVV}
                          onChange={(e) => setFormData({ ...formData, cardCVV: e.target.value })}
                          required={isPro}
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className={`w-full mt-6 py-6 ${roles.find(r => r.id === selectedRole)?.color} hover:opacity-90 text-white rounded-2xl`}
            >
              {isPro ? 'Subscribe & Continue' : 'Log In'}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              {isPro && `Subscription: ${selectedRole === 'pharmacist' ? '199 DH' : '999 DH'}/month`}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}