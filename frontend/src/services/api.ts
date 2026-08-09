import type {
  AssessmentResult,
  Candidate,
  InterviewQuestion,
  InterviewState,
  LearningIntelligence,
} from '@/types/interview';

const API_BASE = 'http://127.0.0.1:8000';

export const candidate: Candidate = {
  id: 'CAND-001',
  name: 'Sarah Johnson',
  role: 'Senior Data Engineer',
  yearsExperience: 9,
  education: 'MS Computer Science',
  avatarInitials: 'SJ',
};

let sessionId: string | null = null;

let questionCounter = 0;

function mapQuestion(
  data: {
    day: number;
    topic: string;
    question: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    purpose: 'warmup' | 'depth_probe' | 'gap_check' | 'system_design' | 'capstone';
  },
  isFollowUp = false,
): InterviewQuestion {
  questionCounter += 1;

  const difficulty = data.difficulty;

  const priority =
    data.purpose === 'depth_probe' || data.purpose === 'system_design'
      ? 'high'
      : data.purpose === 'gap_check'
        ? 'medium'
        : 'low';

  return {
    id: `q-${questionCounter}`,
    index: questionCounter,
    topicId: `day-${data.day}`,
    topicName: data.topic,
    priority,
    difficulty,
    title: data.topic,
    prompt: data.question,
    format: isFollowUp ? 'follow-up' : 'open',
    reason:
      data.purpose === 'depth_probe'
        ? 'Adaptive engine selected a deeper technical probe.'
        : data.purpose === 'gap_check'
          ? 'Adaptive engine is checking a knowledge gap.'
          : 'Question selected from the candidate interview strategy.',
    isFollowUp,
  };
}

export async function startInterview(): Promise<InterviewQuestion> {
  questionCounter = 0;

  const response = await fetch(`${API_BASE}/api/interview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId: null,
      candidate,
      message: '',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to start interview: ${response.status} ${errorText}`,
    );
  }

  const data = await response.json();

  sessionId = data.sessionId;

  return mapQuestion({
    day: 0,
    topic: 'Adaptive Interview',
    question: data.message,
    difficulty: 'advanced',
    purpose: 'warmup',
  });
}

export async function submitAnswer(
  answer: string,
  previousQuestion: InterviewQuestion,
): Promise<{
  question: InterviewQuestion | null;
  done: boolean;
  assessment?: AssessmentResult;
}> {
  if (!sessionId) {
    throw new Error('No active interview session.');
  }

  const response = await fetch(`${API_BASE}/api/interview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId,
      message: answer,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to submit answer: ${response.status} ${errorText}`,
    );
  }

  const data = await response.json();

  if (data.done) {
    return {
      question: null,
      done: true,
      assessment: data.assessment
        ? mapAssessment(data.assessment)
        : undefined,
    };
  }

  return {
    question: mapQuestion(
      {
        day: previousQuestion.index + 1,
        topic: previousQuestion.topicName,
        question: data.message,
        difficulty: previousQuestion.difficulty,
        purpose: 'depth_probe',
      },
      true,
    ),
    done: false,
  };
}

function mapAssessment(data: any): AssessmentResult {
  return {
    overallScore: data.overallScore ?? 0,
    maxScore: data.maxScore ?? 10,
    recommendation: data.next ?? '',
    recommendationTone: 'balanced',
    scoreBreakdown: [],
    strengths: data.strengths ?? [],
    knowledgeGaps: data.gaps ?? [],
    topicsProbed: [],
    topicHistory: [],
  };
}

export function getInitialInterviewState(): InterviewState {
  return {
    totalQuestions: 10,
    currentIndex: 0,
    phase: 'awaiting-answer',
    questions: [],
    intelligence: {
      currentTopic: 'Preparing interview...',
      priority: 'high',
      questionsAllocated: 1,
      questionsCompleted: 0,
      reason: 'Generating an adaptive question from learning history.',
    },
  };
}

export const learningIntelligence: LearningIntelligence = {
  highPriority: [
    {
      id: 'topic-prompt',
      name: 'Prompt Engineering Fundamentals',
      status: 'high-attempt',
      attempts: 4,
      detail: 'Multiple attempts suggest an unstable grasp of core concepts.',
    },
    {
      id: 'topic-docker',
      name: 'Docker & Kubernetes Deployment',
      status: 'high-attempt',
      attempts: 3,
      detail: 'Repeated difficulty with orchestration and container lifecycles.',
    },
  ],
  knowledgeGaps: [
    {
      id: 'topic-observability',
      name: 'Monitoring, Logging & Observability',
      status: 'knowledge-gap',
      attempts: 0,
      skipped: true,
      detail: 'Topic was skipped in the learning path — no signal yet.',
    },
  ],
  strongFoundations: [
    {
      id: 'topic-embeddings',
      name: 'Embeddings Explained',
      status: 'strong',
      attempts: 1,
      detail: 'Completed on first attempt.',
    },
    {
      id: 'topic-vector',
      name: 'Vector Databases Overview',
      status: 'strong',
      attempts: 1,
      detail: 'Completed on first attempt.',
    },
    {
      id: 'topic-chatbot',
      name: 'Chatbot Backend & API Integration',
      status: 'strong',
      attempts: 1,
      detail: 'Completed on first attempt.',
    },
  ],
};

export async function getCandidate(): Promise<Candidate> {
  return candidate;
}

export async function getLearningIntelligence(): Promise<LearningIntelligence> {
  return learningIntelligence;
}

export async function getAssessmentResult(): Promise<AssessmentResult> {
  throw new Error(
    'Assessment is now generated by the backend at interview completion.',
  );
}