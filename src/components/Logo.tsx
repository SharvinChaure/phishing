import { cn } from "@/lib/utils";

const ShieldHookIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-16 w-16", className)}
    {...props}
  >
    <defs>
      <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g style={{ filter: "url(#neon-glow)" }} className="text-primary">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M14.5 10.5c0-2.5-1.5-4-3.5-4s-3.5 1.5-3.5 4v2c0 1.5 1 3 2.5 3s2.5-1.5 2.5-3" />
      <path d="m9 14 1 1 2-2" />
    </g>
  </svg>
);


export const Logo = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-center">
      <ShieldHookIcon />
      <div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-glow">
          PhishX
        </h1>
        <p className="text-lg text-muted-foreground">Hook the Hook</p>
      </div>
    </div>
  );
};
