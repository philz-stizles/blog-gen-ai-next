import Image from "next/image";
import Button from "../components/ui/Button";
import Logo from "../components/ui/Logo";
import HeroImage from "./../public/hero.webp";

export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center items-center overflow-hidden relative">
      <Image className="absolute" src={HeroImage} fill alt="Hero" />
      <div className="z-10 max-w-screen-sm relative bg-slate-900/90 text-white text-center px-10 py-5 rounded-md backdrop-blur-sm">
        <Logo />
        <p className="mb-6">
          The AI-powered SAAS solution to generate SEO-optimized blog posts in
          minutes. Get high-quality content, without sacrificing your time.
        </p>
        <Button className="bg-green-500 hover:bg-green-600 text-white" href="/posts/new">
          Begin
        </Button>
      </div>
    </div>
  );
}
