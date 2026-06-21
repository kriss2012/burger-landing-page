import React from 'react';

const Navbar = ({ onOpenCustomizer }) => {
  return (
    <nav className="w-full flex items-center justify-between px-6 md:px-12 py-4 fixed top-0 left-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
      <div className="flex items-center gap-2">
        <span className="text-2xl md:text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-500 to-red-500 font-['Anton']">
          BURGER KING
        </span>
      </div>

      <div className="hidden md:flex items-center gap-10 text-xs md:text-sm uppercase font-semibold tracking-widest text-gray-300">
        <a href="#hero" className="hover:text-amber-400 transition-colors duration-300">Home</a>
        <a href="#deconstruct" className="hover:text-amber-400 transition-colors duration-300">Deconstruct</a>
        <a href="#customizer" className="hover:text-amber-400 transition-colors duration-300">Burger Lab</a>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => {
            const el = document.getElementById('customizer');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-5 py-2 md:px-6 md:py-2.5 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-red-600/30 active:scale-95 cursor-pointer"
        >
          Burger Lab
        </button>
      </div>
    </nav>
  );
};

export default Navbar;