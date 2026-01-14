import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { GitHubRepo, Project } from "@/types/github";
import { createClient } from "@supabase/supabase-js";

/* ---------------- CONFIG ---------------- */
const GITHUB_USERNAME = "tejathotadev";

/**
 * ⚠️ Move these to .env later
 */
const supabase = createClient(
  "https://hgrznepcjhnxjszybqfw.supabase.co",
  "sb_publishable_dcAhAAWei7fpbut7HGPQSw_mrONVVYj"
);

/**
 * ⚠️ Frontend admin secret (OK for portfolio)
 */
const ADMIN_SECRET = "teja-admin-2026";

/* ---------------- COMPONENT ---------------- */
const ProjectsSection = () => {
  const [manualProjects, setManualProjects] = useState<Project[]>([]);
  const [githubProjects, setGithubProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminInput, setAdminInput] = useState("");


  /* Admin modal state */
  const [showForm, setShowForm] = useState(false);

  /* Form fields */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");

  /* ---------------- CHECK ADMIN SESSION ---------------- */
  useEffect(() => {
    if (sessionStorage.getItem("portfolio-admin") === "true") {
      setIsAdmin(true);
    }
  }, []);

  /* ---------------- FETCH MANUAL PROJECTS (SUPABASE) ---------------- */
  const fetchManualProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      const mapped: Project[] = data.map((p: any) => ({
        title: p.title,
        description: p.description,
        techStack: p.tech_stack || [],
        githubUrl: p.github_url || undefined,
        demoUrl: p.demo_url || undefined,
        isManual: true,
      }));
      setManualProjects(mapped);
    }
  };

  /* ---------------- FETCH GITHUB PROJECTS ---------------- */
  const fetchGithubProjects = async () => {
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
      console.error("GitHub fetch error", e);
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([fetchManualProjects(), fetchGithubProjects()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  /* ---------------- ADD PROJECT ---------------- */
  const handleSaveProject = async () => {
    await supabase.from("projects").insert({
      title,
      description,
      tech_stack: skills.split(",").map(s => s.trim()),
      github_url: githubUrl || null,
      demo_url: demoUrl || null,
    });

    await fetchManualProjects();

    setShowForm(false);
    setTitle("");
    setDescription("");
    setSkills("");
    setGithubUrl("");
    setDemoUrl("");
  };

  /* ---------------- DELETE PROJECT ---------------- */
  const handleDeleteProject = async (project: Project) => {
    await supabase.from("projects").delete().eq("title", project.title);
    await fetchManualProjects();
  };

  /* ---------------- LOGOUT ADMIN ---------------- */
  const handleLogout = () => {
    sessionStorage.removeItem("portfolio-admin");
    setIsAdmin(false);
    window.dispatchEvent(new Event("admin-change"));
  };

  /* ---------------- MERGED PROJECTS ---------------- */
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
            GitHub + Supabase-powered private projects
          </p>
        </motion.div>

        {!isAdmin && (
  <div className="flex justify-center mb-8">
    <button
      onClick={() => setShowAdminLogin(true)}
      className="px-5 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition"
    >
      Admin Login
    </button>
  </div>
)}

{showAdminLogin && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-background rounded-xl p-6 w-full max-w-sm">
      <h3 className="text-lg font-semibold mb-4">Admin Login</h3>

      <input
        type="password"
        className="w-full mb-4 p-2 rounded border bg-background text-foreground"
        placeholder="Enter admin secret"
        value={adminInput}
        onChange={e => setAdminInput(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={() => {
            setShowAdminLogin(false);
            setAdminInput("");
          }}
          className="flex-1 border rounded py-2"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            if (adminInput === ADMIN_SECRET) {
              sessionStorage.setItem("portfolio-admin", "true");
              setIsAdmin(true);
              window.dispatchEvent(new Event("admin-change"));
              setShowAdminLogin(false);
              setAdminInput("");
            } else {
              alert("Invalid admin secret ❌");
            }
          }}
          className="flex-1 bg-primary text-white rounded py-2"
        >
          Login
        </button>
      </div>
    </div>
  </div>
)}


        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex justify-center gap-4 mb-10">
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition"
            >
              + Add Project
            </button>

            <button
              onClick={handleLogout}
              className="px-6 py-3 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
            >
              Logout Admin
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
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                {...project}
                onDelete={
                  isAdmin && project.isManual
                    ? () => handleDeleteProject(project)
                    : undefined
                }
              />
            ))}
          </div>
        )}

        {/* Admin Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-background rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                Admin – Add Project
              </h3>

              <input
                className="w-full mb-3 p-2 rounded border bg-background text-foreground placeholder:text-muted-foreground"
                placeholder="Project Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />

              <textarea
                className="w-full mb-3 p-2 rounded border bg-background text-foreground placeholder:text-muted-foreground"
                placeholder="Project Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />

              <input
                className="w-full mb-3 p-2 rounded border bg-background text-foreground placeholder:text-muted-foreground"
                placeholder="Skills (React, ML, Supabase...)"
                value={skills}
                onChange={e => setSkills(e.target.value)}
              />

              <input
                className="w-full mb-3 p-2 rounded border bg-background text-foreground placeholder:text-muted-foreground"
                placeholder="GitHub URL (optional)"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
              />

              <input
                className="w-full mb-4 p-2 rounded border bg-background text-foreground placeholder:text-muted-foreground"
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
