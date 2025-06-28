import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Blog from "@/components/Blog";

export function generateStaticParams() {
  return [
    { locale: "uz" },
    { locale: "en" },
    { locale: "ru" },
    { locale: "ja" },
  ];
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <Blog />
      <Contact />
    </main>
  );
}
