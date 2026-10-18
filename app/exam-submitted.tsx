import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Theme } from '@/constants/Colors';

export default function ExamSubmittedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    attemptId?: string;
    examCode?: string;
    examTitle?: string;
  }>();

  const examCode = params.examCode || 'AIVES_EXAM_2026_094201';
  const examTitle = params.examTitle || 'Kiểm tra vấn đáp Kiến trúc phần mềm';
  const attemptId = params.attemptId || 'ATT_2026_SWD_0942';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Big Success Icon Banner */}
        <View style={styles.heroSection}>
          <View style={styles.successCircle}>
            <MaterialIcons name="check-circle" size={56} color="#059669" />
          </View>
          <Text style={styles.title}>Nộp Bài Thành Công!</Text>
          <Text style={styles.subtitle}>
            Chúc mừng bạn đã hoàn thành trọn vẹn phần thi vấn đáp Viva với trợ lý AI.
          </Text>
        </View>

        {/* Exam Summary Details Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Tóm tắt lượt thi</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mã ca thi:</Text>
            <Text style={styles.detailValue}>{examCode}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Môn học:</Text>
            <Text style={styles.detailValue}>{examTitle}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mã lượt thi (Attempt):</Text>
            <Text style={styles.detailValue}>{attemptId}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Thời gian hoàn thành:</Text>
            <Text style={styles.detailValue}>12 phút 45 giây</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Số câu hỏi đã trả lời:</Text>
            <Text style={styles.detailValue}>3 câu chính + 1 câu xoáy</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Trạng thái hiện tại:</Text>
            <View style={styles.pendingBadge}>
              <MaterialIcons name="hourglass-top" size={13} color="#D97706" />
              <Text style={styles.pendingBadgeText}>PENDING_REVIEW</Text>
            </View>
          </View>
        </View>

        {/* Phase P5: HITL Process Explanation Card */}
        <View style={styles.processCard}>
          <View style={styles.processHeader}>
            <MaterialIcons name="policy" size={20} color={Theme.secondary} />
            <Text style={styles.processTitle}>Quy trình thẩm định tiếp theo (Phase P5)</Text>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitleText}>AI đối chiếu Rubric & trích xuất bằng chứng</Text>
              <Text style={styles.stepDescText}>
                Hệ thống AI xử lý bóc băng và lập báo cáo điểm gợi ý theo từng tiêu chí Rubric định lượng.
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitleText}>Giảng viên thẩm định (Human-in-the-Loop Review)</Text>
              <Text style={styles.stepDescText}>
                Giảng viên phụ trách ca thi sẽ nghe lại audio, đối chiếu transcript và phê duyệt/ghi đè điểm số cuối cùng (BR-GRADE-002).
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, { backgroundColor: '#DCFCE7' }]}>
              <MaterialIcons name="done" size={14} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitleText}>Công bố điểm chính thức (PUBLISHED)</Text>
              <Text style={styles.stepDescText}>
                Kết quả chính thức sẽ được công bố và bạn có quyền gửi yêu cầu phúc khảo nếu cần.
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              router.push({
                pathname: '/result-detail',
                params: {
                  attemptId,
                  examCode,
                  examTitle,
                  status: 'PENDING_REVIEW',
                },
              })
            }
          >
            <MaterialIcons name="assignment" size={18} color={Theme.white} />
            <Text style={styles.primaryBtnText}>Xem chi tiết bài làm & Rubric</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push('/results')}
          >
            <MaterialIcons name="list-alt" size={18} color={Theme.primary} />
            <Text style={styles.secondaryBtnText}>Xem danh sách kết quả đã có</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.homeBtnText}>Về Màn Hình Chính</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 14,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Theme.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: Theme.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
    lineHeight: 19,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: Theme.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Theme.border,
    marginVertical: 14,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailLabel: {
    fontSize: 13,
    color: Theme.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.text,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  processCard: {
    width: '100%',
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginBottom: 20,
  },
  processHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  processTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.secondary,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: Theme.primary,
  },
  stepTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.text,
  },
  stepDescText: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
    lineHeight: 16,
  },
  actionContainer: {
    width: '100%',
    gap: 10,
  },
  primaryBtn: {
    width: '100%',
    height: 50,
    backgroundColor: Theme.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBtnText: {
    color: Theme.white,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    width: '100%',
    height: 48,
    backgroundColor: Theme.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Theme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    color: Theme.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  homeBtn: {
    width: '100%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBtnText: {
    color: Theme.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
