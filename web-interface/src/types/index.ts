export interface User {
  _id?: string;
  name: string;
  email: string;
  phno: string;
  city: string;
  linkdin: string;
  github: string;
  education: {  
    college_name: string;
    major: string;
    starting: string;
    ending: string;
    gpa: number;
  }[]
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface Template {
  _id: string;
  title: string;
  image_url: string;
}

export interface Repository {
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
}

export interface Resume {
  _id: string;
  user: string;
  status: 'pending' | 'completed' | 'failed';
  selected_repo: string[];
  template: string;
  createdAt: string;
  updatedAt: string;
  url?: string;
}