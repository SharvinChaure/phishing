"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { scanUrlAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { ResultCard } from "@/components/ResultCard";
import { Loader2, Search } from "lucide-react";
import type { ScorePhishOutput } from "@/ai/flows/score-phish";

const initialState = {
  success: false,
  error: null,
  result: null,
};

type ResultState = {
  submittedUrl: string;
} & ScorePhishOutput

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto animate-pulse-glow" size="lg">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
      Scan Now
    </Button>
  );
}

export default function PhishXPage() {
  const [state, formAction] = useActionState(scanUrlAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.success === false && state.error) {
      toast({
        variant: "destructive",
        title: "Scan Error",
        description: state.error,
      });
    }
  }, [state, toast]);
  
  const result = state.result as ResultState | null;

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <Logo />

        <form action={formAction} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-2">
                <Input
                    name="url"
                    type="url"
                    placeholder="https://example.com/check-this-link"
                    required
                    className="flex-grow text-base md:text-lg p-3 md:p-6 border-primary/50 focus:border-primary focus:ring-primary"
                />
                <SubmitButton />
            </div>
        </form>

        {useFormStatus().pending && (
          <div className="flex flex-col items-center justify-center gap-4 text-center text-primary pt-8">
            <Loader2 className="h-12 w-12 animate-spin" />
            <p className="font-semibold text-lg">Analyzing URL...</p>
            <p className="text-muted-foreground">Combining threat intel and AI reasoning to hunt for hooks.</p>
          </div>
        )}
        
        {state.success && result && (
            <div className="animate-in fade-in-50 duration-500 pt-8">
              <ResultCard result={result} url={result.submittedUrl} />
            </div>
        )}
      </div>
       <footer className="py-8 text-center text-muted-foreground text-sm">
        Built for the Hackathon with Firebase & Genkit.
      </footer>
    </main>
  );
}
