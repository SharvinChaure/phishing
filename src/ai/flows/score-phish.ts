'use server';

/**
 * @fileOverview Implements the AI-powered phishing URL scoring flow.
 *
 * - scorePhish - A function that takes URL features and threat intelligence data to assess phishing risk and provide an explanation.
 * - ScorePhishInput - The input type for the scorePhish function.
 * - ScorePhishOutput - The return type for the scorePhish function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScorePhishInputSchema = z.object({
  url: z.string().describe('The URL to be analyzed.'),
  features: z.object({
    length: z.number().describe('The length of the URL.'),
    has_ip: z.boolean().describe('Whether the URL contains an IP address.'),
    entropy: z.number().describe('The entropy of the URL.'),
    tld: z.string().describe('The top-level domain of the URL.'),
    suspicious_tokens: z.array(z.string()).describe('Suspicious tokens found in the URL.'),
    https: z.boolean().describe('Whether the URL uses HTTPS.'),
    domain_age_days: z.number().describe('The age of the domain in days.'),
  }).describe('Extracted features from the URL.'),
  intel: z.object({
    virustotal: z.any().optional().describe('VirusTotal report for the URL.'),
    phishtank: z.any().optional().describe('PhishTank status for the URL.'),
    abuseipdb: z.any().optional().describe('AbuseIPDB report for the domain/IP.'),
    urlscan: z.any().optional().describe('URLScan.io results for the URL.'),
  }).describe('Threat intelligence data from various providers.'),
});
export type ScorePhishInput = z.infer<typeof ScorePhishInputSchema>;

const ScorePhishOutputSchema = z.object({
  riskScore: z.number().describe('The overall risk score of the URL (0-100).'),
  verdict: z.enum(['SAFE', 'PHISHING']).describe('The verdict of the URL.'),
  top_factors: z.array(z.string()).describe('The top factors contributing to the risk score.'),
  summary: z.string().describe('A concise summary explaining why the URL is potentially phishing.'),
});
export type ScorePhishOutput = z.infer<typeof ScorePhishOutputSchema>;

export async function scorePhish(input: ScorePhishInput): Promise<ScorePhishOutput> {
  return scorePhishFlow(input);
}

const scorePhishPrompt = ai.definePrompt({
  name: 'scorePhishPrompt',
  input: {schema: ScorePhishInputSchema},
  output: {schema: ScorePhishOutputSchema},
  prompt: `You are an expert in identifying phishing URLs. Analyze the provided URL, its features, and threat intelligence data to determine if it is likely to be a phishing attempt.

URL: {{{url}}}

Features:
- Length: {{{features.length}}}
- Has IP Address: {{#if features.has_ip}}Yes{{else}}No{{/if}}
- Entropy: {{{features.entropy}}}
- TLD: {{{features.tld}}}
- Suspicious Tokens: {{#if features.suspicious_tokens}}{{#each features.suspicious_tokens}}- {{{this}}}{{/each}}{{else}}None{{/if}}
- HTTPS: {{#if features.https}}Yes{{else}}No{{/if}}
- Domain Age (days): {{{features.domain_age_days}}}

Threat Intelligence:
- VirusTotal: {{#if intel.virustotal}}Present{{else}}No Data{{/if}}
- PhishTank: {{#if intel.phishtank}}Present{{else}}No Data{{/if}}
- AbuseIPDB: {{#if intel.abuseipdb}}Present{{else}}No Data{{/if}}
- URLScan.io: {{#if intel.urlscan}}Present{{else}}No Data{{/if}}

Based on this information, provide:
1.  A riskScore (0-100) indicating the likelihood of the URL being a phishing attempt.
2.  A verdict (SAFE or PHISHING).
3.  A list of top_factors contributing to the risk score.
4.  A concise summary explaining why the URL is potentially phishing, highlighting the most important factors.

Make sure the response is valid JSON.
`,
});

const scorePhishFlow = ai.defineFlow(
  {
    name: 'scorePhishFlow',
    inputSchema: ScorePhishInputSchema,
    outputSchema: ScorePhishOutputSchema,
  },
  async input => {
    const {output} = await scorePhishPrompt(input);
    return output!;
  }
);
