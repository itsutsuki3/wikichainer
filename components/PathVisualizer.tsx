import React, { Fragment } from 'react';

interface PathVisualizerProps {
  titles: string[];
}

export const PathVisualizer: React.FC<PathVisualizerProps> = ({ titles }) => {
  return (
    <div className="bg-slate-900 rounded-[2rem] p-8 mb-12 shadow-2xl overflow-hidden relative border border-slate-800" id="path-visualizer-container">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <i className="fa-solid fa-expand text-[12rem] text-white"></i>
      </div>
      <div className="relative z-10">
        <h2 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center">
          <i className="fa-solid fa-compass mr-2 animate-pulse"></i> 20歩の拡散軌道
        </h2>
        <div className="flex flex-wrap items-center gap-3" id="path-nodes-list">
          {titles.map((title, idx) => (
            <Fragment key={idx}>
              <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-white text-sm path-node backdrop-blur-md font-medium">
                <span className="text-blue-400 mr-2 text-[10px]">{idx + 1}</span>
                {title}
              </div>
              {idx < titles.length - 1 && (
                <div className="flex items-center justify-center w-6 h-6">
                  <i className="fa-solid fa-arrow-right-long text-white/20 text-xs"></i>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
