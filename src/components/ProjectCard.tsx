import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  ExternalLink,
  Lock,
  Trash2,
  ShieldCheck,
} from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  delay?: number;
  onDelete?: () => void; // passed ONLY when admin + manual project
}

const ProjectCard = ({
  title,
  description,
  techStack,
  githubUrl,
  demoUrl,
  image,
  delay = 0,
  onDelete,
}: ProjectCardProps) => {
  const isPrivate = !githubUrl;
  const isAdminProject = Boolean(onDelete);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="h-full"
    >
      <Card className="glass-card p-6 h-full flex flex-col transition-all duration-300 group hover:border-primary/50 hover:shadow-glow">

        {/* Project Image */}
        {image && (
          <div className="w-full h-48 rounded-lg mb-4 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Title + Badges */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>

          <div className="flex gap-2">
            {isAdminProject && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/30"
              >
                <ShieldCheck className="w-3 h-3" />
                Admin
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-4 flex-grow leading-relaxed">
          {description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {techStack.map((tech, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              {tech}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          {githubUrl && (
            <Button
              variant="glass"
              size="sm"
              className="flex-1"
              onClick={() => window.open(githubUrl, "_blank")}
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          )}

          {demoUrl && (
            <Button
              variant="cyber"
              size="sm"
              className="flex-1"
              onClick={() => window.open(demoUrl, "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Project Post
            </Button>
          )}

          {/* Admin-only Delete */}
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>

      </Card>
    </motion.div>
  );
};

export default ProjectCard;
