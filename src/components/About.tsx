"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  CodeBracketIcon,
  BriefcaseIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const About = () => {
  const t = useTranslations("about");

  const skills = [
    { name: "React/Next.js", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "Python", level: 75 },
    { name: "Firebase", level: 85 },
    { name: "Tailwind CSS", level: 90 },
  ];

  const experience = [
    {
      title: "Senior Full Stack Developer",
      company: "Tech Company",
      period: "2022 - Present",
      description:
        "Led development of multiple web applications using React, Next.js, and Node.js.",
    },
    {
      title: "Full Stack Developer",
      company: "Startup",
      period: "2020 - 2022",
      description:
        "Built and maintained web applications with modern technologies.",
    },
    {
      title: "Frontend Developer",
      company: "Digital Agency",
      period: "2019 - 2020",
      description:
        "Created responsive user interfaces and implemented modern design patterns.",
    },
  ];

  const education = [
    {
      degree: "Master of Computer Science",
      school: "University of Technology",
      period: "2017 - 2019",
      description: "Specialized in software engineering and web technologies.",
    },
    {
      degree: "Bachelor of Computer Science",
      school: "Technical University",
      period: "2013 - 2017",
      description:
        "Focused on programming fundamentals and software development.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">{t("title")}</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              {t("description")}
            </p>

            {/* Skills */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <CodeBracketIcon className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">
                  {t("skills")}
                </h3>
              </div>

              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-blue-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Experience & Education */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Experience */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <BriefcaseIcon className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">
                  {t("experience")}
                </h3>
              </div>

              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-800 p-6 rounded-lg border-l-4 border-blue-500"
                  >
                    <h4 className="text-lg font-semibold text-white mb-1">
                      {exp.title}
                    </h4>
                    <p className="text-blue-400 mb-2">{exp.company}</p>
                    <p className="text-gray-400 text-sm mb-3">{exp.period}</p>
                    <p className="text-gray-300">{exp.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <AcademicCapIcon className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">
                  {t("education")}
                </h3>
              </div>

              <div className="space-y-6">
                {education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-800 p-6 rounded-lg border-l-4 border-purple-500"
                  >
                    <h4 className="text-lg font-semibold text-white mb-1">
                      {edu.degree}
                    </h4>
                    <p className="text-purple-400 mb-2">{edu.school}</p>
                    <p className="text-gray-400 text-sm mb-3">{edu.period}</p>
                    <p className="text-gray-300">{edu.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
