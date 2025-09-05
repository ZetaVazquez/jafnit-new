import React from 'react';
import { X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsItem } from '@/types';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsItem: NewsItem | null;
}

const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose, newsItem }) => {
  if (!isOpen || !newsItem) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
        >
          <X className="w-4 h-4" />
        </Button>
        
        <div className="relative">
          <img
            src={newsItem.image}
            alt={newsItem.title}
            className="w-full h-64 object-cover rounded-t-lg"
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