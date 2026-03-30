import { Outlet } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Footer */}
      <footer className="bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                  <span className="text-white font-bold">e</span>
                </div>
                <span className="text-lg font-bold">evenzo<span className="text-coral">.</span></span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Discover and book amazing events near you. From concerts to tech summits, we've got it all.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
                <li><a href="/?section=events" className="hover:text-primary transition-colors">Events</a></li>
                <li><a href="/login" className="hover:text-primary transition-colors">Login</a></li>
                <li><a href="/signup" className="hover:text-primary transition-colors">Sign Up</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">For Organizers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/organizer/create" className="hover:text-primary transition-colors">Create Event</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700/50 mt-8 pt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} evenzo. All rights reserved. Made with 💚 in India.
          </div>
        </div>
      </footer>
    </div>
  );
}
