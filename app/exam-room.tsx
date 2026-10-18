import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Theme } from '@/constants/Colors';

interface QuestionItem {
  id: number;
  type: 'MAIN' | 'FOLLOW_UP';
  followUpIndex?: number;
  bloomLevel: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE';
  part: string;
  question: string;
  rubric: string;
  sampleTranscript: string;
  hasFollowUp?: boolean;
  followUpQuestion?: {
    id: number;
    type: 'FOLLOW_UP';
    followUpIndex: number;
    bloomLevel: 'ANALYZE';
    part: string;
    question: string;
    rubric: string;
    sampleTranscript: string;
  };
}

export default function ExamRoomScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    attemptId?: string;
    examCode?: string;
    examTitle?: string;
  }>();

  const examCode = params.examCode || 'AIVES_EXAM_2026_094201';
  const examTitle = params.examTitle || 'SWD392 - Viva Exam Kiến trúc';
  const attemptId = params.attemptId || 'ATT_2026_SWD_0942';

  // Total session countdown: 15 minutes (900 seconds)
  const [sessionSeconds, setSessionSeconds] = useState(900);

  // Per-question answer seconds: 120s countdown
  const [answerSeconds, setAnswerSeconds] = useState(120);

  // State machine: TTS_PLAY -> STUDENT_SPEAKING -> EVAL_AND_DECIDE
  const [examState, setExamState] = useState<'TTS_PLAY' | 'STUDENT_SPEAKING' | 'EVAL_AND_DECIDE'>('TTS_PLAY');
  const [isAiSpeaking, setIsAiSpeaking] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  // Live Speech-to-Text Transcript
  const [transcript, setTranscript] = useState('');

  // Silence detection meter (BR-VIVA-003): count seconds of silence
  const [silenceSeconds, setSilenceSeconds] = useState(0);

  // Voice waves animation
  const voiceWaves = useRef([
    new Animated.Value(12),
    new Animated.Value(28),
    new Animated.Value(18),
    new Animated.Value(34),
    new Animated.Value(22),
    new Animated.Value(30),
    new Animated.Value(14),
  ]).current;

  // Question bank with follow-up adaptive questions
  const initialQuestions: QuestionItem[] = [
    {
      id: 1,
      type: 'MAIN',
      bloomLevel: 'ANALYZE',
      part: 'Phần 1: Kiến trúc Hệ thống Phân tán',
      question:
        'Hãy phân tích sự khác biệt cốt lõi giữa kiến trúc Microservices và Monolithic. Trong trường hợp nào thì một dự án khởi nghiệp (Startup) NÊN hoặc KHÔNG NÊN áp dụng Microservices?',
      rubric:
        'Tiêu chí chấm: So sánh được tính mở rộng (Scalability), tính chịu lỗi (Fault-tolerance), độ trễ mạng (Network Latency) và chi phí vận hành DevOps.',
      sampleTranscript:
        'Dạ thưa thầy cô và AI, kiến trúc Monolithic gom toàn bộ module vào một codebase và một database duy nhất, rất dễ deploy ban đầu. Ngược lại, Microservices chia nhỏ theo domain business, mỗi service độc lập về DB và triển khai. Đối với startup giai đoạn đầu cần MVP nhanh thì Monolithic là tối ưu, chỉ nên chuyển sang Microservices khi team đông và scale traffic lớn...',
      hasFollowUp: true,
      followUpQuestion: {
        id: 101,
        type: 'FOLLOW_UP',
        followUpIndex: 1,
        bloomLevel: 'ANALYZE',
        part: 'Câu hỏi xoáy thích ứng (Adaptive Follow-up)',
        question:
          'Bạn vừa nhắc đến việc chia nhỏ Database theo domain. Vậy làm thế nào để đảm bảo tính nhất quán dữ liệu (Data Consistency) khi thực hiện giao dịch xuyên suốt nhiều services độc lập?',
        rubric:
          'Tiêu chí xoáy: Đánh giá hiểu biết về 2-Phase Commit (2PC) vs Saga Pattern (Choreography/Orchestration) và Compensating Transactions.',
        sampleTranscript:
          'Trong microservices, chúng ta không dùng ACID truyền thống vì lock database rất chậm. Em sẽ áp dụng Saga Pattern, chia giao dịch lớn thành chuỗi các local transactions. Khi một bước fail, hệ thống kích hoạt compensating transactions để rollback dữ liệu bù trừ...',
      },
    },
    {
      id: 2,
      type: 'MAIN',
      bloomLevel: 'APPLY',
      part: 'Phần 2: Cơ chế Bảo mật & Xác thực',
      question:
        'Trong hệ thống Restful API phân tán, cơ chế JWT (JSON Web Token) kết hợp Refresh Token hoạt động như thế nào để vừa đảm bảo Stateless vừa có thể thu hồi (Revoke) phiên khi cần?',
      rubric:
        'Tiêu chí chấm: Giải thích Access Token ngắn hạn (15m) lưu bộ nhớ, Refresh Token dài hạn lưu DB/Redis và cơ chế Token Blacklist.',
      sampleTranscript:
        'Dạ, Access Token có thời gian sống ngắn tầm 15 phút mang payload stateless. Refresh Token có hạn dài hơn được mã hóa lưu an toàn. Khi người dùng logout hoặc bị cấm, ta đưa Access Token vào Redis Blacklist hoặc xóa Refresh Token trong server cache...',
    },
    {
      id: 3,
      type: 'MAIN',
      bloomLevel: 'EVALUATE',
      part: 'Phần 3: Tối ưu Hóa Hiệu năng & Cache',
      question:
        'Giải thích hiện tượng Cache Stampede (Cache Avalanche). Đề xuất 2 chiến lược kiến trúc để bảo vệ hệ thống Database chính khi Cache Redis bị sập đột ngột.',
      rubric:
        'Tiêu chí chấm: Nêu được Cache Warming, Mutual Exclusion (Mutex lock) và Circuit Breaker pattern.',
      sampleTranscript:
        'Cache stampede xảy ra khi một key hot hết hạn cùng lúc hàng nghìn request đổ thẳng vào database. Cách phòng tránh là dùng khóa phân tán Mutex để chỉ cho 1 request query DB và nạp cache, kết hợp jitter TTL ngẫu nhiên...',
    },
  ];

  const [questionList, setQuestionList] = useState<QuestionItem[]>(initialQuestions);
  const [currentIdx, setCurrentIdx] = useState(0);

  const currentQ = questionList[currentIdx];

  // Global Session Countdown Timer (15:00)
  useEffect(() => {
    if (sessionSeconds <= 0) {
      handleCompleteExam();
      return;
    }
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionSeconds]);

  // Per-Question Answer Countdown Timer & Silence Detector (BR-VIVA-003)
  useEffect(() => {
    let timer: any;
    if (examState === 'STUDENT_SPEAKING' && isRecording) {
      timer = setInterval(() => {
        // Countdown answer timer
        setAnswerSeconds((prev) => {
          if (prev <= 1) {
            handleAutoSubmit('Hết thời gian trả lời câu hỏi!');
            return 0;
          }
          return prev - 1;
        });

        // Silence meter
        setSilenceSeconds((prev) => {
          const next = prev + 1;
          if (next >= 10) {
            // BR-VIVA-003: Auto submit if silence >= 10s
            handleAutoSubmit('Hệ thống tự động nộp câu trả lời do phát hiện khoảng lặng kéo dài 10 giây (BR-VIVA-003).');
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examState, isRecording]);

  // Wave Animation Loop during recording or TTS
  useEffect(() => {
    let interval: any;
    if (isRecording || isAiSpeaking) {
      interval = setInterval(() => {
        voiceWaves.forEach((val) => {
          Animated.sequence([
            Animated.timing(val, {
              toValue: Math.floor(Math.random() * 30) + 10,
              duration: 90,
              useNativeDriver: false,
            }),
          ]).start();
        });
      }, 100);
    } else {
      voiceWaves.forEach((val) => {
        Animated.timing(val, {
          toValue: 8,
          duration: 150,
          useNativeDriver: false,
        }).start();
      });
    }
    return () => clearInterval(interval);
  }, [isRecording, isAiSpeaking]);

  // TTS Read Question Simulation on question load
  useEffect(() => {
    setIsAiSpeaking(true);
    setExamState('TTS_PLAY');
    setIsRecording(false);
    setTranscript('');
    setSilenceSeconds(0);
    setAnswerSeconds(120);

    const ttsTimeout = setTimeout(() => {
      setIsAiSpeaking(false);
      setExamState('STUDENT_SPEAKING');
      // Auto enable mic when question finished reading
      setIsRecording(true);
      // Simulate live speech transcript typing
      startTranscriptSimulation();
    }, 2800);

    return () => clearTimeout(ttsTimeout);
  }, [currentIdx]);

  // Transcript typing simulation
  const startTranscriptSimulation = () => {
    const text = currentQ.sampleTranscript;
    let charIdx = 0;
    const interval = setInterval(() => {
      charIdx += 4;
      if (charIdx <= text.length) {
        setTranscript(text.slice(0, charIdx));
        // Reset silence whenever student is talking
        setSilenceSeconds(0);
      } else {
        clearInterval(interval);
      }
    }, 180);
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setSilenceSeconds(0);
    }
  };

  const handleReplayTts = () => {
    setIsAiSpeaking(true);
    setExamState('TTS_PLAY');
    setTimeout(() => {
      setIsAiSpeaking(false);
      setExamState('STUDENT_SPEAKING');
    }, 2500);
  };

  const handleAutoSubmit = (reason: string) => {
    setIsRecording(false);
    Alert.alert('Chốt câu trả lời', reason, [
      {
        text: 'Tiếp tục',
        onPress: () => submitCurrentAnswer(),
      },
    ]);
  };

  const handleSubmitAnswer = () => {
    setIsRecording(false);
    submitCurrentAnswer();
  };

  const handleSkipQuestion = () => {
    Alert.alert(
      'Bỏ qua câu hỏi này?',
      'Bạn có chắc chắn muốn bỏ qua câu hỏi hiện tại? AI sẽ ghi nhận 0 điểm cho phần này (BR-VIVA-001).',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Bỏ qua câu này',
          style: 'destructive',
          onPress: () => {
            setIsRecording(false);
            moveToNextFlow(false);
          },
        },
      ]
    );
  };

  const submitCurrentAnswer = () => {
    // Check if current question triggers follow-up
    if (currentQ.hasFollowUp && currentQ.followUpQuestion && currentQ.type === 'MAIN') {
      Alert.alert(
        'AI Phân Tích & Kích Hoạt Câu Hỏi Xoáy',
        'AI đã phân tích câu trả lời chính của bạn và nhận thấy cần đào sâu thêm để đánh giá mức độ Bloom: ANALYZE.',
        [
          {
            text: 'Nhận câu hỏi xoáy thích ứng',
            onPress: () => {
              // Insert follow-up question right after current question
              const nextList = [...questionList];
              nextList.splice(currentIdx + 1, 0, currentQ.followUpQuestion!);
              setQuestionList(nextList);
              setCurrentIdx(currentIdx + 1);
            },
          },
        ]
      );
    } else {
      moveToNextFlow(true);
    }
  };

  const moveToNextFlow = (hasAnswered: boolean) => {
    if (currentIdx < questionList.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleCompleteExam();
    }
  };

  const handleCompleteExam = () => {
    router.replace({
      pathname: '/exam-submitted',
      params: {
        attemptId,
        examCode,
        examTitle,
      },
    });
  };

  const handleExitPrompt = () => {
    Alert.alert(
      'Thoát phòng thi?',
      'Bài thi đang diễn ra. Nếu rời khỏi màn hình, lượt thi của bạn có thể bị huỷ theo quy chế thi!',
      [
        { text: 'Tiếp tục làm bài', style: 'cancel' },
        {
          text: 'Rời phòng thi',
          style: 'destructive',
          onPress: () => router.replace('/(tabs)'),
        },
      ]
    );
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Bloom level badges color mapping
  const getBloomColor = (level: string) => {
    switch (level) {
      case 'REMEMBER':
        return '#64748B';
      case 'UNDERSTAND':
        return '#0284C7';
      case 'APPLY':
        return '#059669';
      case 'ANALYZE':
        return '#7C3AED';
      case 'EVALUATE':
        return '#D97706';
      default:
        return Theme.primary;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Status Bar: Exam Code, Title & Global Countdown */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleExitPrompt} style={styles.backBtn}>
            <MaterialIcons name="close" size={24} color={Theme.text} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.examTitle} numberOfLines={1}>
              {examTitle}
            </Text>
            <Text style={styles.examId}>{examCode}</Text>
          </View>

          {/* 15:00 Global Countdown Badge */}
          <View
            style={[
              styles.timerBadge,
              sessionSeconds < 180 && styles.timerDanger,
            ]}
          >
            <MaterialIcons
              name="alarm"
              size={16}
              color={sessionSeconds < 180 ? Theme.danger : Theme.primary}
            />
            <Text
              style={[
                styles.timerText,
                sessionSeconds < 180 && { color: Theme.danger },
              ]}
            >
              {formatTimer(sessionSeconds)}
            </Text>
          </View>
        </View>

        {/* Global Progress Bar */}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${((currentIdx + 1) / questionList.length) * 100}%`,
              },
            ]}
          />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* AI Question Box */}
          <View style={styles.questionCard}>
            <View style={styles.qHeaderRow}>
              {/* Question Type: MAIN vs FOLLOW_UP */}
              <View
                style={[
                  styles.qTypePill,
                  currentQ.type === 'FOLLOW_UP' && {
                    backgroundColor: '#FEF3C7',
                    borderColor: '#FDE68A',
                  },
                ]}
              >
                <MaterialIcons
                  name={currentQ.type === 'FOLLOW_UP' ? 'psychology' : 'quiz'}
                  size={14}
                  color={currentQ.type === 'FOLLOW_UP' ? '#B45309' : Theme.primary}
                />
                <Text
                  style={[
                    styles.qTypePillText,
                    currentQ.type === 'FOLLOW_UP' && { color: '#B45309' },
                  ]}
                >
                  {currentQ.type === 'FOLLOW_UP'
                    ? `CÂU XOÁY ${currentQ.followUpIndex || 1}/2`
                    : 'CÂU HỎI CHÍNH (MAIN)'}
                </Text>
              </View>

              {/* Bloom Level Badge */}
              <View
                style={[
                  styles.bloomBadge,
                  { backgroundColor: `${getBloomColor(currentQ.bloomLevel)}18` },
                ]}
              >
                <Text
                  style={[
                    styles.bloomText,
                    { color: getBloomColor(currentQ.bloomLevel) },
                  ]}
                >
                  {currentQ.bloomLevel}
                </Text>
              </View>

              {/* Progress Count */}
              <Text style={styles.qCounterText}>
                {currentIdx + 1}/{questionList.length}
              </Text>
            </View>

            {/* Question Text */}
            <Text style={styles.questionText}>{currentQ.question}</Text>

            {/* Rubric Criteria Box */}
            <View style={styles.rubricBox}>
              <MaterialIcons name="fact-check" size={16} color={Theme.secondary} />
              <Text style={styles.rubricText}>{currentQ.rubric}</Text>
            </View>

            {/* AI Speech TTS Status Box */}
            <View style={styles.ttsStateRow}>
              <View style={styles.ttsIconPulse}>
                <MaterialIcons
                  name={isAiSpeaking ? 'volume-up' : 'record-voice-over'}
                  size={18}
                  color={isAiSpeaking ? Theme.primary : Theme.textSecondary}
                />
              </View>
              <Text style={styles.ttsStateText}>
                {isAiSpeaking ? 'AI đang đọc câu hỏi...' : 'AI đã đọc xong. Mời bạn trả lời!'}
              </Text>

              {!isAiSpeaking && (
                <TouchableOpacity style={styles.replayBtn} onPress={handleReplayTts}>
                  <MaterialIcons name="replay" size={14} color={Theme.primary} />
                  <Text style={styles.replayText}>Nghe lại</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Student Speaking & Response Box */}
          <View style={styles.speakingCard}>
            <View style={styles.speakingHeader}>
              <View style={styles.speakingStatusRow}>
                <View
                  style={[
                    styles.statusDot,
                    isRecording && { backgroundColor: Theme.danger },
                  ]}
                />
                <Text style={styles.speakingStatusTitle}>
                  {isRecording ? 'Đang lắng nghe câu trả lời...' : 'Micro đang tạm dừng'}
                </Text>
              </View>

              {/* Answer 120s Countdown */}
              <View style={styles.answerTimerBadge}>
                <MaterialIcons name="timer" size={14} color={Theme.textSecondary} />
                <Text style={styles.answerTimerText}>
                  Còn lại: <Text style={{ fontWeight: '800' }}>{answerSeconds}s</Text>
                </Text>
              </View>
            </View>

            {/* Live Audio Waves Animation */}
            <View style={styles.audioWaveBox}>
              <View style={styles.waveBarContainer}>
                {voiceWaves.map((h, i) => (
                  <Animated.View
                    key={i}
                    style={[
                      styles.liveWaveBar,
                      {
                        height: h,
                        backgroundColor: isRecording ? Theme.primary : '#CBD5E1',
                      },
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* VAD Silence Detection Meter (BR-VIVA-003) */}
            <View style={styles.silenceMeterRow}>
              <Text style={styles.silenceLabel}>Khoảng lặng đo được (VAD):</Text>
              <Text
                style={[
                  styles.silenceValue,
                  silenceSeconds >= 5 && { color: Theme.warning },
                  silenceSeconds >= 8 && { color: Theme.danger },
                ]}
              >
                {silenceSeconds}.0s / 10s
              </Text>
            </View>
            {silenceSeconds >= 5 && (
              <View style={styles.silenceWarningBox}>
                <MaterialIcons name="info" size={14} color="#B45309" />
                <Text style={styles.silenceWarningText}>
                  Bạn đã hoàn thành câu trả lời chưa? Hệ thống sẽ tự nộp nếu im lặng đủ 10s (BR-VIVA-003).
                </Text>
              </View>
            )}

            {/* Live Speech-to-Text Transcript Display */}
            <View style={styles.transcriptBox}>
              <Text style={styles.transcriptLabel}>Bóc băng trực tiếp (Live Transcript):</Text>
              <Text style={styles.transcriptContent}>
                {transcript || (isRecording ? 'Hãy cất lời, AI đang chuyển giọng nói thành văn bản...' : 'Chưa có nội dung ghi nhận.')}
              </Text>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Bottom Interactive Control Area */}
        <View style={styles.bottomBar}>
          {/* Voice Mic Toggle Button */}
          <TouchableOpacity
            style={[styles.bigMicBtn, isRecording && styles.bigMicBtnActive]}
            onPress={handleToggleRecord}
          >
            <MaterialIcons
              name={isRecording ? 'stop' : 'mic'}
              size={36}
              color={Theme.white}
            />
          </TouchableOpacity>
          <Text style={styles.micHint}>
            {isRecording ? 'Chạm để dừng nói' : 'Chạm để bật micro và nói'}
          </Text>

          {/* Action Row: Skip or Submit Answer */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.skipBtn} onPress={handleSkipQuestion}>
              <MaterialIcons name="skip-next" size={18} color={Theme.textSecondary} />
              <Text style={styles.skipBtnText}>Bỏ qua câu này</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitAnswer}>
              <Text style={styles.submitBtnText}>
                {currentIdx < questionList.length - 1 ? 'Nộp câu trả lời' : 'Hoàn thành bài thi'}
              </Text>
              <MaterialIcons name="check" size={18} color={Theme.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Theme.white,
    borderBottomWidth: 1,
    borderColor: Theme.border,
  },
  backBtn: {
    padding: 6,
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  examTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.text,
  },
  examId: {
    fontSize: 11,
    color: Theme.textSecondary,
    marginTop: 2,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Theme.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  timerDanger: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  timerText: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.primary,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E2E8F0',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Theme.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  questionCard: {
    backgroundColor: Theme.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Theme.border,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  qHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  qTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Theme.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  qTypePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: Theme.primary,
  },
  bloomBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bloomText: {
    fontSize: 11,
    fontWeight: '800',
  },
  qCounterText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.textSecondary,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.text,
    lineHeight: 25,
    marginBottom: 14,
  },
  rubricBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F0FDFA',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginBottom: 14,
  },
  rubricText: {
    flex: 1,
    fontSize: 12,
    color: '#0F766E',
    lineHeight: 18,
  },
  ttsStateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
  },
  ttsIconPulse: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ttsStateText: {
    flex: 1,
    fontSize: 12,
    color: Theme.text,
    fontWeight: '600',
  },
  replayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Theme.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  replayText: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.primary,
  },
  speakingCard: {
    backgroundColor: Theme.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  speakingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  speakingStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#94A3B8',
  },
  speakingStatusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.text,
  },
  answerTimerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  answerTimerText: {
    fontSize: 11,
    color: Theme.textSecondary,
  },
  audioWaveBox: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  waveBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 44,
  },
  liveWaveBar: {
    width: 6,
    borderRadius: 3,
  },
  silenceMeterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  silenceLabel: {
    fontSize: 12,
    color: Theme.textSecondary,
  },
  silenceValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  silenceWarningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  silenceWarningText: {
    flex: 1,
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
  },
  transcriptBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  transcriptLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  transcriptContent: {
    fontSize: 13,
    color: Theme.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  bottomBar: {
    backgroundColor: Theme.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderColor: Theme.border,
    alignItems: 'center',
  },
  bigMicBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 6,
  },
  bigMicBtnActive: {
    backgroundColor: Theme.danger,
    transform: [{ scale: 1.05 }],
  },
  micHint: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.textSecondary,
    marginBottom: 12,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  skipBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.textSecondary,
  },
  submitBtn: {
    flex: 1.5,
    height: 46,
    borderRadius: 12,
    backgroundColor: Theme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.white,
  },
});
