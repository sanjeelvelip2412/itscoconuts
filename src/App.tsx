import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './lib/contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;