import React, { useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { deleteResume, fetchResumes } from '../services/api';
import { Resume } from '../types';
import Button from '../components/Button';
import ResumeCard from '../components/ResumeCard';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadResumes = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchResumes();
      setResumes(data);
    } catch (err) {
      console.log(err);
      setError('Failed to load resumes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handelDeleteResume =async (resume_id:string)=>{
    try{
      await deleteResume({resume_id:resume_id});
      setResumes(resumes.filter((resume) => resume._id !== resume_id));
    }
    catch(err){
      console.error(err);
      setError("Unable to Delete !!");
    }
  }
  useEffect(() => {
    loadResumes();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Welcome back, {user?.name || 'User'}
            </p>
          </div>
          
          <div className="flex space-x-4">
            <Button
              variant="secondary"
              onClick={loadResumes}
              isLoading={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Link to="/create-resume">
              <Button variant="primary">
                <Plus className="h-4 w-4 mr-2" />
                New Resume
              </Button>
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : resumes.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {resumes.map((resume) => (
              <motion.div key={resume._id} variants={item}>
                <ResumeCard resume={resume} onDelete={()=>handelDeleteResume(resume._id)}/>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium text-white mb-2">No resumes yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first resume to get started
            </p>
            <Link to="/create-resume">
              <Button variant="primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Resume
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;