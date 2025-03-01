import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { createTemplate } from '../services/api';

const TemplateCreate: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [filename, setFilename] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (!e.target.files[0].name.endsWith('.ejs')) {
        setError('Only .ejs files are allowed');
        return;
      }
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileType = e.target.files[0].type;
      if (fileType !== 'image/png' && fileType !== 'image/jpeg') {
        setError('Only PNG or JPEG images are allowed');
        return;
      }
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
  
    if (!uploadedFile) {
      setError('Please upload an .ejs file.');
      setIsLoading(false);
      return;
    }
  
    if (!imageFile) {
      setError('Please upload an image file (PNG or JPEG).');
      setIsLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file_name', filename);
    formData.append('ejsFile', uploadedFile, uploadedFile.name);
    formData.append('imageFile', imageFile, imageFile.name);
  
    // Debugging: Check form data before sending
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    try {
      await createTemplate(formData);
      setSuccess('Template uploaded successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload template. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-white mb-4">Upload Template</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <Input 
            label="Upload File (.ejs)" 
            type="file" 
            accept=".ejs"
            onChange={handleFileChange} 
          />

          <Input 
            label="Upload Image (PNG or JPEG)" 
            type="file" 
            accept="image/png, image/jpeg"
            onChange={handleImageChange} 
          />

          <Input 
            label="Title" 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required
          />
          
          <Input 
            label="Filename" 
            type="text" 
            value={filename} 
            onChange={(e) => setFilename(e.target.value)} 
            required
          />
          
          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full mt-4">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TemplateCreate;
