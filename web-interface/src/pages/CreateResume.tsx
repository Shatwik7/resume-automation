import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchGithubRepositories, fetchTemplates, createResume } from '../services/api';
import { Repository, Template } from '../types';
import Button from '../components/Button';
import RepositoryCard from '../components/RepositoryCard';
import TemplateCard from '../components/TemplateCard';

const CreateResume: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRepositories = async () => {
      if (!user?.github) return;
      
      setIsLoading(true);
      try {
        // Extract username from GitHub URL
        const githubUrl = user.github;
        const username = githubUrl.split('/').pop();
        
        if (!username) {
          setError('Invalid GitHub profile URL');
          return;
        }
        
        const repos = await fetchGithubRepositories(username);
        setRepositories(repos);
      } catch (err) {
        console.error(err);
        setError('Failed to load GitHub repositories');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRepositories();
  }, [user]);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTemplates();
        setTemplates(data);
        if (data.length > 0) {
          setSelectedTemplate(data[0]._id);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load resume templates');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (step === 2) {
      loadTemplates();
    }
  }, [step]);

  const toggleRepository = (repoName: string) => {
    setSelectedRepos(prev => 
      prev.includes(repoName)
        ? prev.filter(name => name !== repoName)
        : [...prev, repoName]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedRepos.length === 0) {
      setError('Please select at least one repository');
      return;
    }
    
    setStep(prev => prev + 1);
    setError('');
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (selectedRepos.length === 0) {
      setError('Please select at least one repository');
      return;
    }
    
    if (!selectedTemplate) {
      setError('Please select a template');
      return;
    }
    
    setIsLoading(true);
    try {
      await createResume({
        selected_repo: selectedRepos,
        template_id: selectedTemplate,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to create resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Select GitHub Repositories</h2>
              <p className="text-gray-400">
                Choose the repositories you want to include in your resume
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : repositories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {repositories.map((repo) => (
                  <RepositoryCard
                    key={repo.name}
                    repository={repo}
                    isSelected={selectedRepos.includes(repo.name)}
                    onToggle={() => toggleRepository(repo.name)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center mb-6">
                <Github className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No repositories found</h3>
                <p className="text-gray-400">
                  Make sure your GitHub profile is correctly set up
                </p>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={selectedRepos.length === 0}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Choose a Template</h2>
              <p className="text-gray-400">
                Select a template for your resume
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : templates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {templates.map((template) => (
                  <TemplateCard
                    key={template._id}
                    template={template}
                    isSelected={selectedTemplate === template._id}
                    onClick={() => setSelectedTemplate(template._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center mb-6">
                <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No templates available</h3>
                <p className="text-gray-400">
                  Please try again later
                </p>
              </div>
            )}
            
            <div className="flex justify-between">
              <Button variant="secondary" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button
                variant="primary"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={!selectedTemplate}
              >
                Create Resume
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Create New Resume</h1>
          <div className="flex items-center mt-6">
            <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step === 1 ? 'bg-blue-500' : 'bg-gray-700'}`}>
              1
            </div>
            <div className={`h-1 w-24 ${step === 1 ? 'bg-gray-700' : 'bg-blue-500'}`}></div>
            <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step === 2 ? 'bg-blue-500' : 'bg-gray-700'}`}>
              2
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-gray-800 rounded-lg p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CreateResume;