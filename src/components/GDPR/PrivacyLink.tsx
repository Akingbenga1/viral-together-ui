'use client';

import { useState } from 'react';
import { Shield, Download, Trash2, Settings } from 'lucide-react';

export default function PrivacyLink() {
  const [showModal, setShowModal] = useState(false);

  const handleDataExport = () => {
    // Simple data export simulation
    const userData = {
      profile: localStorage.getItem('user-profile'),
      preferences: localStorage.getItem('user-preferences'),
      cookieConsent: localStorage.getItem('cookie-consent'),
      timestamp: new Date().toISOString(),
      note: "This is a simulated data export. In a real implementation, this would contain all user data from the backend."
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAccountDeletion = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Simple account deletion simulation
      localStorage.clear();
      alert('Account deletion simulated. In a real implementation, this would delete your account from the backend.');
      window.location.href = '/';
    }
  };

  const handleCookieSettings = () => {
    // Clear cookie consent to show banner again
    localStorage.removeItem('cookie-consent');
    window.location.reload();
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <Shield className="w-4 h-4" />
        <span>Privacy</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Privacy & Data</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleDataExport}
                className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg"
              >
                <Download className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium">Export My Data</h4>
                  <p className="text-sm text-gray-600">Download all your data</p>
                </div>
              </button>

              <button
                onClick={() => window.open('/privacy', '_blank')}
                className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg"
              >
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-medium">Privacy Policy</h4>
                  <p className="text-sm text-gray-600">Read our privacy policy</p>
                </div>
              </button>

              <button
                onClick={handleCookieSettings}
                className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg"
              >
                <Settings className="w-5 h-5 text-purple-600" />
                <div>
                  <h4 className="font-medium">Cookie Settings</h4>
                  <p className="text-sm text-gray-600">Manage cookie preferences</p>
                </div>
              </button>

              <button
                onClick={handleAccountDeletion}
                className="w-full flex items-center space-x-3 p-3 text-left hover:bg-red-50 rounded-lg text-red-600"
              >
                <Trash2 className="w-5 h-5" />
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm">Permanently delete my account</p>
                </div>
              </button>
            </div>

            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                This is a frontend-only GDPR implementation. In a production environment, 
                these actions would interact with backend APIs to manage real user data.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
