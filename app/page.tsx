import AnimatedBackground from "./components/AnimatedBackground";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center font-sans">
      <AnimatedBackground />
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Hi, I&apos;m Alisa.
        </h1>
        <p className="text-xl md:text-2xl text-white/80">
          Scroll down to get to know me
        </p>
      </div>
    </div>
  );
}
