'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle,
  AlertCircle,
  HelpCircle,
  CreditCard,
  Shield,
  Users,
  Building
} from 'lucide-react';
import UnauthenticatedLayout from '@/components/UnauthenticatedLayout';
import ChatModal from '@/components/ChatModal';

interface ContactFormData {
  name: string;
  email: string;
  userType: 'influencer' | 'business' | 'general';
  category: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    userType: 'general',
    category: 'general',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const contactCategories = [
    { id: 'general', label: 'General Inquiries', icon: HelpCircle, description: 'Basic questions about the platform' },
    { id: 'technical', label: 'Technical Support', icon: AlertCircle, description: 'Bug reports, login issues, technical problems' },
    { id: 'sales', label: 'Sales & Partnerships', icon: Building, description: 'Business development, enterprise inquiries' },
    { id: 'billing', label: 'Billing Support', icon: CreditCard, description: 'Payment issues, subscription questions' },
    { id: 'policy', label: 'Content & Policy', icon: Shield, description: 'Content guidelines, policy violations' },
    { id: 'media', label: 'Media & Press', icon: Users, description: 'Journalist inquiries, press releases' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (in real implementation, this would call an API)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        userType: 'general',
        category: 'general',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UnauthenticatedLayout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get in touch with our team. We&apos;re here to help you succeed with Viral Together.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          
          {/* Contact Information - Left Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              {/* Contact Methods */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                    <p className="text-gray-600 text-sm mb-2">For general inquiries and support</p>
                    <div className="space-y-1">
                      <a href="mailto:support@viraltogether.com" className="block text-primary-600 hover:text-primary-700 font-medium">
                        support@viraltogether.com
                      </a>
                      <a href="mailto:digitalupgradeintelligence@gmail.com" className="block text-primary-600 hover:text-primary-700 font-medium">
                        digitalupgradeintelligence@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                    <p className="text-gray-600 text-sm mb-2">Business hours only</p>
                    <a href="tel:+447448989940" className="text-primary-600 hover:text-primary-700 font-medium">
                      +44 744 898 9940
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
                    <p className="text-gray-600 text-sm mb-2">Real-time support available</p>
                    <button 
                      onClick={() => setIsChatOpen(true)}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Business Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Headquarters</p>
                    <p className="text-gray-600 text-sm">
                      Lynch Wood Business Park<br />
                      Orton, Peterborough<br />
                      UK
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Business Hours</p>
                    <p className="text-gray-600 text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                      Weekend: Limited support available
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Response Time</p>
                    <p className="text-gray-600 text-sm">
                      We typically respond within 1-2 hours<br />
                      Priority support: 30-60 minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Right Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 font-medium">Message sent successfully!</p>
                    <p className="text-green-700 text-sm">We&apos;ll get back to you within 1-2 hours.</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-medium">Failed to send message</p>
                    <p className="text-red-700 text-sm">Please try again or contact us directly via email.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* User Type */}
                <div>
                  <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                    I am a *
                  </label>
                  <select
                    id="userType"
                    name="userType"
                    required
                    value={formData.userType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="general">General User</option>
                    <option value="influencer">Influencer/Creator</option>
                    <option value="business">Business/Brand</option>
                  </select>
                </div>

                {/* Contact Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    What can we help you with? *
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {contactCategories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <label
                          key={category.id}
                          className={`relative flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                            formData.category === category.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="category"
                            value={category.id}
                            checked={formData.category === category.id}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            formData.category === category.id
                              ? 'bg-primary-100'
                              : 'bg-gray-100'
                          }`}>
                            <IconComponent className={`w-4 h-4 ${
                              formData.category === category.id
                                ? 'text-primary-600'
                                : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <p className={`font-medium ${
                              formData.category === category.id
                                ? 'text-primary-900'
                                : 'text-gray-900'
                            }`}>
                              {category.label}
                            </p>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-vertical"
                    placeholder="Please provide detailed information about your inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    * Required fields
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Links */}
            <div className="mt-8 bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need immediate help?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link 
                  href="/help"
                  className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <HelpCircle className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Help Center</p>
                    <p className="text-sm text-gray-600">Browse our comprehensive guides</p>
                  </div>
                </Link>
                
                <a 
                  href="mailto:support@viraltogether.com"
                  className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <Mail className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-600">Direct email for urgent issues</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </UnauthenticatedLayout>
  );
}
