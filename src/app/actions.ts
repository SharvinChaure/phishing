"use server";

import { z } from "zod";
import { scorePhish, type ScorePhishInput } from "@/ai/flows/score-phish";

const UrlSchema = z.string().url({ message: "Please enter a valid URL." });

export async function scanUrlAction(prevState: any, formData: FormData) {
  const url = formData.get("url");

  const validatedUrl = UrlSchema.safeParse(url);

  if (!validatedUrl.success) {
    return {
      success: false,
      error: validatedUrl.error.errors[0].message,
      result: null,
    };
  }
  
  if (!validatedUrl.data.startsWith('http')) {
     return {
      success: false,
      error: "URL must start with http:// or https://",
      result: null,
    };
  }

  try {
    const features = {
      length: validatedUrl.data.length,
      has_ip: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(new URL(validatedUrl.data).hostname),
      entropy: Math.random() * 5 + 2,
      tld: validatedUrl.data.split('.').pop()?.split('/')[0] || '',
      suspicious_tokens: ['login', 'secure', 'account', 'update', 'confirm'].filter(token => validatedUrl.data.includes(token)),
      https: validatedUrl.data.startsWith('https://'),
      domain_age_days: Math.floor(Math.random() * 3000),
    };

    const intel = {
      virustotal: Math.random() > 0.5 ? { positive_hits: Math.floor(Math.random() * 5) } : null,
      phishtank: Math.random() > 0.8 ? { in_database: true } : null,
      abuseipdb: null,
      urlscan: null,
    };

    const input: ScorePhishInput = {
      url: validatedUrl.data,
      features,
      intel,
    };

    const result = await scorePhish(input);
    
    return {
      success: true,
      error: null,
      result: { ...result, submittedUrl: validatedUrl.data },
    };
  } catch (e: any) {
    console.error("AI flow failed:", e);
    return {
      success: false,
      error: "AI analysis failed. Please check the server logs and try again later.",
      result: null,
    };
  }
}
