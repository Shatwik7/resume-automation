import React, { useState } from 'react';
import { Download, Clock, CheckCircle, AlertCircle, MoreVertical, Copy, Trash } from 'lucide-react';
import { Resume } from '../types';
import Card from './Card';
import Button from './Button';
import { motion } from 'framer-motion';

interface ResumeCardProps {
  resume: Resume;
  onDelete?: (id: string) => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const getStatusIcon = () => {
    switch (resume.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (resume.status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Processing';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleShare = () => {
    if (resume.url) {
      navigator.clipboard.writeText(resume.url);
      alert('Resume link copied to clipboard!');
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(resume._id);
    }
  };

  return (
    <Card className="bg-gray-800 border border-gray-700 relative">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Resume #{resume._id.substring(0, 8)}</h3>
            <p className="text-gray-400 text-sm">Created on {formatDate(resume.createdAt)}</p>
          </div>

          {/* Three-dot menu */}
          <div className="relative">
            <button
              className="text-gray-400 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-700 rounded-lg shadow-lg">
                <button
                  onClick={handleShare}
                  className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-600 w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Share
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-600 w-full"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-700">
          {getStatusIcon()}
          <span className="text-sm text-white">{getStatusText()}</span>
        </div>

        <div className="mb-4 mt-4">
          <h4 className="text-gray-300 font-medium mb-2">Selected Repositories:</h4>
          <div className="space-y-1">
            {resume.selected_repo.map((repo, index) => (
              <motion.div 
                key={index}
                className="bg-gray-700 px-3 py-1 rounded text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {repo}
              </motion.div>
            ))}
          </div>
        </div>

        {resume.status === 'completed' && resume.url && (
          <Button 
            variant="primary" 
            fullWidth 
            className="mt-2"
            onClick={() => window.open(resume.url, '_blank')}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Resume
          </Button>
        )}

        {resume.status === 'pending' && (
          <div className="flex items-center justify-center mt-4">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
              <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
              <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ResumeCard;
