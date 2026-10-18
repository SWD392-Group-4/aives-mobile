import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/Colors';

export default function StudentResultsScreen() {
  const router = useRouter();

  const questionsResult = [
    {
      id: 1,
      question: 'Phần 1: Kiến trúc Microservices vs Monolithic',
      score: '9.2 / 10',
      feedback: 'Sinh viên phân tích rất rõ ràng tính khả dụng, độ chịu lỗi (fault tolerance) và các thách thức về network latency.',
      status: 'Đạt xuất sắc',
    },
    {
      id: 2,
      question: 'Phần 2: Cơ chế Saga Pattern trong phân tán',
      score: '8.8 / 10',
      feedback: 'Giải thích đúng ý Choreography vs Orchestration. Cần bổ sung thêm ví dụ về Compensating Transaction khi rollback.',
      status: 'Đạt tốt',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={Theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kết Quả Đánh Giá</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Main Score Hero Card */}
          <View style={styles.scoreHero}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>9.0</Text>
              <Text style={styles.scoreScale}>/ 10</Text>
            </View>

            <Text style={styles.examName}>SWD392 - Kiểm tra vấn đáp Kiến trúc</Text>
            <Text style={styles.examDate}>Hoàn thành: Hôm nay, 14:25 | Sinh viên: SE1701</Text>

            <View style={styles.badgeRow}>
              <View style={styles.statusBadge}>
                <MaterialIcons name="verified" size={14} color="#059669" />
                <Text style={styles.statusBadgeText}>Giảng viên đã duyệt</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: Theme.primaryLight }]}>
                <MaterialIcons name="auto-awesome" size={14} color={Theme.primary} />
                <Text style={[styles.statusBadgeText, { color: Theme.primary }]}>AI Chấm sơ bộ</Text>
              </View>
            </View>
          </View>

          {/* Detailed Question breakdown */}
          <Text style={styles.sectionTitle}>Chi tiết điểm theo tiêu chí</Text>

          {questionsResult.map((item) => (
            <View key={item.id} style={styles.qResultCard}>
              <View style={styles.qResultHeader}>
                <Text style={styles.qResultTitle}>{item.question}</Text>
                <Text style={styles.qResultScore}>{item.score}</Text>
              </View>

              <View style={styles.feedbackBox}>
                <MaterialIcons name="chat-bubble-outline" size={16} color={Theme.textSecondary} />
                <Text style={styles.feedbackText}>{item.feedback}</Text>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.tagSuccess}>
                  <Text style={styles.tagSuccessText}>{item.status}</Text>
                </View>

                {/* Appeal action button */}
                <TouchableOpacity
                  style={styles.appealBtn}
                  onPress={() =>
                    router.push({
                      pathname: '/submit-appeal-modal',
                      params: {
                        attemptId: 'ATT_2026_SWD_094201',
                        questionTitle: item.question,
                        currentScore: item.score,
                      },
                    })
                  }
                >
                  <MaterialIcons name="gavel" size={14} color={Theme.primary} />
                  <Text style={[styles.appealText, { color: Theme.primary }]}>Phúc khảo</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Action to view full rubric details */}
          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: Theme.primaryLight, borderWidth: 1, borderColor: '#BFDBFE', marginBottom: 10 }]}
            onPress={() =>
              router.push({
                pathname: '/result-detail',
                params: {
                  attemptId: 'ATT_2026_SWD_094201',
                  examCode: 'AIVES_EXAM_2026_094201',
                  examTitle: 'SWD392 - Kiểm tra vấn đáp Kiến trúc phần mềm',
                  status: 'PUBLISHED',
                },
              })
            }
          >
            <Text style={[styles.doneBtnText, { color: Theme.primary }]}>Xem chi tiết Rubric & Bằng chứng AI</Text>
          </TouchableOpacity>

          {/* Action to go back home */}
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.doneBtnText}>Về trang chủ</Text>
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </ScrollView>
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.text,
  },
  content: {
    flex: 1,
    padding: 18,
  },
  scoreHero: {
    backgroundColor: Theme.white,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.border,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  scoreCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Theme.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: Theme.primary,
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: Theme.primary,
  },
  scoreScale: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.textSecondary,
    marginTop: -2,
  },
  examName: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.text,
    textAlign: 'center',
  },
  examDate: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.text,
    marginBottom: 12,
  },
  qResultCard: {
    backgroundColor: Theme.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.border,
    marginBottom: 12,
  },
  qResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  qResultTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: Theme.text,
    paddingRight: 8,
  },
  qResultScore: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.primary,
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  feedbackText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagSuccess: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagSuccessText: {
    color: '#03543F',
    fontSize: 11,
    fontWeight: '700',
  },
  appealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  appealText: {
    fontSize: 12,
    color: Theme.textSecondary,
    fontWeight: '600',
  },
  doneBtn: {
    backgroundColor: Theme.primary,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  doneBtnText: {
    color: Theme.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
