import React from 'react';
import { WikiArticleDetail } from '../services/wikipediaService';

interface ArticleCardProps {
  article: WikiArticleDetail;
  index: number;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, index }) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group flex flex-col h-full hover:-translate-y-1" id={`article-card-${index}`}>
      <div className="p-8 flex-grow">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 text-base font-black border border-blue-100 shadow-inner">
              {index + 1}
            </div>
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors serif-font leading-tight">
              {article.title}
            </h3>
          </div>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            <i className="fa-solid fa-arrow-up-right-from-square text-sm"></i>
          </a>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-5 serif-font">
          {article.summary}
        </p>
      </div>
      <div className="bg-slate-50/50 px-8 py-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-bold tracking-widest uppercase">
        <span>
          {index === 0 ? (
            'STARTING POINT'
          ) : (
            <span className="text-blue-600 flex items-center">
              <i className="fa-solid fa-shuffle mr-2"></i>Divergence: {article.score}
            </span>
          )}
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
          <span>Verified</span>
        </span>
      </div>
    </div>
  );
};
