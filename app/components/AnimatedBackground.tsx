'use client';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-zinc-900">
      <div className="absolute -left-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-violet-600/20 via-fuchsia-600/20 to-rose-600/20 blur-3xl animate-blob" />
      <div className="absolute -right-1/4 -bottom-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-cyan-600/20 via-blue-600/20 to-indigo-600/20 blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-stone-200/20 via-neutral-200/20 to-zinc-200/20 blur-3xl animate-blob animation-delay-4000" />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}

