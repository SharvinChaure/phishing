import type { ScorePhishOutput } from "@/ai/flows/score-phish";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskMeter } from "./RiskMeter";
import { AlertCircle, CheckCircle, Shield, Siren } from "lucide-react";
import { Separator } from "./ui/separator";

type ResultCardProps = {
  result: ScorePhishOutput;
  url: string;
};

export function ResultCard({ result, url }: ResultCardProps) {
  const { riskScore, verdict, top_factors, summary } = result;
  const isPhishing = verdict === 'PHISHING';

  return (
    <Card className="w-full max-w-2xl border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <Badge variant={isPhishing ? 'destructive' : 'default'} className="text-lg px-4 py-1 shadow-lg">
            {isPhishing ? <AlertCircle className="mr-2 h-5 w-5" /> : <CheckCircle className="mr-2 h-5 w-5" />}
            {verdict}
          </Badge>
        </div>
        <CardTitle className="pt-2 text-xl truncate font-normal text-muted-foreground break-all">{url}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <RiskMeter score={riskScore} />
        
        <div className="w-full text-left space-y-4">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
              <Shield className="h-5 w-5" />
              AI Summary
            </h3>
            <p className="text-muted-foreground mt-1">{summary}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
              <Siren className="h-5 w-5" />
              Top Factors
            </h3>
            <ul className="mt-2 space-y-2 list-inside">
              {top_factors.map((factor, index) => (
                <li key={index} className="flex items-start">
                  <span className={isPhishing ? "text-destructive mr-2 mt-1" : "text-primary mr-2 mt-1"}>
                    <AlertCircle className="h-4 w-4" />
                  </span>
                  <span className="text-muted-foreground">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-2 text-primary">Threat Intel Signals</h3>
            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">VirusTotal</Badge>
                <Badge variant="secondary">PhishTank</Badge>
                <Badge variant="secondary">AbuseIPDB</Badge>
                <Badge variant="secondary">URLScan.io</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
