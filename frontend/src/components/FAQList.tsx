import React, { useEffect, useState } from 'react';
import { faqService, FAQ } from '../services/faqService';

const FAQList: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [faqsData, categoriesData] = await Promise.all([
          faqService.getAllFAQs({ isActive: true }),
          faqService.getCategories()
        ]);
        setFaqs(faqsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('SSS yüklenirken bir hata oluştu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredFaqs = selectedCategory
    ? faqs.filter(faq => faq.category === selectedCategory)
    : faqs;

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sıkça Sorulan Sorular</h2>
            <p className="text-gray-600 text-sm mt-1">En çok merak edilen sorular ve cevapları</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div 
              key={faq.id} 
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleExpand(faq.id)}
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    expandedId === faq.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedId === faq.id && (
                <div className="px-6 py-4 bg-white">
                  <div 
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                  <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                    Son güncelleme: {new Date(faq.updatedAt).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Bu kategoride soru bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQList;
