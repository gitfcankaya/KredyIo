import React from 'react';
import NewsArticleList from '../components/NewsArticleList';

const NewsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <NewsArticleList />
    </div>
  );
};

export default NewsPage;
