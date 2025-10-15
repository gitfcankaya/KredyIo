/**
 * BlogPostCard Component
 * News article cards with author, category, tags
 */

import React from 'react';
import { BlogPostCardProps } from './types';
import './UI.css';

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post,
  variant = 'vertical',
  showExcerpt = true,
  showAuthor = true,
  showCategory = true,
  showTags = false,
  showReadTime = true,
  className = '',
}) => {
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <article className={`blog-post-card ${variant} ${post.featured ? 'featured' : ''} ${className}`}>
      <a href={post.href} className="blog-post-link">
        {post.image && (
          <div className="blog-post-image">
            <img src={post.image} alt={post.title} />
            {post.featured && (
              <div className="blog-post-featured-badge">Öne Çıkan</div>
            )}
          </div>
        )}
        
        <div className="blog-post-content">
          <div className="blog-post-header">
            {showCategory && post.category && (
              <span 
                className="blog-post-category"
                style={{ color: post.category.color }}
              >
                {post.category.name}
              </span>
            )}
            
            <div className="blog-post-meta">
              <time className="blog-post-date">{formatDate(post.date)}</time>
              {showReadTime && post.readTime && (
                <>
                  <span className="blog-post-separator">•</span>
                  <span className="blog-post-read-time">{post.readTime} dk okuma</span>
                </>
              )}
            </div>
          </div>
          
          <h3 className="blog-post-title">{post.title}</h3>
          
          {showExcerpt && post.excerpt && (
            <p className="blog-post-excerpt">{post.excerpt}</p>
          )}
          
          {showTags && post.tags && post.tags.length > 0 && (
            <div className="blog-post-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="blog-post-tag">#{tag}</span>
              ))}
            </div>
          )}
          
          {showAuthor && (
            <div className="blog-post-author">
              {post.author.avatar && (
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="blog-post-author-avatar"
                />
              )}
              <div className="blog-post-author-info">
                <div className="blog-post-author-name">{post.author.name}</div>
                {post.author.title && (
                  <div className="blog-post-author-title">{post.author.title}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </a>
    </article>
  );
};

export default BlogPostCard;
