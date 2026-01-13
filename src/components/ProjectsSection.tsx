import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { Project, GitHubRepo } from "@/types/github";

const GITHUB_USERNAME = "tejathotadev";
const ADMIN_SECRET = "teja-admin-2026"; // 🔐 change this before deploy

const ProjectsSection = () => {
  const [manualProjects, setManualProjects] = useState<Project[]>([]);
  const [githubProjects, setGithubProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // modal + form state
  const [showForm, setShowForm] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");

  /* ---------------- CHECK ADMIN MODE ---------------- */
  useEffect(() => {
    if (localStorage.getItem("portfolio-admin") === "true") {
      setIsAdmin(true);
    }
  }, []);

  /* ---------------- LOAD + MIGRATE MANUAL PROJECTS ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem("manual-projects");

    if (saved) {
      const parsed: Project[] = JSON.parse(saved);
      const migrated = parsed.map(p => ({ ...p, isManual: true }));
      setManualProjects(migrated);
      localStorage.setItem("manual-projects", JSON.stringify(migrated));
    }
  }, []);

  /* ---------------- FETCH GITHUB PROJECTS ---------------- */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos`
        );
        const data = await res.json();

        const mapped: Project[] = (data as GitHubRepo[])
          .filter(repo => !repo.fork)
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          )
          .map(repo => ({
            title: repo.name.replace(/-/g, " "),
            description: repo.description || "No description provided.",
            techStack: repo.topics || [],
            githubUrl: repo.html_url,
            demoUrl: repo.homepage || undefined,
            isManual: false,
          }));

        setGithubProjects(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  /* ---------------- SAVE MANUAL PROJECT (ADMIN ONLY) ---------------- */
  const handleSaveProject = () => {
    if (adminCode !== ADMIN_SECRET) {
      alert("Invalid admin secret ❌");
      return;
    }

    const newProject: Project = {
      title,
      description,
      techStack: skills.split(",").map(s => s.trim()),
      githubUrl: githubUrl || undefined,
      demoUrl: demoUrl || undefined,
      isManual: true,
    };

    const updated = [newProject, ...manualProjects];
    setManualProjects(updated);
    localStorage.setItem("manual-projects", JSON.stringify(updated));

    localStorage.setItem("portfolio-admin", "true");
    setIsAdmin(true);

    // reset
    setShowForm(false);
    setAdminCode("");
    setTitle("");
    setDescription("");
    setSkills("");
    setGithubUrl("");
    setDemoUrl("");
  };

  /* ---------------- DELETE MANUAL PROJECT ---------------- */
  const handleDeleteProject = (index: number) => {
    const updated = manualProjects.filter((_, i) => i !== index);
    setManualProjects(updated);
    localStorage.setItem("manual-projects", JSON.stringify(updated));
  };

  /* ---------------- DERIVED PROJECTS ---------------- */
  const projects: Project[] = [...manualProjects, ...githubProjects];

  return (
    <section id="projects" className="py-20 px-4">
      <div className="container mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            GitHub + Manually added private projects
          </p>
        </motion.div>

        {/* Add Project Button (ADMIN ONLY) */}
        {isAdmin && (
          <div className="flex justify-center mb-10">
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition"
            >
              + Add Project
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <p className="text-center text-muted-foreground">
            Loading projects...
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {projects.map((project, index) => {
              const manualIndex = project.isManual
                ? manualProjects.findIndex(p => p === project)
                : -1;

              return (
                <ProjectCard
                  key={index}
                  {...project}
                  onDelete={
                    isAdmin && project.isManual
                      ? () => handleDeleteProject(manualIndex)
                      : undefined
                  }
                />
              );
            })}
          </div>
        )}

        {/* Add Project Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-background rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Admin – Add Project
              </h3>

              <input
                className="w-full mb-3 p-2 rounded border bg-background text-foreground"
                placeholder="Admin Secret"
                type="password"
                value={adminCode}
                onChange={e => setAdminCode(e.target.value)}
              />

              <input
                className="w-full mb-3 p-2 rounded border bg-background text-foreground"
                placeholder="Project Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />

              <textarea
                className="w-full mb-3 p-2 rounded border bg-background text-foreground"
                placeholder="Project Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />

              <input
                className="w-full mb-3 p-2 rounded border bg-background text-foreground"
                placeholder="Skills (React, Node, ML...)"
                value={skills}
                onChange={e => setSkills(e.target.value)}
              />

              <input
                className="w-full mb-3 p-2 rounded border bg-background text-foreground"
                placeholder="GitHub URL (optional)"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
              />

              <input
                className="w-full mb-4 p-2 rounded border bg-background text-foreground"
                placeholder="Demo URL (optional)"
                value={demoUrl}
                onChange={e => setDemoUrl(e.target.value)}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 border rounded py-2"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveProject}
                  className="flex-1 bg-primary text-white rounded py-2"
                >
                  Save (Admin)
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default ProjectsSection;
