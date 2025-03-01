import React from 'react';
import { Template } from '../types';
import Card from './Card';

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isSelected, onClick }) => {
  return (
    <Card 
      hoverable 
      onClick={onClick} 
      className={`relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="aspect-w-16 aspect-h-9 w-full">
        <img 
          src={template.image_url} 
          alt={template.title} 
          className="w-full h-38 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-white">{template.title}</h3>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
          ✓
        </div>
      )}
    </Card>
  );
};

export default TemplateCard;