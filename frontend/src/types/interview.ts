export type Priority = 'high' | 'medium' | 'low';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type TopicStatus = 'high-attempt' | 'knowledge-gap' | 'strong';

export interface Candidate {
  id: string;
  name: string;
  role: string;
  yearsExperience: number;
  education: string;
  avatarInitials: string;
}

export interface LearningTopic {
  id: string;
  name: string;
  status: TopicStatus;
  attempts: number;
  /** Whether the candidate skipped this topic entirely. */
  skipped?: boolean;
  /** Short descriptor shown under the topic name. */
  detail?: string;
}

export interface LearningIntelligence {
  highPriority: LearningTopic[];
  knowledgeGaps: LearningTopic[];
  strongFoundations: LearningTopic[];
}

export type QuestionFormat = 'open' | 'follow-up';

export interface InterviewQuestion {
  id: string;
  index: number;
  topicId: string;
  topicName: string;
  priority: Priority;
  difficulty: Difficulty;
  title: string;
  prompt: string;
  format: QuestionFormat;
  /** Reasoning surfaced by the adaptive engine for allocating this question. */
  reason: string;
  /** Whether this question is a deeper follow-up probe. */
  isFollowUp: boolean;
}

export interface InterviewIntelligencePanel {
  currentTopic: string;
  priority: Priority;
  questionsAllocated: number;
  questionsCompleted: number;
  reason: string;
}

export type InterviewPhase =
  | 'awaiting-answer'
  | 'analyzing'
  | 'follow-up-selected'
  | 'complete';

export interface InterviewState {
  totalQuestions: number;
  currentIndex: number;
  phase: InterviewPhase;
  questions: InterviewQuestion[];
  intelligence: InterviewIntelligencePanel;
}

export type ScoreCategory =
  | 'technical'
  | 'reasoning'
  | 'practical'
  | 'communication';

export interface ScoreBreakdown {
  category: ScoreCategory;
  label: string;
  score: number;
  max: number;
  description: string;
}

export interface TopicHistoryEntry {
  id: string;
  name: string;
  previousAttempts: number;
  skipped: boolean;
  interviewQuestions: number;
  priority: Priority;
}

export interface AssessmentResult {
  overallScore: number;
  maxScore: number;
  recommendation: string;
  recommendationTone: 'positive' | 'balanced' | 'cautionary';
  scoreBreakdown: ScoreBreakdown[];
  strengths: string[];
  knowledgeGaps: string[];
  topicsProbed: string[];
  topicHistory: TopicHistoryEntry[];
}

export type AppView = 'dashboard' | 'interview' | 'assessment';
