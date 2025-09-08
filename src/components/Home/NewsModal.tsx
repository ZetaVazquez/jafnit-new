import React, { useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsItem } from '@/types';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsItem: NewsItem | null;
}

const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose, newsItem }) => {
  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup al desmontar o cambiar estado
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !newsItem) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[10000]">
        {/* Header sticky con la cruz */}
        <div className="sticky top-0 bg-white rounded-t-lg z-[10001] flex justify-end p-4 border-b border-gray-100">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="bg-white hover:bg-gray-100 shadow-sm border"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="relative -mt-4">
          <img
            src={newsItem.image}
            alt={newsItem.title}
            className="w-full max-h-[70vh] object-contain bg-gray-50"
            loading="eager"
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(newsItem.date).toLocaleDateString('es-ES')}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {newsItem.title}
          </h2>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {newsItem.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;