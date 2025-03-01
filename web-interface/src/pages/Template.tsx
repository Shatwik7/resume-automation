import React, { useEffect, useState } from 'react';
import { fetchTemplates } from '../services/api';
import TemplateCard from '../components/TemplateCard';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { Plus, Pencil } from 'lucide-react';
import { Template } from '../types';

const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-800 rounded-lg p-4 shadow-lg">
    <div className="h-40 bg-gray-700 rounded-md mb-4"></div>
    <div className="h-6 bg-gray-700 rounded-md w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-700 rounded-md w-1/2"></div>
  </div>
);

const TemplatePage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getTemplates = async () => {
      try {
        const data = await fetchTemplates();
        setTemplates(data);
      } catch (err) {
        if(err instanceof Error){
            setError('Failed to load templates. Please try again.');
        }
        else{
            setError('Unknown Error');
        }
      } finally {
        setLoading(false);
      }
    };
    getTemplates();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-white mb-4 md:mb-0">Available Templates</h1>
          <div className="flex gap-4">
            <Link to="/templates/create">
              <Button variant="primary">
                <Plus className="h-5 w-5 mr-2" />
                Create Template
              </Button>
            </Link>
            <Link to="/templates/editor">
              <Button variant="secondary">
                <Pencil className="h-5 w-5 mr-2" />
                Edit Template
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading State - Skeleton Effect */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-center text-lg mt-8">{error}</div>
        )}

        {/* Template Grid */}
        {!loading && templates.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard key={template._id} isSelected={false} template={template} onClick={()=>console.log(template._id)} />
            ))}
          </div>
        )}

        {/* No Templates Message */}
        {!loading && templates.length === 0 && (
          <div className="text-gray-400 text-center text-lg mt-8">
            No templates available. Click "Create Template" to add one.
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatePage;
