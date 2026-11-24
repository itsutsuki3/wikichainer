import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 py-5 sticky top-0 z-50 shadow-sm" id="main-header">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div
          className="flex items-center space-x-3 group cursor-pointer"
          onClick={() => window.location.reload()}
          id="logo-container"
        >
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-shoe-prints text-lg transform -rotate-45"></i>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight serif-font">Wiki-Chainer</h1>
        </div>
        <div className="hidden sm:flex items-center space-x-4" id="engine-badge-container">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
            Divergent Engine (Light Mode)
          </span>
        </div>
      </div>
    </header>
  );
};
