'use client';

import { Shield, Eye, Settings, Lock, Mail, CheckCircle } from 'lucide-react';
import UnauthenticatedLayout from '@/components/UnauthenticatedLayout';

export default function PrivacyPage() {
  return (
    <UnauthenticatedLayout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We're committed to protecting your privacy and being transparent about how we handle your information.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <span>Last updated:</span>
            <span className="font-medium">December 2024</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Section 1: Information We Collect & Use */}
          <section className="mb-16">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Information We Collect & Use</h2>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">What We Collect</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Account Information:</strong> Your name, email address, and profile details when you create an account</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Profile Data:</strong> Your bio, social media links, and professional information you choose to share</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Usage Information:</strong> How you interact with our platform, including pages visited and features used</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Content:</strong> Messages, collaboration requests, and other content you create on our platform</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">How We Use Your Information</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Provide Services:</strong> To connect influencers with businesses and manage collaborations</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Communication:</strong> To send you important updates about your account and collaborations</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Improve Platform:</strong> To understand how you use our services and make them better</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Security:</strong> To protect your account and prevent fraud</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Information Sharing & Your Control */}
          <section className="mb-16">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Information Sharing & Your Control</h2>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">When We Share Information</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Service Providers:</strong> We use trusted partners for payment processing, hosting, and analytics</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>With Your Permission:</strong> We'll ask for your explicit consent before sharing your data in other ways</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Control Over Your Data</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>View & Edit:</strong> Access and update your profile information anytime through your account settings</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Delete Account:</strong> You can delete your account and all your data at any time</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Marketing Preferences:</strong> Choose which emails you want to receive from us</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Data Security & Your Rights */}
          <section className="mb-16">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Data Security & Your Rights</h2>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">How We Protect Your Data</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Encryption:</strong> We encrypt your data both in transit and at rest using industry-standard methods</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Secure Infrastructure:</strong> We use trusted cloud providers with robust security measures</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Regular Updates:</strong> We regularly update our security practices and monitor for potential threats</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Privacy Rights</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Access:</strong> Request a copy of all the personal data we have about you</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Correction:</strong> Ask us to fix any inaccurate information we have about you</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Deletion:</strong> Request that we delete your personal data (with some exceptions)</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Portability:</strong> Get your data in a format you can easily transfer to another service</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Questions About Privacy?</h3>
                  <p className="text-gray-700 mb-4">
                    We're here to help with any privacy-related questions or concerns you might have.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-primary-600" />
                    <a 
                      href="mailto:privacy@viraltogether.com" 
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      privacy@viraltogether.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Note */}
          <div className="text-center text-gray-600 text-sm">
            <p>
              This privacy policy applies to all users of Viral Together. We may update this policy from time to time, 
              and we'll notify you of any significant changes via email or through our platform.
            </p>
          </div>
        </div>
      </div>
    </UnauthenticatedLayout>
  );
}
