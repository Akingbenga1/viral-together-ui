'use client';

import Link from 'next/link';
import { ArrowLeft, Users } from 'lucide-react';
import UnauthenticatedLayout from '@/components/UnauthenticatedLayout';

export default function TermsOfServicePage() {
  return (
    <UnauthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-block mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg mx-auto cursor-pointer hover:scale-105 transition-transform duration-200">
                <Users className="w-10 h-10 text-white" />
              </div>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using Viral Together ("the Service"), you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to these terms, you may not use or access the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Viral Together is a platform that connects influencers with brands for marketing campaigns and collaborations. 
                  Our services include:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Influencer discovery and search functionality</li>
                  <li>Campaign management tools</li>
                  <li>Analytics and performance tracking</li>
                  <li>Payment processing for collaborations</li>
                  <li>Communication tools between brands and influencers</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts and Registration</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To use certain features of the Service, you must register for an account. When you register, you agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information as necessary</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You agree not to use the Service for any unlawful purpose or in any way that could damage, 
                  disable, overburden, or impair the Service. Prohibited activities include:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Posting false, misleading, or fraudulent content</li>
                  <li>Violating any applicable laws or regulations</li>
                  <li>Infringing on intellectual property rights</li>
                  <li>Harassing, threatening, or intimidating other users</li>
                  <li>Attempting to gain unauthorized access to the Service</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  Payment processing is handled through secure third-party providers. By using our payment services, 
                  you agree to the terms and conditions of our payment processors. All fees are non-refundable 
                  unless otherwise stated.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed">
                  The Service and its original content, features, and functionality are owned by Viral Together 
                  and are protected by international copyright, trademark, patent, trade secret, and other 
                  intellectual property laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Please refer to our{' '}
                  <Link href="/privacy-policy" className="text-cyan-600 hover:text-cyan-700 underline">
                    Privacy Policy
                  </Link>{' '}
                  for information about how we collect, use, and protect your data.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Termination</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may terminate or suspend your account and access to the Service immediately, without prior 
                  notice, for conduct that we believe violates these Terms of Service or is harmful to other 
                  users, us, or third parties.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  In no event shall Viral Together be liable for any indirect, incidental, special, consequential, 
                  or punitive damages, including without limitation, loss of profits, data, use, goodwill, or 
                  other intangible losses, resulting from your use of the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                  we will provide notice prior to any new terms taking effect. What constitutes a material 
                  change will be determined at our sole discretion.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="text-gray-700 font-medium">Email: legal@viraltogether.com</p>
                  <p className="text-gray-700">Address: [Your Company Address]</p>
                </div>
              </section>

            </div>
          </div>

          {/* Back to Register */}
          <div className="text-center mt-12">
            <Link 
              href="/auth/register" 
              className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registration
            </Link>
          </div>
        </div>
      </div>
    </UnauthenticatedLayout>
  );
}