import React from 'react';
import { Star, GitFork, Code } from 'lucide-react';
import { Repository } from '../types';
import Card from './Card';

interface RepositoryCardProps {
  repository: Repository;
  isSelected: boolean;
  onToggle: () => void;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository, isSelected, onToggle }) => {
  return (
    <Card 
      className={`border ${isSelected ? 'border-blue-500' : 'border-gray-700'}`}
      hoverable
      onClick={onToggle}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-white">{repository.name}</h3>
          <div className="flex items-center space-x-1">
            <input 
              type="checkbox" 
              checked={isSelected}
              onChange={onToggle}
              className="h-4 w-4 text-blue-500 rounded focus:ring-blue-500 bg-gray-700 border-gray-600"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        
        <p className="text-gray-400 mt-2 text-sm line-clamp-2">
          {repository.description || 'No description provided'}
        </p>
        
        <div className="flex items-center mt-4 space-x-4 text-sm">
          {repository.language && (
            <div className="flex items-center space-x-1">
              <Code className="h-4 w-4 text-gray-400" />
              <span>{repository.language}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{repository.stargazers_count}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <GitFork className="h-4 w-4 text-gray-400" />
            <span>{repository.forks_count}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RepositoryCard;