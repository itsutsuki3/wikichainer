const API_URL = 'https://ja.wikipedia.org/w/api.php';

export interface WikiArticleDetail {
  title: string;
  summary: string;
  url: string;
  pageId: number;
  links?: string[];
  categories?: string[];
  score?: number;
}

export interface PageContext {
  links: string[];
  categories: string[];
}

export const wikipediaService = {
  async searchPage(query: string): Promise<string[]> {
    const params = new URLSearchParams({
      action: 'query',
      list: 'search',
      srsearch: query,
      format: 'json',
      origin: '*',
    });
    try {
      const response = await fetch(`${API_URL}?${params}`);
      const data = await response.json();
      return data.query.search?.map((s: { title: string }) => s.title) || [];
    } catch (e) {
      return [];
    }
  },

  async getPageContext(title: string): Promise<PageContext> {
    const params = new URLSearchParams({
      action: 'parse',
      page: title,
      prop: 'links|categories',
      format: 'json',
      origin: '*',
      redirects: '1',
    });
    try {
      const response = await fetch(`${API_URL}?${params}`);
      const data = await response.json();
      if (!data.parse) return { links: [], categories: [] };

      const datePattern = /^(\d+年|\d+月\d+日|\d+世紀|紀元前.*)$/;
      const links = (data.parse.links as Array<{ ns: number; '*': string }>)
        .filter(l => l.ns === 0 && l['*'] && !l['*'].includes(':') && !datePattern.test(l['*']))
        .map(l => l['*']);
      const categories = (data.parse.categories as Array<{ '*': string }>)?.map(c => c['*']) || [];

      return { links, categories };
    } catch (e) {
      return { links: [], categories: [] };
    }
  },

  async fetchSingleArticleDetail(title: string): Promise<WikiArticleDetail | null> {
    const params = new URLSearchParams({
      action: 'query',
      prop: 'extracts|info',
      exintro: '1',
      explaintext: '1',
      inprop: 'url',
      titles: title,
      format: 'json',
      origin: '*',
      redirects: '1',
    });

    try {
      const response = await fetch(`${API_URL}?${params}`);
      const data = await response.json();
      const page = Object.values(data.query.pages || {})[0] as {
        missing?: string;
        title: string;
        extract?: string;
        fullurl: string;
        pageid: number;
      } | undefined;

      if (!page || page.missing === '') return null;

      let summary = page.extract || '';
      if (!summary || summary.length < 20) {
        const fbParams = new URLSearchParams({
          action: 'query',
          prop: 'extracts',
          exchars: '800',
          explaintext: '1',
          pageids: String(page.pageid),
          format: 'json',
          origin: '*',
        });
        const fbResponse = await fetch(`${API_URL}?${fbParams}`);
        const fbData = await fbResponse.json();
        const fbPage = fbData.query.pages[page.pageid] as { extract?: string } | undefined;
        summary = fbPage?.extract || '';
      }

      if (!summary || summary.length < 20) return null;

      return {
        title: page.title,
        summary,
        url: page.fullurl,
        pageId: page.pageid,
      };
    } catch (e) {
      return null;
    }
  },
};
