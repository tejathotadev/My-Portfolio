import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import profileImage from "@/assets/teja-profile.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Passionate learner exploring AI, data science, and modern web technologies to build innovative solutions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-glow rounded-full blur-xl opacity-50 animate-pulse-glow" />
              <img
                src={profileImage}
                alt="Teja Thota"
                className="relative w-80 h-80 rounded-full border-4 border-primary/30 shadow-hero object-cover object-[100%_10%]"
              />
            </div>
          </motion.div>

          {/* About Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card className="glass-card p-6 hover:border-primary/30 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3 text-primary">The Journey</h3>
              <p className="text-muted-foreground leading-relaxed">
                Currently pursuing my BTech in Computer Science Engineering, 
                I am immersed in learning Data Science and AI/ML. 
                What began as curiosity about how technology can solve real-world problems 
                has grown into a passion for learning and building innovative, data-driven solutions.
              </p>
            </Card>

            <Card className="glass-card p-6 hover:border-primary/30 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3 text-primary">Future Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
               My vision is to grow into a skilled data science and AI professional, building intelligent systems 
               that turn data into meaningful insights and real-world solutions.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;