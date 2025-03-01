import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// GitHub API service
export const fetchGithubRepositories = async (username: string) => {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}/repos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    throw error;
  }
};

// Templates service
export const fetchTemplates = async () => {
  try {
    const response = await api.get('/api/templates');
    return response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

// Resume service
export const createResume = async (data: { selected_repo: string[], template_id: string }) => {
  try {
    const response = await api.post('/api/resumes', data);
    return response.data;
  } catch (error) {
    console.error('Error creating resume:', error);
    throw error;
  }
};

export const fetchResumes = async () => {
  try {
    const response = await api.get('/api/resumes');
    return response.data;
  } catch (error) {
    console.error('Error fetching resumes:', error);
    throw error;
  }
};

export const createTemplate = async (data: FormData) => {
  try {
    const response = await axios.post(import.meta.env.VITE_API_URL+'/api/templates', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Axios error:', error);
    throw error;
  }
};


export const deleteResume=async (data :{ resume_id : string })=>{
  try {
    const response = await api.delete('/api/resumes/'+data.resume_id);
    return response.data;
  } catch (error) {
    console.error('Error deleteing resumes:', error);
    throw error;
  }
}