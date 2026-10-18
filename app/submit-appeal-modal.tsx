import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Theme } from '@/constants/Colors';

export default function SubmitAppealModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    attemptId?: string;
    questionId?: string;
    questionTitle?: string;
    currentScore?: string;
    examCode?: string;
  }>();

  const attemptId = params.attemptId || 'ATT_2026_SWD_094201';
  const questionTitle = params.questionTitle || 'Phần 1: Kiến trúc Microservices vs Monolithic';
  const currentScore = params.currentScore || '9.2';
  const examCode = params.examCode || 'AIVES_EXAM_2026_094201';

  const [reason, setReason] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const minChars = 20;
  const isValid = reason.trim().length >= minChars;

  const handleSubmit = () => {
    if (!isValid) {
      Alert.alert(
        'Lý do quá ngắn',
        `Vui lòng nhập tối thiểu ${minChars} ký tự để giải trình rõ ràng luận cứ khiếu nại điểm.`
      );
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Nộp đơn phúc khảo thành công',
        'Đơn phúc khảo của bạn đã được ghi nhận vào hệ thống (Mã đơn: APL_2026_8831). Hội đồng Giảng viên sẽ thẩm định lại toàn bộ transcript và file âm thanh gốc.',
        [
          {
            text: 'Đồng ý',
            onPress: () => {
              // Navigate to results screen
              router.replace('/results');
            },
          },
        ]
      );
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <MaterialIcons name="close" size={24} color={Theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gửi Đơn Phúc Khảo Điểm Số</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Question Summary Box */}
          <View style={styles.summaryCard}>
            <View style={styles.tagRow}>
              <View style={styles.examTag}>
                <Text style={styles.examTagText}>{examCode}</Text>
              </View>
              <View style={styles.scoreTag}>
                <Text style={styles.scoreTagText}>Điểm hiện tại: {currentScore}/10</Text>
              </View>
            </View>

            <Text style={styles.questionTitle}>{questionTitle}</Text>
            <Text style={styles.attemptSub}>Lượt thi: {attemptId}</Text>
          </View>

          {/* Reason Input Box */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                Lý do khiếu nại & Luận cứ giải trình <Text style={styles.required}>*</Text>
              </Text>
              <Text
                style={[
                  styles.counter,
                  reason.trim().length >= minChars && { color: '#059669' },
                ]}
              >
                {reason.trim().length}/{minChars} ký tự
              </Text>
            </View>
            <TextInput
              style={styles.textArea}
              placeholder="Trình bày chi tiết lý do bạn cho rằng câu trả lời của mình xứng đáng nhận điểm cao hơn theo tiêu chí Rubric..."
              placeholderTextColor="#94A3B8"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Evidence Notes Input Box */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Trích dẫn mốc thời gian hoặc từ khóa trong bản thu (tùy chọn)</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: Ở giây 00:45 em đã nêu rõ bù trừ Compensating transaction..."
              placeholderTextColor="#94A3B8"
              value={evidenceNotes}
              onChangeText={setEvidenceNotes}
            />
          </View>

          {/* Academic Policy Notice */}
          <View style={styles.noticeCard}>
            <View style={styles.noticeHeader}>
              <MaterialIcons name="policy" size={18} color="#D97706" />
              <Text style={styles.noticeTitle}>Quy định phúc khảo học thuật của Trường</Text>
            </View>
            <Text style={styles.noticeText}>
              • Đơn phúc khảo sẽ được chuyển thẳng tới Trưởng bộ môn và Giảng viên thẩm định độc lập.{'\n'}
              • Toàn bộ bản ghi âm gốc (Audio Recording) và bóc băng AI sẽ được đối chiếu từng giây.{'\n'}
              • Điểm sau phúc khảo là kết quả cuối cùng (có thể tăng, giữ nguyên hoặc giảm tùy vào đánh giá của Hội đồng).{'\n'}
              • Thời gian phản hồi: 2 - 3 ngày làm việc.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              (!isValid || submitting) && { opacity: 0.6 },
            ]}
            onPress={handleSubmit}
            disabled={!isValid || submitting}
          >
            <MaterialIcons name="send" size={18} color={Theme.white} />
            <Text style={styles.submitBtnText}>
              {submitting ? 'Đang gửi hồ sơ phúc khảo...' : 'Gửi Đơn Phúc Khảo'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  closeBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.text,
  },
  content: {
    padding: 18,
  },
  summaryCard: {
    backgroundColor: Theme.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.border,
    marginBottom: 16,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  examTag: {
    backgroundColor: Theme.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  examTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.primary,
  },
  scoreTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  scoreTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.text,
    lineHeight: 20,
  },
  attemptSub: {
    fontSize: 11,
    color: Theme.textSecondary,
    marginTop: 6,
  },
  formGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.text,
  },
  required: {
    color: Theme.danger,
  },
  counter: {
    fontSize: 11,
    color: Theme.textSecondary,
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: Theme.white,
    borderWidth: 1.5,
    borderColor: Theme.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: Theme.text,
    minHeight: 110,
  },
  input: {
    backgroundColor: Theme.white,
    borderWidth: 1.5,
    borderColor: Theme.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: Theme.text,
    marginTop: 6,
  },
  noticeCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 20,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  noticeText: {
    fontSize: 11,
    color: '#78350F',
    lineHeight: 18,
  },
  submitBtn: {
    backgroundColor: Theme.primary,
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnText: {
    color: Theme.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
