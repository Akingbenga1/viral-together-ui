import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface UnauthenticatedLayoutProps {
  children: ReactNode;
}

export default function UnauthenticatedLayout({ children }: UnauthenticatedLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with clickable logo */}
      <Header />
      
      {/* Main content */}
      <main>
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 