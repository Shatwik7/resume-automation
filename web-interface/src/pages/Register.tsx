import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ArrowRight, ArrowLeft, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phno: '',
    password: '',
    city: '',
    linkdin: '',
    github: '',
    education: [
      {
        college_name: '',
        major: '',
        starting: '',
        ending: '',
        gpa: 0,
      },
    ],
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target;
  
    if (name in formData.education[0] && index !== undefined) {
      setFormData(prev => {
        const newEducation = [...prev.education];
        newEducation[index] = {
          ...newEducation[index],
          [name]: name === "gpa" ? Number(value) : value,
        };
        return { ...prev, education: newEducation };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { college_name: '', major: '', starting: '', ending: '', gpa: 0 }],
    }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
      if(err instanceof Error){
        setError('Registration failed. Please try again.');
      }
      else{
        setError(` unknown error!!`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <div className="flex justify-center mb-6">
          <UserPlus className="h-12 w-12 text-blue-500" />
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-6">Create an Account</h2>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1 - Basic Info */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 gap-4">
              <Input label="Full Name" name="name" type="text" value={formData.name} onChange={handleChange} required />
              <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              <Input label="Phone Number" name="phno" type="tel" value={formData.phno} onChange={handleChange} required />
              <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
            </motion.div>
          )}

          {/* Step 2 - Social Links & City */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 gap-4">
              <Input label="GitHub Profile" name="github" type="url" value={formData.github} onChange={handleChange} required />
              <Input label="LinkedIn Profile" name="linkdin" type="url" value={formData.linkdin} onChange={handleChange} required />
              <Input label="City" name="city" type="text" value={formData.city} onChange={handleChange} required />
            </motion.div>
          )}

          {/* Step 3 - Education */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 gap-4">
              <h3 className="text-lg font-semibold text-white">Education Details</h3>

              {formData.education.map((edu, index) => (
                <div key={index} className="border border-gray-700 p-4 rounded-lg">
                  <Input label="College Name" name="college_name" type="text" value={edu.college_name} onChange={e => handleChange(e, index)} required />
                  <Input label="Major" name="major" type="text" value={edu.major} onChange={e => handleChange(e, index)} required />
                  <Input label="Starting Year" name="starting" type="number" value={edu.starting} onChange={e => handleChange(e, index)} required />
                  <Input label="Ending Year" name="ending" type="number" value={edu.ending} onChange={e => handleChange(e, index)} required />
                  <Input label="GPA" name="gpa" type="number" step="0.1" value={edu.gpa} onChange={e => handleChange(e, index)} required />
                </div>
              ))}

              {/* Add Education Button */}
              <button type="button" onClick={addEducation} className="flex items-center text-blue-500 mt-2 hover:underline">
                <PlusCircle className="w-5 h-5 mr-2" /> Add Another Education
              </button>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button type="button" variant="secondary" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
            )}

            {step < 3 ? (
              <Button type="button" variant="primary" onClick={handleNext}>
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Create Account
              </Button>
            )}
          </div>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
