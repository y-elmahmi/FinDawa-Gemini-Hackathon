import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LegalModal({ isOpen, onClose }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl">Legal Notice</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6 text-gray-700">
            <section>
              <h3 className="text-xl mb-3">1. Publisher</h3>
              <p>
                FinDawa is a platform published by FinDawa SARL, a limited liability company with a capital of 100,000 DH, registered with the Casablanca Trade Register under number XXXXXX.
              </p>
              <p className="mt-2">Headquarters: Mohammed V Avenue, Casablanca 20000, Morocco</p>
            </section>

            <section>
              <h3 className="text-xl mb-3">2. Hosting</h3>
              <p>
                The site is hosted on secure servers located in the European Union, in accordance with GDPR standards.
              </p>
            </section>

            <section>
              <h3 className="text-xl mb-3">3. Data Protection</h3>
              <p>
                In accordance with Law 09-08 regarding the protection of individuals with respect to the processing of personal data, you have the right to access, rectify, and delete data concerning you.
              </p>
            </section>

            <section>
              <h3 className="text-xl mb-3">4. Liability</h3>
              <p>
                The medical information provided on the platform is for informational purposes only. FinDawa does not replace professional medical consultation.
              </p>
            </section>

            <section>
              <h3 className="text-xl mb-3">5. Intellectual Property</h3>
              <p>
                All content on the platform (texts, images, logos, code) is the exclusive property of FinDawa SARL and is protected by intellectual property laws.
              </p>
            </section>

            <section>
              <h3 className="text-xl mb-3">6. Cookies</h3>
              <p>
                The site uses cookies to improve the user experience. You can configure your browser to refuse cookies.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}