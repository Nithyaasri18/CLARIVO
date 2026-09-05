import React, { useState } from 'react';
import { Search, BookOpen, Tag, Check, Filter } from 'lucide-react';

interface KnowledgeBaseModalProps {
  articles: any[];
}

export const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({ articles }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(articles[0]?.id || null);

  const categories = ['ALL', 'BILLING', 'CONNECTIVITY', 'HARDWARE', 'PLAN', 'REFUND'];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'ALL' || art.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      art.id.toLowerCase().includes(q) ||
      art.title.toLowerCase().includes(q) ||
      art.body.toLowerCase().includes(q) ||
      art.keywords?.some((k: string) => k.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const activeArticle = articles.find((a) => a.id === activeArticleId) || filteredArticles[0];

  return (
    <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-stone-200 bg-stone-50/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-stone-800" />
              <h2 className="font-bold text-stone-900 text-base">Support Knowledge Base Catalog</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-stone-200 text-stone-800">
                {articles.length} Verified Policies
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              Vector embeddings indexed via gemini-embedding-001 with 0.72 deterministic coverage threshold.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-stone-600 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search policies, keywords, or error codes..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 placeholder:text-stone-600"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
          <Filter className="w-3.5 h-3.5 text-stone-600 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Body: Master / Detail */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px] divide-y md:divide-y-0 md:divide-x divide-stone-200">
        {/* Left: Article List */}
        <div className="md:col-span-5 max-h-[600px] overflow-y-auto divide-y divide-stone-100">
          {filteredArticles.map((art) => {
            const isSelected = activeArticle?.id === art.id;
            return (
              <div
                key={art.id}
                onClick={() => setActiveArticleId(art.id)}
                className={`p-3.5 cursor-pointer transition-colors border-l-3 ${
                  isSelected
                    ? 'bg-stone-50 border-l-stone-900'
                    : 'hover:bg-stone-50/50 border-l-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {art.id}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-stone-600 px-1.5 py-0.5 rounded bg-stone-100">
                    {art.category}
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-stone-900 line-clamp-1">{art.title}</h4>
                <p className="text-[11px] text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                  {art.body}
                </p>
              </div>
            );
          })}
          {filteredArticles.length === 0 && (
            <div className="p-8 text-center text-xs text-stone-600">
              No knowledge base articles matched your search.
            </div>
          )}
        </div>

        {/* Right: Active Article Detailed Inspection */}
        <div className="md:col-span-7 p-6 max-h-[600px] overflow-y-auto bg-stone-50/30">
          {activeArticle ? (
            <div className="space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {activeArticle.id}
                  </span>
                  <span className="text-xs uppercase font-bold text-stone-600 px-2 py-0.5 rounded bg-stone-100">
                    {activeArticle.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900 mt-1">{activeArticle.title}</h3>
              </div>

              {/* Policy Body */}
              <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider font-bold text-stone-600 block mb-2">
                  Official Standard Operating Policy
                </span>
                <p className="text-xs text-stone-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {activeArticle.body}
                </p>
              </div>

              {/* Scope & Applies To */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white border border-stone-200 rounded-lg p-3">
                  <span className="text-[10px] uppercase font-bold text-stone-600 block mb-1">
                    Applies to Broadband Plans
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeArticle.applies_to?.map((plan: string) => (
                      <span
                        key={plan}
                        className="px-2 py-0.5 rounded bg-stone-100 font-mono text-[10px] font-semibold text-stone-800"
                      >
                        {plan}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-lg p-3">
                  <span className="text-[10px] uppercase font-bold text-stone-600 block mb-1">
                    Required Account Fields
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeArticle.required_fields?.map((field: string) => (
                      <span
                        key={field}
                        className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 font-mono text-[10px] font-semibold text-amber-900"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Keyword Triggers */}
              <div className="bg-white border border-stone-200 rounded-lg p-3">
                <span className="text-[10px] uppercase font-bold text-stone-600 block mb-1.5">
                  Semantic Keyword Tokens
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeArticle.keywords?.map((kw: string) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[11px] flex items-center space-x-1"
                    >
                      <Tag className="w-2.5 h-2.5 text-stone-600" />
                      <span>{kw}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-stone-600">Select an article to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
};
