'use client';

import Link from 'next/link';
import { ArrowLeft, Users } from 'lucide-react';
import UnauthenticatedLayout from '@/components/UnauthenticatedLayout';

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed">
                  At Viral Together, we respect your privacy and are committed to protecting your personal data. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
                  you use our platform and services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may collect personal information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
                  <li>Name, email address, and contact information</li>
                  <li>Username, password, and account preferences</li>
                  <li>Profile information, including photos and biographical details</li>
                  <li>Payment information for transactions</li>
                  <li>Social media handles and platform data</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Usage Data</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We automatically collect information about your use of our service, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>IP address, browser type, and device information</li>
                  <li>Pages viewed, time spent on pages, and navigation paths</li>
                  <li>Search queries and interaction with content</li>
                  <li>Location data (if permitted by your device settings)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Providing, maintaining, and improving our services</li>
                  <li>Processing transactions and managing your account</li>
                  <li>Facilitating connections between influencers and brands</li>
                  <li>Sending you updates, marketing communications, and promotional materials</li>
                  <li>Analyzing usage patterns to enhance user experience</li>
                  <li>Detecting and preventing fraud, abuse, and security issues</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>With Other Users:</strong> Profile information may be visible to other users as part of our matching and discovery features</li>
                  <li><strong>Service Providers:</strong> We may share data with third-party service providers who assist in operating our platform</li>
                  <li><strong>Business Transfers:</strong> Information may be transferred in connection with a merger, sale, or acquisition</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information to comply with legal obligations or protect our rights</li>
                  <li><strong>Consent:</strong> We may share information when you give us explicit consent to do so</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal 
                  data against unauthorized access, alteration, disclosure, or destruction. However, no method of 
                  transmission over the internet or electronic storage is completely secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed">
                  We retain your personal information for as long as necessary to provide our services and fulfill 
                  the purposes outlined in this Privacy Policy. We may retain certain information for longer periods 
                  if required by law or for legitimate business purposes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights and Choices</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Depending on your location, you may have certain rights regarding your personal data, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Access to your personal data</li>
                  <li>Correction of inaccurate or incomplete data</li>
                  <li>Deletion of your personal data</li>
                  <li>Restriction of processing</li>
                  <li>Data portability</li>
                  <li>Objection to processing</li>
                  <li>Withdrawal of consent</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar tracking technologies to collect information about your browsing 
                  activities and to provide personalized content and advertisements. You can manage your cookie 
                  preferences through your browser settings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Links and Services</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our service may contain links to third-party websites or services. We are not responsible for 
                  the privacy practices of these third parties. We encourage you to review their privacy policies 
                  before providing any personal information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our service is not intended for individuals under the age of 13. We do not knowingly collect 
                  personal information from children under 13. If we become aware that we have collected such 
                  information, we will take steps to delete it.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. International Data Transfers</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure 
                  appropriate safeguards are in place to protect your personal data in accordance with applicable 
                  data protection laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                  the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to 
                  review this Privacy Policy periodically.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="text-gray-700 font-medium">Email: privacy@viraltogether.com</p>
                  <p className="text-gray-700">Address: [Your Company Address]</p>
                  <p className="text-gray-700">Phone: [Your Company Phone]</p>
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