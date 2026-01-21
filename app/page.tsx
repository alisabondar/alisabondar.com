import Image from "next/image";
import AnimatedBackground from "./components/AnimatedBackground";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center font-sans">
      <AnimatedBackground />
    </div>
  );
}
