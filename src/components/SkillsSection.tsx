import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Lock, Bot } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

/* ---------------- SUPABASE ---------------- */
const supabase = createClient(
  "https://hgrznepcjhnxjszybqfw.supabase.co",
  "sb_publishable_dcAhAAWei7fpbut7HGPQSw_mrONVVYj"
);

/* ---------------- TYPES ---------------- */
interface SkillCategory {
  title: string;
  skills: string[];
  description?: string;
  isManual?: boolean;
}

/* ---------------- COMPONENT ---------------- */
const SkillsSection = () => {
  /* ---------- ADMIN STATE (SYNCED) ---------- */
const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  const syncAdmin = () => {
    setIsAdmin(sessionStorage.getItem("portfolio-admin") === "true");
  };

  // initial check
  syncAdmin();

  // listen for custom admin changes
  window.addEventListener("admin-change", syncAdmin);

  // OPTIONAL: keep storage listener for other tabs
  window.addEventListener("storage", syncAdmin);

  return () => {
    window.removeEventListener("admin-change", syncAdmin);
    window.removeEventListener("storage", syncAdmin);
  };
}, []);


  /* ---------- SUPABASE DATA ---------- */
  const [extraSkills, setExtraSkills] = useState<Record<string, string[]>>({});
  const [manualCategories, setManualCategories] = useState<SkillCategory[]>([]);

  /* ---------- MODALS ---------- */
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);

  /* ---------- FORMS ---------- */
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");
  const [categorySkills, setCategorySkills] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSkill, setNewSkill] = useState("");

  /* ---------- STATIC CATEGORIES (UNCHANGED) ---------- */
  const staticCategories: SkillCategory[] = [
    {
      title: "Web Development",
      skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "TypeScript"],
      description:
        "Building modern, scalable web applications with the MERN stack",
    },
    {
      title: "AI / ML / DL",
      skills: ["Python", "TensorFlow", "PyTorch", "CNN", "Deep Learning"],
      description: "Creating intelligent systems using machine learning",
    },
    {
      title: "Backend & APIs",
      skills: ["REST APIs", "JWT", "Authentication", "Database Design"],
      description: "Developing secure backend systems",
    },
    {
      title: "Programming",
      skills: ["Java", "Python", "C", "Data Structures", "Algorithms"],
      description: "Strong computer science fundamentals",
    },
  ];

  /* ---------- FETCH SKILLS ---------- */
  const fetchSkills = async () => {
    const { data } = await supabase.from("skills").select("*");
    if (!data) return;

    const extras: Record<string, string[]> = {};
    const manuals: SkillCategory[] = [];

    data.forEach((row: any) => {
      const isStatic = staticCategories.some(c => c.title === row.title);

      if (isStatic) {
        extras[row.title] = row.skills || [];
      } else {
        manuals.push({
          title: row.title,
          description: row.description,
          skills: row.skills || [],
          isManual: true,
        });
      }
    });

    setExtraSkills(extras);
    setManualCategories(manuals);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  /* ---------- ADD CATEGORY (ADMIN ONLY) ---------- */
  const handleAddCategory = async () => {
    if (!isAdmin) {
      alert("Admin access required ❌");
      return;
    }

    if (!categoryTitle || !categorySkills) return;

    await supabase.from("skills").insert({
      title: categoryTitle,
      description: categoryDesc,
      skills: categorySkills.split(",").map(s => s.trim()),
    });

    await fetchSkills();
    setShowAddCategory(false);
    setCategoryTitle("");
    setCategoryDesc("");
    setCategorySkills("");
  };

  /* ---------- ADD SKILL (ADMIN ONLY) ---------- */
  const handleAddSkill = async () => {
    if (!isAdmin) {
      alert("Admin access required ❌");
      return;
    }

    if (!selectedCategory || !newSkill) return;

    const existing = extraSkills[selectedCategory] || [];

    await supabase.from("skills").upsert({
      title: selectedCategory,
      skills: [...existing, newSkill],
    });

    await fetchSkills();
    setShowAddSkill(false);
    setNewSkill("");
  };

  /* ---------- MERGED CATEGORIES ---------- */
  const allCategories: SkillCategory[] = [
    ...staticCategories.map(cat => ({
      ...cat,
      skills: [...cat.skills, ...(extraSkills[cat.title] || [])],
    })),
    ...manualCategories,
  ];

  return (
    <section id="skills" className="py-20 px-4">
      <div className="container mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Core skills + admin-managed extensions
          </p>
        </motion.div>

        {/* Admin Add Category */}
        {isAdmin && (
          <div className="flex justify-center mb-10">
            <button
              onClick={() => setShowAddCategory(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              Add Skill Category
            </button>
          </div>
        )}

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {allCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card p-6 h-full hover:border-primary/50 transition">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{category.title}</h3>
                  {category.isManual && (
                    <Lock className="w-4 h-4 text-primary" />
                  )}
                </div>

                {category.description && (
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-primary/10 text-primary border border-primary/20"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                {isAdmin && (
                  <button
                    onClick={() => {
                      setSelectedCategory(category.title);
                      setShowAddSkill(true);
                    }}
                    className="mt-4 text-sm text-primary underline"
                  >
                    + Add skill
                  </button>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Learning Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Card className="glass-card p-6 max-w-2xl mx-auto">
            <Bot className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Continuous Learning</h3>
            <p className="text-muted-foreground text-sm">
              Always exploring and expanding skills with evolving technologies.
            </p>
          </Card>
        </motion.div>

        {/* Modals */}
        {showAddCategory && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-background rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                Admin – Add Skill Category
              </h3>

              <input
                className="w-full mb-3 p-2 rounded border bg-background text-foreground"
                placeholder="Category Title"
                value={categoryTitle}
                onChange={e => setCategoryTitle(e.target.value)}
              />

              <textarea
                className="w-full mb-3 p-2 rounded border bg-background text-foreground"
                placeholder="Description (optional)"
                value={categoryDesc}
                onChange={e => setCategoryDesc(e.target.value)}
              />

              <input
                className="w-full mb-4 p-2 rounded border bg-background text-foreground"
                placeholder="Skills (comma separated)"
                value={categorySkills}
                onChange={e => setCategorySkills(e.target.value)}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddCategory(false)}
                  className="flex-1 border rounded py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="flex-1 bg-primary text-white rounded py-2"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddSkill && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-background rounded-xl p-6 w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-3">
                Add skill to {selectedCategory}
              </h3>

              <input
                className="w-full mb-4 p-2 rounded border bg-background text-foreground"
                placeholder="Skill name"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddSkill(false)}
                  className="flex-1 border rounded py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSkill}
                  className="flex-1 bg-primary text-white rounded py-2"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default SkillsSection;
