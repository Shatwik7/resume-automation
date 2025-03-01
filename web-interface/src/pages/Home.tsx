import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Github, Briefcase, ArrowRight, Code, Award, Users } from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { fetchResumes } from '../services/api';
import { Resume } from '../types';
import ResumeCard from '../components/ResumeCard';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [recentResumes, setRecentResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log(user);
  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Check if elements are in view
  const heroInView = useInView(heroRef, { once: false, amount: 0.2 });
  const featuresInView = useInView(featuresRef, { once: false, amount: 0.2 });
  const showcaseInView = useInView(showcaseRef, { once: false, amount: 0.2 });
  const testimonialsInView = useInView(testimonialsRef, { once: false, amount: 0.2 });
  const ctaInView = useInView(ctaRef, { once: false, amount: 0.2 });
  
  // Scroll animations
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    if (isAuthenticated) {
      const loadRecentResumes = async () => {
        setIsLoading(true);
        try {
          const data = await fetchResumes();
          setRecentResumes(data.slice(0, 3)); // Get only the 3 most recent resumes
        } catch (err) {
          console.error(err);
          console.error('Failed to load recent resumes');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadRecentResumes();
    }
  }, [isAuthenticated]);

  const features = [
    {
      icon: <Github className="h-8 w-8 text-blue-400" />,
      title: 'GitHub Integration',
      description: 'Automatically import your projects from GitHub to showcase your technical skills and contributions.',
    },
    {
      icon: <Briefcase className="h-8 w-8 text-blue-400" />,
      title: 'Professional Templates',
      description: 'Choose from a variety of modern, professional resume templates designed to impress recruiters.',
    },
    {
      icon: <FileText className="h-8 w-8 text-blue-400" />,
      title: 'Instant PDF Generation',
      description: 'Generate polished, ready-to-use PDF resumes with a single click that highlight your best work.',
    },
    {
      icon: <Code className="h-8 w-8 text-blue-400" />,
      title: 'Technical Skills Showcase',
      description: 'Automatically extract and highlight programming languages and technologies from your repositories.',
    },
    {
      icon: <Award className="h-8 w-8 text-blue-400" />,
      title: 'ATS-Friendly Format',
      description: 'Our resumes are optimized to pass through Applicant Tracking Systems with flying colors.',
    },
    {
      icon: <Users className="h-8 w-8 text-blue-400" />,
      title: 'Recruiter Insights',
      description: 'Built with input from tech recruiters to ensure your resume stands out in the hiring process.',
    },
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Software Engineer at Google",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      text: "ResumeForge helped me showcase my GitHub projects in a professional way. I received multiple interview calls within a week!"
    },
    {
      name: "Sarah Chen",
      role: "Full Stack Developer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      text: "The templates are modern and clean. I love how it automatically pulled in my GitHub projects and formatted them beautifully."
    },
    {
      name: "Michael Rodriguez",
      role: "Frontend Engineer at Meta",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      text: "After struggling to create a resume that highlighted my coding skills, ResumeForge made it effortless. Highly recommend!"
    }
  ];

  const resumeShowcaseImages = [
    {
      url: "https://cdn.enhancv.com/predefined-examples/J3V4PtHeJHYSg1beoq1kVI2hUjELaVRbVPGxNjsR/image.png",
      title: "Modern Template"
    },
    {
      url: "https://www.myperfectresume.com/wp-content/uploads/2024/03/aeronautical-engineer-resume-format.svg",
      title: "Professional Template"
    },
    {
      url: "https://cdn.create.microsoft.com/catalog-assets/en-us/dc9c6785-12be-45a3-83ca-cbff94831a1a/thumbnails/616/color-block-resume-blue-modern-color-block-2-1-562e7e0a1744.webp",
      title: "Technical Template"
    },
    {
      url: "https://cdn.create.microsoft.com/catalog-assets/en-us/48add7a7-4073-4dc8-ae9a-08c835b8dabe/thumbnails/616/basic-professional-resume-null-modern-simple-2-1-6eb4a95ebe0d.webp",
      title: "Minimalist Template"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="py-20 px-4 min-h-screen flex items-center" ref={heroRef}>
        <motion.div 
          className="max-w-6xl mx-auto"
          style={{ opacity, scale }}
          animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Build Your Perfect Resume <span className="text-blue-500">in Minutes</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Create professional resumes that highlight your GitHub projects and technical skills with our modern resume builder.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              {isAuthenticated ? (
                <Link to="/create-resume">
                  <Button variant="primary" className="text-lg px-8 py-3">
                    Create Resume
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button variant="primary" className="text-lg px-8 py-3">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-16 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.img 
              src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
              alt="Resume Builder" 
              className="w-full h-auto rounded-lg shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
            
            {/* Floating elements */}
            <motion.div 
              className="absolute -top-10 -right-10 bg-blue-500 p-4 rounded-lg shadow-lg hidden md:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ y: -5 }}
            >
              <Github className="h-8 w-8 text-white" />
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-8 -left-8 bg-gray-800 p-4 rounded-lg shadow-lg hidden md:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              whileHover={{ y: -5 }}
            >
              <FileText className="h-8 w-8 text-blue-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Resume Showcase Section */}
      <section className="py-20 px-4 bg-gray-950" ref={showcaseRef}>
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showcaseInView ? 1 : 0, y: showcaseInView ? 0 : 20 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Beautiful Resume Templates</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose from our collection of professionally designed templates that will make your resume stand out.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resumeShowcaseImages.map((image, index) => (
              <motion.div 
                key={index}
                className="relative group overflow-hidden rounded-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: showcaseInView ? 1 : 0, y: showcaseInView ? 0 : 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <img 
                  src={image.url} 
                  alt={image.title} 
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <h3 className="text-white text-xl font-semibold p-6">{image.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-800" ref={featuresRef}>
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: featuresInView ? 1 : 0, y: featuresInView ? 0 : 20 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose ResumeForge?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform makes it easy to create professional resumes that showcase your technical skills and projects.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-gray-700 p-6 rounded-lg h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: featuresInView ? 1 : 0, y: featuresInView ? 0 : 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="mb-4 bg-gray-800 inline-block p-3 rounded-lg">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gray-900" ref={testimonialsRef}>
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: testimonialsInView ? 1 : 0, y: testimonialsInView ? 0 : 20 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join thousands of professionals who have boosted their careers with our resume builder.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-gray-800 p-6 rounded-lg border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: testimonialsInView ? 1 : 0, y: testimonialsInView ? 0 : 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="text-white font-medium">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Recent Resumes Section (for authenticated users) */}
      {isAuthenticated && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Your Recent Resumes</h2>
              <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 flex items-center">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : recentResumes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentResumes.map((resume) => (
                  <ResumeCard key={resume._id} resume={resume} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium text-white mb-2">No resumes yet</h3>
                <p className="text-gray-400 mb-6">
                  Create your first resume to get started
                </p>
                <Link to="/create-resume">
                  <Button variant="primary">
                    Create Resume
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600" ref={ctaRef}>
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ctaInView ? 1 : 0, y: ctaInView ? 0 : 20 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Create Your Professional Resume?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Join thousands of professionals who have boosted their career with our resume builder.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isAuthenticated ? (
              <Link to="/create-resume">
                <Button variant="secondary" className="text-lg px-8 py-3">
                  Create Resume Now
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button variant="secondary" className="text-lg px-8 py-3">
                  Sign Up for Free
                </Button>
              </Link>
            )}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;