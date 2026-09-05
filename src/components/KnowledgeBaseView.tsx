import React, { useState } from 'react';
import { Search, BookOpen, Tag, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { KBArticle } from '../types';

interface KnowledgeBaseViewProps {
  articles: KBArticle[];
  onSelectArticle?: (article: KBArticle) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({ articles, onSelectArticle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeArticle, setActiveArticle] = useState<KBArticle | null>(articles[0] || null);

  const categories = ['ALL', 'BILLING', 'CONNECTIVITY', 'HARDWARE', 'ACCOUNT'];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'ALL' || art.category === selectedCategory;
    const matchesSearch =
      art.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.body.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="clarivo-knowledge-view" className="flex-1 flex bg-white overflow-hidden select-none">
      {/* Article List Column */}
      <div className="w-80 sm:w-96 border-r border-[#E5E3DD] flex flex-col h-full bg-[#FAF9F5]">
        {/* Header */}
        <div className="p-3.5 border-b border-[#E5E3DD] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <BookOpen size={14} className="text-[#0F4C5C]" />
              Policy Knowledge Base
            </span>
            <span className="font-mono text-[11px] text-stone-500 bg-stone-200/60 px-1.5 py-0.5 rounded">
              {articles.length} Verified
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search policy articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#0F4C5C]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 text-[10px]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#0F4C5C] text-white font-semibold'
                    : 'bg-stone-200/60 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Article Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
          {filteredArticles.map((art) => {
            const isSelected = activeArticle?.id === art.id;
            return (
              <button
                key={art.id}
                onClick={() => {
                  setActiveArticle(art);
                  if (onSelectArticle) onSelectArticle(art);
                }}
                className={`w-full p-3 text-left transition-colors flex flex-col gap-1 ${
                  isSelected ? 'bg-white border-l-3 border-[#0F4C5C] shadow-2xs' : 'hover:bg-white/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-[#0F4C5C]">
                    {art.id}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-stone-400 bg-stone-100 px-1 rounded">
                    {art.category}
                  </span>
                </div>

                <div className="text-xs font-semibold text-stone-900 leading-snug line-clamp-1">
                  {art.title}
                </div>

                <div className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                  {art.body}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Article Detail Preview */}
      <div className="flex-1 p-6 overflow-y-auto bg-white text-stone-800">
        {activeArticle ? (
          <div className="max-w-2xl space-y-5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#0F4C5C]/10 text-[#0F4C5C] font-bold">
                {activeArticle.id}
              </span>
              <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">
                {activeArticle.category} Policy
              </span>
              <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-[#15803D]">
                <ShieldCheck size={13} />
                Strict Grounding Invariant
              </span>
            </div>

            <h1 className="text-xl font-bold text-stone-900 leading-tight">
              {activeArticle.title}
            </h1>

            <div className="p-4 rounded bg-[#FAF9F5] border border-[#E5E3DD] text-[13.5px] leading-relaxed text-stone-800 font-serif">
              "{activeArticle.body}"
            </div>

            {/* Applies To */}
            {activeArticle.applies_to && activeArticle.applies_to.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                  Applies to Plans
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeArticle.applies_to.map((plan) => (
                    <span
                      key={plan}
                      className="font-mono text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200"
                    >
                      {plan}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Required Fields */}
            {activeArticle.required_fields && activeArticle.required_fields.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                  Required State Signals Before Execution
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeArticle.required_fields.map((f) => (
                    <span
                      key={f}
                      className="font-mono text-xs px-2 py-0.5 rounded bg-[#D97706]/10 text-[#B45309] border border-[#D97706]/20 font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {activeArticle.keywords && activeArticle.keywords.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                  Deterministic Trigger Keywords
                </span>
                <div className="flex flex-wrap gap-1 text-[11px] text-stone-500">
                  {activeArticle.keywords.map((kw) => (
                    <span key={kw} className="bg-stone-50 px-2 py-0.5 rounded border border-stone-200">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-stone-400 text-xs">Select a policy article to inspect details.</div>
        )}
      </div>
    </div>
  );
};
