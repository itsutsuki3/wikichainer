import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PathVisualizer } from './components/PathVisualizer';
import { ArticleCard } from './components/ArticleCard';
import { wikipediaService, WikiArticleDetail } from './services/wikipediaService';

const countIntersection = (arr1: string[], arr2: string[]): number => {
  const set2 = new Set(arr2);
  return arr1.filter(item => set2.has(item)).length;
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [action, setAction] = useState('');
  const [articles, setArticles] = useState<WikiArticleDetail[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startJourney = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setArticles([]);
    setError(null);
    setProgress(0);

    const collected: WikiArticleDetail[] = [];
    const TARGET = 20;

    try {
      setAction('旅の起点を探しています...');
      const startTitles = await wikipediaService.searchPage(query);
      let initialStep: WikiArticleDetail | null = null;
      for (const t of startTitles) {
        initialStep = await wikipediaService.fetchSingleArticleDetail(t);
        if (initialStep) {
          const ctx = await wikipediaService.getPageContext(initialStep.title);
          Object.assign(initialStep, ctx, { score: 0 });
          break;
        }
      }
      if (!initialStep) throw new Error('出発点が見つかりません。');
      collected.push(initialStep);
      setArticles([...collected]);
      setProgress(5);

      while (collected.length < TARGET) {
        const prev = collected[collected.length - 1];
        setAction(`[${collected.length}/${TARGET}] 次の「遠い」トピックを計算中...`);

        const prevLinks = prev.links || [];
        const prevCategories = prev.categories || [];

        let candidates = prevLinks.filter(l => !collected.some(a => a.title === l));
        if (candidates.length === 0) {
          const fallback = await wikipediaService.searchPage(prev.title);
          candidates = fallback.filter(l => !collected.some(a => a.title === l));
        }

        // ランダムに候補をピックアップして、最もスコアが低い（＝遠い）ものを選ぶ
        const pool = candidates.sort(() => Math.random() - 0.5).slice(0, 5);
        let bestDistantCandidate: WikiArticleDetail | null = null;
        let minScore = Infinity;

        for (const title of pool) {
          const ctx = await wikipediaService.getPageContext(title);
          const linkOverlap = countIntersection(prevLinks, ctx.links);
          const catOverlap = countIntersection(prevCategories, ctx.categories);
          const score = linkOverlap + (catOverlap * 3);

          if (score < minScore) {
            const detail = await wikipediaService.fetchSingleArticleDetail(title);
            if (detail) {
              minScore = score;
              bestDistantCandidate = { ...detail, ...ctx, score };
              if (score === 0) break;
            }
          }
        }

        if (!bestDistantCandidate && pool.length > 0) {
          const detail = await wikipediaService.fetchSingleArticleDetail(pool[0]);
          if (detail) {
            const ctx = await wikipediaService.getPageContext(detail.title);
            bestDistantCandidate = { ...detail, ...ctx, score: 99 };
          }
        }

        if (bestDistantCandidate) {
          collected.push(bestDistantCandidate);
          setArticles([...collected]);
          setProgress(Math.floor((collected.length / TARGET) * 100));
        } else {
          break;
        }
      }
      setProgress(100);
    } catch (err: any) {
      setError(err?.message || '不明なエラーが発生しました');
    } finally {
      setLoading(false);
      setAction('');
    }
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100" id="app-root">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 w-full py-12 md:py-20" id="main-content">
        <section className="max-w-3xl mx-auto text-center mb-16 md:mb-24" id="hero-section">
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 serif-font leading-[1.1] tracking-tight">
            <span className="gradient-text">ジャンルを飛び越える</span>
            <br />
            20歩の拡散の旅
          </h2>
          <p className="text-slate-500 text-lg md:text-xl mb-10 leading-relaxed font-medium">
            Wikipediaのネットワークを「逆走」し、全く別の世界へ。
            <br />
            共通点の最も少ない記事を選び続ける、予測不能な知の連鎖。
          </p>

          <form onSubmit={startJourney} className="relative max-w-2xl mx-auto" id="search-form">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <i className="fa-solid fa-magnifying-glass text-slate-300"></i>
            </div>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="旅を始めるキーワードを入力..."
              disabled={loading}
              className="w-full pl-14 pr-40 py-6 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-xl font-medium placeholder:text-slate-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-3 top-3 bottom-3 px-10 bg-blue-600 text-white rounded-[2rem] font-black text-lg hover:bg-blue-700 disabled:bg-slate-300 transition-all shadow-xl shadow-blue-200 flex items-center space-x-2"
            >
              {loading ? (
                <i className="fa-solid fa-compass animate-spin"></i>
              ) : (
                <>
                  <span>出発</span>
                  <i className="fa-solid fa-arrow-right text-sm"></i>
                </>
              )}
            </button>
          </form>

          {loading && (
            <div className="mt-12 max-w-lg mx-auto animate-in fade-in zoom-in duration-500" id="progress-container">
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-4 border border-slate-200 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-center space-x-3 text-blue-600 font-bold italic tracking-wide">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                <span>{action}</span>
              </div>
            </div>
          )}
        </section>

        {error && (
          <div className="max-w-2xl mx-auto mb-16 bg-red-50 border border-red-100 p-8 rounded-[2rem] text-red-700 flex items-start space-x-5 shadow-sm" id="error-container">
            <div className="bg-red-100 p-3 rounded-2xl">
              <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
            </div>
            <div>
              <p className="font-black text-lg mb-1">エラーが発生しました</p>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {articles.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000" id="results-container">
            <PathVisualizer titles={articles.map(a => a.title)} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10" id="articles-grid">
              {articles.map((a, i) => (
                <ArticleCard key={i} article={a} index={i} />
              ))}
            </div>
            {!loading && (
              <div className="text-center py-24">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-full hover:bg-slate-50 hover:text-blue-600 font-bold transition-all shadow-sm group"
                >
                  <i className="fa-solid fa-arrow-up group-hover:-translate-y-1 transition-transform"></i>
                  <span>次元を戻して再出発</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>
      <footer className="py-16 border-t border-slate-100 text-center bg-white mt-auto" id="main-footer">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-slate-400 text-xs tracking-[0.3em] font-black uppercase mb-2">
            Wiki-Chainer / Lowest-Overlap Engine
          </p>
          <p className="text-slate-300 text-[10px] font-medium">
            Categorical & Link Co-occurrence Heuristics / Light Edition
          </p>
        </div>
      </footer>
    </div>
  );
};
