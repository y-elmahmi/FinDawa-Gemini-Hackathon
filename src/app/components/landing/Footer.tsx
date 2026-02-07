import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenLegal: () => void;
  onOpenContact: () => void;
}

export function Footer({ onOpenLegal, onOpenContact }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-3xl mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              FinDawa
            </h3>
            <p className="text-gray-400">
              The connected health ecosystem in Morocco
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-green-400 cursor-pointer">For Patients</li>
              <li className="hover:text-green-400 cursor-pointer">For Pharmacists</li>
              <li className="hover:text-green-400 cursor-pointer">For Doctors</li>
              <li className="hover:text-green-400 cursor-pointer">For Importers</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-green-400 cursor-pointer">About</li>
              <li className="hover:text-green-400 cursor-pointer">Careers</li>
              <li className="hover:text-green-400 cursor-pointer" onClick={onOpenLegal}>
                Legal
              </li>
              <li className="hover:text-green-400 cursor-pointer" onClick={onOpenContact}>
                Contact
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                contact@findawa.ma
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +212 5XX-XXXXXX
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Fez, Morocco
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>© 2024 FinDawa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}