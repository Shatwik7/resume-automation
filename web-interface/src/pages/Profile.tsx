import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phno: '',
    city: '',
    linkdin: '',
    github: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phno: user.phno || '',
        city: user.city || '',
        linkdin: user.linkdin || '',
        github: user.github || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      await updateUser(formData);
      setSuccess('Profile updated successfully');
    } catch (err) {
      console.log(err);
      if(err instanceof Error){
        setError('Failed to update profile. Please try again.');
      }
      else{
        setError(` unknown error!!`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await fetch('http://localhost:3000/api/me', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        logout();
        navigate('/login');
      } catch (err) {
        console.log(err);
        setError('Failed to delete account. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="text-gray-400 mt-1">
            Update your personal information
          </p>
        </div>
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-500 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
              
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled
              />
              
              <Input
                label="Phone Number"
                name="phno"
                type="tel"
                value={formData.phno}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
              
              <Input
                label="City"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
                required
              />
              
              <Input
                label="LinkedIn Profile"
                name="linkdin"
                type="url"
                value={formData.linkdin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                required
              />
              
              <Input
                label="GitHub Profile"
                name="github"
                type="url"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
                required
              />
            </div>
            
            <div className="mt-6">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full md:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
          
          <div className="mt-12 pt-6 border-t border-gray-700">
            <h3 className="text-xl font-medium text-white mb-4">Danger Zone</h3>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;