import Link from 'next/link';
import { Users } from 'lucide-react';
import PrivacyLink from '@/components/GDPR/PrivacyLink';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Viral Together</span>
            </div>
            <p className="text-gray-400">
              The ultimate platform for influencer marketing and brand partnerships.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/#features" className="hover:text-white">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/partners" className="hover:text-white">Partners</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white">About</Link></li>

              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><span className="text-gray-400 cursor-default">People</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
                               <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                 <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                 <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Viral Together. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 