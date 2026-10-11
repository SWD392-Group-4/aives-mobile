import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/Colors';

export default function ExamRoomScreen() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(180); // 3 phút đếm ngược
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questions = [
    {
      id: 1,
      part: 'Phần 1: Kiến trúc & Pattern',
      title: 'Hãy trình bày sự khác biệt giữa kiến trúc Microservices và Monolithic. Khi nào nên ưu tiên chọn Microservices?',
      rubric: 'Đánh giá khả năng so sánh tính khả dụng, độ mở rộng (scalability) và chi phí vận hành.',
    },
    {
      id: 2,
      part: 'Phần 2: Cơ chế Giao tiếp & Data consistency',
      title: 'Trong hệ thống phân tán, cơ chế Saga Pattern giải quyết bài toán Distributed Transaction như thế nào?',
      rubric: 'Tiêu chí: Nêu được Choreography vs Orchestration và bù trừ dữ liệu (Compensating transactions).',
    },
  ];

  // Đồng hồ đếm ngược
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleRecord = () => {
    setIsRecording(!isRecording);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsRecording(false);
    } else {
      Alert.alert(
        'Hoàn thành bài thi',
        'Bạn đã trả lời hết các câu hỏi. Hệ thống AI đang phân tích và lưu trữ bản ghi âm.',
        [
          {
            text: 'Xem kết quả sơ bộ',
            onPress: () => router.replace('/results'),
          },
        ]
      );
    }
  };

  const currentQ = questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Status Bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="close" size={24} color={Theme.text} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.examTitle}>SWD392 - Viva Exam</Text>
            <Text style={styles.examId}>AIVES_EXAM_2026_094201</Text>
          </View>
          <View style={[styles.timerBadge, seconds < 60 && styles.timerWarning]}>
            <MaterialIcons
              name="alarm"
              size={16}
              color={seconds < 60 ? Theme.danger : Theme.primary}
            />
            <Text style={[styles.timerText, seconds < 60 && { color: Theme.danger }]}>
              {formatTimer(seconds)}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Question Card */}
          <View style={styles.questionCard}>
            <View style={styles.qHeader}>
              <Text style={styles.partLabel}>{currentQ.part}</Text>
              <View style={styles.qCountBadge}>
                <Text style={styles.qCountText}>
                  Câu {currentQuestionIndex + 1}/{questions.length}
                </Text>
              </View>
            </View>

            <Text style={styles.questionText}>{currentQ.title}</Text>

            <View style={styles.rubricBox}>
              <MaterialIcons name="fact-check" size={16} color={Theme.secondary} />
              <Text style={styles.rubricText}>{currentQ.rubric}</Text>
            </View>
          </View>

          {/* AI Voice Assistant Box */}
          <View style={styles.aiBox}>
            <View style={styles.aiAvatar}>
              <MaterialIcons name="smart-toy" size={24} color={Theme.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiName}>AI Viva Proctor</Text>
              <Text style={styles.aiStatus}>
                {isRecording
                  ? 'Đang lắng nghe câu trả lời và phân tích giọng nói...'
                  : 'Bấm nút micro bên dưới để bắt đầu trả lời câu hỏi'}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Voice Recording Control Area */}
        <View style={styles.bottomControl}>
          <TouchableOpacity
            style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
            onPress={handleToggleRecord}
          >
            <MaterialIcons
              name={isRecording ? 'stop' : 'mic'}
              size={36}
              color={Theme.white}
            />
          </TouchableOpacity>

          <Text style={styles.recordStatusText}>
            {isRecording ? 'Đang ghi âm câu trả lời... (Bấm để dừng)' : 'Chạm để nói'}
          </Text>

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={handleNextQuestion}
          >
            <Text style={styles.nextBtnText}>
              {currentQuestionIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Nộp bài thi'}
            </Text>
            <MaterialIcons name="arrow-forward" size={18} color={Theme.white} />
          </TouchableOpacity>
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
    paddingVertical: 12,
    backgroundColor: Theme.white,
    borderBottomWidth: 1,
    borderColor: Theme.border,
  },
  backBtn: {
    padding: 6,
  },
  headerInfo: {
    alignItems: 'center',
  },
  examTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.text,
  },
  examId: {
    fontSize: 11,
    color: Theme.textSecondary,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Theme.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerWarning: {
    backgroundColor: '#FEE2E2',
  },
  timerText: {
    fontSize: 13,
    fontWeight: '700',
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
    padding: 18,
  },
  questionCard: {
    backgroundColor: Theme.white,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: Theme.border,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  qHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  partLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.primary,
    textTransform: 'uppercase',
  },
  qCountBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  qCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.textSecondary,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '700',
    color: Theme.text,
    lineHeight: 26,
    marginBottom: 16,
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
  },
  rubricText: {
    flex: 1,
    fontSize: 12,
    color: '#0F766E',
    lineHeight: 18,
  },
  aiBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Theme.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  aiAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiName: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.text,
  },
  aiStatus: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginTop: 2,
  },
  bottomControl: {
    backgroundColor: Theme.white,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: Theme.border,
    alignItems: 'center',
  },
  recordBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 8,
  },
  recordBtnActive: {
    backgroundColor: Theme.danger,
    transform: [{ scale: 1.05 }],
  },
  recordStatusText: {
    fontSize: 13,
    color: Theme.textSecondary,
    fontWeight: '600',
    marginBottom: 16,
  },
  nextBtn: {
    width: '100%',
    height: 48,
    backgroundColor: Theme.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextBtnText: {
    color: Theme.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
