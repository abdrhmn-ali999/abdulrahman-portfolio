import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';

const BlogSection = () => {
  const { t, lang } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // حالات تتبع الصفحات المستلمة من الباك إند
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total_pages: 1,
    has_next: false,
    has_prev: false
  });

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/blog.php?page=${currentPage}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setPosts(data.data);
          setPagination(data.pagination);
        } else {
          setPosts(getPlaceholders());
          setPagination({ total_pages: 1, has_next: false, has_prev: false });
        }
      })
      .catch(() => {
        setPosts(getPlaceholders());
        setPagination({ total_pages: 1, has_next: false, has_prev: false });
      })
      .finally(() => setLoading(false));
  }, [currentPage, API_URL]);

  const getPlaceholders = () => [
    { id: 1, title_en: "Understanding React Hooks", title_ar: "فهم خطافات رياكت", body_en: "A deep dive into hooks...", body_ar: "تعمق في الخطافات الوظيفية واستخداماتها المتطورة...", tags: "React, JS", published_at: new Date().toISOString() },
    { id: 2, title_en: "Mastering PHP 8", title_ar: "احتراف PHP 8", body_en: "New features in PHP 8...", body_ar: "ميزات جديدة قوية في المعالجة الخلفية وهيكلة البيانات...", tags: "PHP, Backend", published_at: new Date().toISOString() },
    { id: 3, title_en: "CSS Grid vs Flexbox", title_ar: "مقارنة CSS Grid و Flexbox", body_en: "Which one to use?", body_ar: "دليل شامل لاختيار الأداة الأنسب لتوزيع عناصر واجهتك...", tags: "CSS, Design", published_at: new Date().toISOString() },
  ];

  // تدوير كروت الانتظار الشفافة أثناء التحميل (Skeleton Loader)
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((n) => (
        <div key={n} className="glass-card rounded-2xl p-6 h-64 animate-pulse flex flex-col justify-between">
          <div className="space-y-4">
            <div className="h-4 bg-white/5 rounded w-1/4" />
            <div className="h-6 bg-white/10 rounded w-3/4" />
            <div className="space-y-2">
              <div className="h-4 bg-white/5 rounded w-full" />
              <div className="h-4 bg-white/5 rounded w-5/6" />
            </div>
          </div>
          <div className="h-8 bg-white/5 rounded w-full mt-4" />
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto relative" id="blog">
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="mb-16 text-center">
        <p className="text-primary font-mono tracking-[0.25em] text-xs uppercase mb-2">// KNOWLEDGE BASE</p>
        <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
          {t('nav_blog')}
        </h2>
      </div>

      {loading ? renderSkeletons() : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <motion.div 
                key={post.id} 
                className="glass-card rounded-2xl p-6 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)] border border-white/5 hover:border-primary/30 transition-all flex flex-col justify-between group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div>
                  {/* تقسيم الوسوم وعرضها كبطاقات منفصلة */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags && post.tags.split(',').map((tag, i) => (
                      <span key={i} className="text-[10px] text-primary bg-primary/10 border border-primary/20 font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Tag size={8} /> {tag.trim()}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 tracking-wide group-hover:text-primary transition-colors line-clamp-2">
                    {lang === 'ar' ? post.title_ar : post.title_en}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {lang === 'ar' ? post.body_ar : post.body_en}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                  <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(post.published_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </span>
                  <button className="text-primary group-hover:text-secondary hover:underline text-xs font-bold font-mono tracking-wider uppercase transition-colors">
                    {t('read_more')} →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* أزرار التحكم بالصفحات ديناميكياً في حال وجود أكثر من صفحة */}
          {pagination.total_pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12 font-mono text-sm">
              <button 
                disabled={!pagination.has_prev}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={`p-2 rounded-xl border transition-all ${
                  !pagination.has_prev 
                    ? 'border-white/5 text-gray-600 cursor-not-allowed' 
                    : 'border-white/10 text-white hover:border-primary/50 hover:text-primary'
                }`}
              >
                {lang === 'ar' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
              
              <span className="text-gray-400">
                {currentPage} / {pagination.total_pages}
              </span>

              <button 
                disabled={!pagination.has_next}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.total_pages))}
                className={`p-2 rounded-xl border transition-all ${
                  !pagination.has_next 
                    ? 'border-white/5 text-gray-600 cursor-not-allowed' 
                    : 'border-white/10 text-white hover:border-primary/50 hover:text-primary'
                }`}
              >
                {lang === 'ar' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default BlogSection;