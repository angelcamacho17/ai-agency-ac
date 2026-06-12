/**
 * Public facts schema — slugs only. The actual content lives in
 * facts.private.js on the server (gitignored). Client never sees the raw
 * corpus; the server hydrates per template request.
 *
 * This file defines the SHAPE the LLM is allowed to reference. Update
 * the slug lists when you add/remove real case studies or team members
 * in facts.private.js, then redeploy.
 */

export const CASE_STUDY_SLUGS = [
  'terraccotta',
  'amplify',
  'axial',
  'safaera',
  'turismodeplaya',
  'vic',
  'xup',
  'viajes-premiere',
  'ar-studio',
] as const;
export type CaseStudySlug = (typeof CASE_STUDY_SLUGS)[number];

export interface CaseStudyData {
  /** Display name of the client. */
  client: string;
  /** Path to the brand logo (in public/brands/). */
  logo: string;
  /** 1–2 sentences. */
  problem: string;
  /** 1–2 sentences. */
  solution: string;
  /** Tech badges (3–6 items). */
  stack: string[];
  /** 3 measurable outcomes. */
  results: string[];
  /** Duration label, e.g. "5 días" / "5 days". */
  duration: string;
  /** Language this card is authored in. */
  lang: 'es' | 'en';
}

export interface TeamMember {
  /** Display name. */
  name: string;
  /** Short role (max ~30 chars). */
  role: string;
  /** 1 line bio. */
  bio: string;
  /** Optional avatar URL. If absent, render initials. */
  img?: string;
  /** Language this entry is authored in. */
  lang: 'es' | 'en';
}

export const TEMPLATE_KINDS = ['case-study', 'team-grid'] as const;
export type TemplateKind = (typeof TEMPLATE_KINDS)[number];

/** Server payload after hydration. The data field is union-typed by kind. */
export type TemplatePayload =
  | { kind: 'case-study'; ref: CaseStudySlug; data: CaseStudyData; langFallback?: boolean }
  | { kind: 'team-grid'; data: TeamMember[]; langFallback?: boolean };
