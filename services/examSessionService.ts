import { apiRequest } from './apiClient';

export interface ExamSession {
  id: string;
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  durationMinutes: number;
  status: 'UPCOMING' | 'ONGOING' | 'ENDED' | 'CANCELLED';
  passcode?: string;
}

export interface JoinExamResponse {
  attemptId: string;
  examId: string;
  title: string;
  durationMinutes: number;
  status: string;
  startedAt: string;
  deadlineAt: string;
  serverTime: string;
  remainingSeconds: number;
}

export function getExamSessions({ status, keyword, page = 0, size = 10 }: { status?: string; keyword?: string; page?: number; size?: number } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (status) params.set('status', status);
  if (keyword) params.set('keyword', keyword);
  return apiRequest<{ items: ExamSession[]; totalItems: number }>(`/exam-sessions?${params}`);
}

export function joinExamSession({ examId, passcode }: { examId: string; passcode: string }): Promise<JoinExamResponse> {
  return apiRequest<JoinExamResponse>('/exam-sessions/join', {
    method: 'POST',
    body: { examId, passcode },
  });
}

export function finishExamAttempt(attemptId: string) {
  return apiRequest(`/exam-sessions/attempts/${encodeURIComponent(attemptId)}/finish`, { method: 'POST' });
}
