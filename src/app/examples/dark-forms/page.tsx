'use client';

import { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  MapPin, 
  Calendar,
  Building,
  Globe
} from 'lucide-react';
import { 
  FormWrapper,
  UniversalInput,
  UniversalButton,
  UniversalTextarea,
  UniversalSelect,
  UniversalCheckbox,
  RadioGroup
} from '@/components/ui/FormElements';

export default function DarkFormsExamplePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [teamSize, setTeamSize] = useState('just-me');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    company: '',
    role: '',
    bio: '',
    notifications: false,
    terms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const teamSizeOptions = [
    { value: 'just-me', label: 'Just me' },
    { value: '2-4', label: '2-4' },
    { value: '5+', label: '5+' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Dark Form Examples</h1>
          <p className="text-gray-600 text-lg">
            Demonstrating the beautiful dark form styling that matches the uploaded image
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Example 1: SSH Team Setup Form (matching uploaded image) */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              SSH Team Setup Form
            </h2>
            
            <FormWrapper dark fullScreen={false}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-form-text mb-2">
                  How many team members use SSH?
                </h3>
                <p className="text-form-text-muted text-sm">
                  This helps customize your vault structure for your team to manage connections and credentials.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <RadioGroup
                  name="team-size"
                  options={teamSizeOptions}
                  value={teamSize}
                  onChange={setTeamSize}
                  dark
                />

                <UniversalButton
                  type="submit"
                  dark
                  className="w-full mt-8"
                >
                  Next
                </UniversalButton>
              </form>
            </FormWrapper>
          </div>

          {/* Example 2: Complete Registration Form */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Complete Registration Form
            </h2>
            
            <FormWrapper dark fullScreen={false}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-form-text mb-2">
                  Create Your Account
                </h3>
                <p className="text-form-text-muted text-sm">
                  Join thousands of users already using our platform
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <UniversalInput
                    dark
                    label="First Name"
                    placeholder="John"
                    icon={<User className="w-5 h-5" />}
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                  <UniversalInput
                    dark
                    label="Last Name"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>

                {/* Email */}
                <UniversalInput
                  dark
                  type="email"
                  label="Email Address"
                  placeholder="john@example.com"
                  icon={<Mail className="w-5 h-5" />}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                {/* Password */}
                <div className="space-y-2">
                  <label className="label-dark">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input-dark pl-10 pr-12"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-form-text-placeholder" />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-form-text-placeholder hover:text-form-text transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Phone and Location */}
                <div className="grid grid-cols-2 gap-4">
                  <UniversalInput
                    dark
                    type="tel"
                    label="Phone"
                    placeholder="+1 (555) 123-4567"
                    icon={<Phone className="w-5 h-5" />}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <UniversalInput
                    dark
                    label="Location"
                    placeholder="New York, NY"
                    icon={<MapPin className="w-5 h-5" />}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                {/* Company and Role */}
                <UniversalInput
                  dark
                  label="Company"
                  placeholder="Acme Inc."
                  icon={<Building className="w-5 h-5" />}
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />

                <UniversalSelect
                  dark
                  label="Role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="">Select your role</option>
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="manager">Manager</option>
                  <option value="other">Other</option>
                </UniversalSelect>

                {/* Bio */}
                <UniversalTextarea
                  dark
                  label="Bio"
                  placeholder="Tell us a bit about yourself..."
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />

                {/* Checkboxes */}
                <div className="space-y-4">
                  <UniversalCheckbox
                    dark
                    id="notifications"
                    label="Send me email notifications about updates and new features"
                    checked={formData.notifications}
                    onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                  />
                  
                  <UniversalCheckbox
                    dark
                    id="terms"
                    label="I agree to the Terms of Service and Privacy Policy"
                    checked={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="space-y-3">
                  <UniversalButton
                    type="submit"
                    dark
                    variant="primary"
                    className="w-full"
                  >
                    Create Account
                  </UniversalButton>
                  
                  <UniversalButton
                    type="button"
                    dark
                    variant="secondary"
                    className="w-full"
                  >
                    Sign in with Google
                  </UniversalButton>
                </div>

                {/* Footer */}
                <div className="text-center pt-6 border-t border-form-border/20">
                  <p className="text-form-text-muted text-sm">
                    Already have an account?{' '}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                      Sign in
                    </a>
                  </p>
                </div>
              </form>
            </FormWrapper>
          </div>
        </div>

        {/* Light Form Example for Comparison */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Light Form (For Comparison)
          </h2>
          
          <div className="max-w-md mx-auto">
            <FormWrapper>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Contact Us
                </h3>
                <p className="text-gray-600 text-sm">
                  We&apos;d love to hear from you
                </p>
              </div>

              <form className="space-y-4">
                <UniversalInput
                  label="Name"
                  placeholder="Your name"
                  icon={<User className="w-5 h-5" />}
                />
                
                <UniversalInput
                  type="email"
                  label="Email"
                  placeholder="your@email.com"
                  icon={<Mail className="w-5 h-5" />}
                />
                
                <UniversalTextarea
                  label="Message"
                  placeholder="Your message..."
                  rows={4}
                />
                
                <UniversalButton
                  type="submit"
                  className="w-full"
                >
                  Send Message
                </UniversalButton>
              </form>
            </FormWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
