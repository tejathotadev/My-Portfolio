// GitHub API repo response
export type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  fork: boolean;
  updated_at: string;
};

// Portfolio project type
export type Project = {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  isManual?: boolean; // 👈 add this
};
