import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Theme } from '@/constants/Colors';

export default function ResultDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const attemptId = (params.attemptId as string) || 'ATT-2026-9041';
  const courseCode = (params.courseCode as string) || 'SWD392';

  const questionsResult = [
    {
      id: 1,
      title: 'Câu hỏi 1: Kiến trúc Microservices vs Monolithic Architecture',
      rubric: 'Phân tích tiêu chí: Độc lập triển khai, Fault Tolerance, Network Latency',
      score: '9.2 / 10',
      weight: '40%',
      feedback:
        'Sinh viên phân tích rất rõ ràng tính khả dụng (high availability), độ chịu lỗi (fault tolerance) và các thách thức về network latency và distributed transaction.',
      strengths: 'Trích dẫn chính xác định nghĩa Service Discovery và API Gateway Pattern.',
      weaknesses: 'Nên bổ sung thêm trade-off về chi phí hạ tầng Cloud (AWS/GCP).',
      status: 'Xuất sắc',
    },
    {
      id: 2,
      title: 'Câu hỏi 2: Cơ chế Saga Pattern trong điều phối giao thức phân tán',
      rubric: 'Phân tích tiêu chí: Orchestration vs Choreography, Compensating Transaction',
      score: '8.8 / 10',
      weight: '60%',
      feedback:
        'Giải thích đúng cơ chế Choreography dựa trên Event Bus và Orchestration dùng Orchestrator service. Bổ sung tốt ví dụ về Compensating Transaction khi rollback đơn hàng.',
      strengths: 'Phân biệt rạch ròi 2 cách tiếp cận, trích dẫn chuẩn flow.',
      weaknesses: 'Cần chú ý trường hợp idempotency key trong message delivery.',
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
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Chi Tiết Báo Cáo Khảo Thí</Text>
            <Text style={styles.headerSub}>Mã lượt thi: {attemptId}</Text>
          </View>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={() => Alert.alert('Thông báo', 'Đã lưu chứng nhận kết quả thi vào bộ nhớ máy')}
          >
            <MaterialIcons name="file-download" size={22} color={Theme.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Main Score Hero Card */}
          <View style={styles.scoreHero}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>9.0</Text>
              <Text style={styles.scoreScale}>/ 10</Text>
            </View>

            <Text style={styles.examName}>{courseCode} - Đánh giá năng lực vấn đáp AI</Text>
            <Text style={styles.examDate}>Hoàn thành: 08/10/2026 | Thí sinh: ST180293</Text>

            <View style={styles.badgeRow}>
              <View style={styles.statusBadge}>
                <MaterialIcons name="verified" size={14} color="#059669" />
                <Text style={styles.statusBadgeText}>Giảng viên đã duyệt (HITL)</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: Theme.primaryLight }]}>
                <MaterialIcons name="auto-awesome" size={14} color={Theme.primary} />
                <Text style={[styles.statusBadgeText, { color: Theme.primary }]}>AI Chấm Rubric</Text>
              </View>
            </View>
          </View>

          {/* Lecturer Note Card */}
          <View style={styles.lecturerCard}>
            <View style={styles.lecturerHeader}>
              <MaterialIcons name="rate-review" size={18} color="#0D9488" />
              <Text style={styles.lecturerTitle}>Nhận xét của Giảng viên hội đồng</Text>
            </View>
            <Text style={styles.lecturerBody}>
              "Thí sinh nắm chắc kiến thức cơ sở và mở rộng rất tốt vào ứng dụng thực tế. Tác phong trả lời lưu loát, bình tĩnh và tự tin."
            </Text>
            <Text style={styles.lecturerSign}>— TS. Trần Hoàng Long (Chủ tịch hội đồng chấm)</Text>
          </View>

          {/* Detailed Question breakdown */}
          <Text style={styles.sectionTitle}>Đánh giá chi tiết từng câu hỏi theo Rubric</Text>

          {questionsResult.map((item) => (
            <View key={item.id} style={styles.qResultCard}>
              <View style={styles.qResultHeader}>
                <Text style={styles.qResultTitle}>{item.title}</Text>
                <View style={styles.scoreTag}>
                  <Text style={styles.qResultScore}>{item.score}</Text>
                  <Text style={styles.weightTag}>(Trọng số: {item.weight})</Text>
                </View>
              </View>

              <Text style={styles.rubricSubtitle}>Tiêu chí: {item.rubric}</Text>

              <View style={styles.feedbackBox}>
                <MaterialIcons name="chat-bubble-outline" size={16} color={Theme.textSecondary} />
                <Text style={styles.feedbackText}>{item.feedback}</Text>
              </View>

              <View style={styles.evidenceSection}>
                <View style={styles.evidenceItem}>
                  <MaterialIcons name="add-circle-outline" size={14} color="#059669" />
                  <Text style={styles.evidenceGreen}>Ưu điểm: {item.strengths}</Text>
                </View>
                <View style={styles.evidenceItem}>
                  <MaterialIcons name="remove-circle-outline" size={14} color="#D97706" />
                  <Text style={styles.evidenceAmber}>Cần cải thiện: {item.weaknesses}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.tagSuccess}>
                  <Text style={styles.tagSuccessText}>{item.status}</Text>
                </View>

                {/* Appeal action button */}
                <TouchableOpacity
                  style={styles.appealBtn}
                  onPress={() => router.push('/(tabs)/appeals')}
                >
                  <MaterialIcons name="mail-outline" size={14} color={Theme.primary} />
                  <Text style={styles.appealText}>Khiếu nại / Phúc khảo câu này</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Action to go back */}
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => router.push('/(tabs)/results')}
          >
            <Text style={styles.doneBtnText}>Quay lại danh sách kết quả</Text>
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
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.text,
  },
  headerSub: {
    fontSize: 11,
    color: Theme.textSecondary,
  },
  shareBtn: {
    padding: 6,
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
    marginBottom: 16,
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
    fontWeight: '800',
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
  lecturerCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  lecturerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  lecturerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  lecturerBody: {
    fontSize: 12,
    color: '#134E4A',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  lecturerSign: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
    marginTop: 6,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.text,
    marginBottom: 12,
  },
  qResultCard: {
    backgroundColor: Theme.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.border,
    marginBottom: 14,
  },
  qResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  qResultTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: Theme.text,
    paddingRight: 8,
  },
  scoreTag: {
    alignItems: 'flex-end',
  },
  qResultScore: {
    fontSize: 16,
    fontWeight: '900',
    color: Theme.primary,
  },
  weightTag: {
    fontSize: 10,
    color: Theme.textSecondary,
    fontWeight: '600',
  },
  rubricSubtitle: {
    fontSize: 11,
    color: Theme.textSecondary,
    marginBottom: 10,
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  feedbackText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  evidenceSection: {
    gap: 6,
    marginBottom: 12,
  },
  evidenceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  evidenceGreen: {
    flex: 1,
    fontSize: 11,
    color: '#065F46',
    lineHeight: 16,
  },
  evidenceAmber: {
    flex: 1,
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
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
    color: Theme.primary,
    fontWeight: '700',
  },
  doneBtn: {
    backgroundColor: Theme.primary,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  doneBtnText: {
    color: Theme.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
