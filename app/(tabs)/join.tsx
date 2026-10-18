import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/Colors';
import { joinExamSession } from '@/services/examSessionService';

export default function JoinExamScreen() {
  const router = useRouter();
  const [examCode, setExamCode] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoinExam = async () => {
    const trimmedCode = examCode.trim().toUpperCase();
    const trimmedPasscode = passcode.trim();

    if (!trimmedCode) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập Mã ca thi (VD: AIVES_EXAM_2026_094201)');
      return;
    }
    if (!trimmedPasscode || trimmedPasscode.length < 6) {
      Alert.alert('Thiếu thông tin', 'Mã Passcode gồm 6 chữ số do giảng viên cung cấp');
      return;
    }

    setLoading(true);
    try {
      // Gửi request thực tế tới backend: POST /exam-sessions/join
      const response = await joinExamSession({
        examId: trimmedCode,
        passcode: trimmedPasscode,
      });

      const examTitle = response?.title || 'Kiểm tra vấn đáp Kiến trúc phần mềm SWD392';

      // Chuyển sang màn hình kiểm tra thiết bị theo đúng quy trình
      router.push({
        pathname: '/device-check',
        params: {
          examCode: trimmedCode,
          examTitle,
          attemptId: response?.attemptId || 'ATT-DEMO-001',
          durationMinutes: String(response?.durationMinutes || 30),
        },
      });
    } catch (err: any) {
      // Khi ở môi trường phát triển hoặc offline, cung cấp chế độ Mock kiểm tra thiết bị
      Alert.alert(
        'Xác thực ca thi',
        err.message || 'Mã ca thi hoặc Passcode không khớp với dữ liệu máy chủ. Bạn có muốn tiếp tục ở chế độ Kiểm tra thiết bị?',
        [
          {
            text: 'Tiếp tục vào Device Check',
            onPress: () => {
              router.push({
                pathname: '/device-check',
                params: {
                  examCode: trimmedCode,
                  examTitle: 'Kiểm tra vấn đáp Kiến trúc phần mềm (SWD392)',
                  attemptId: 'ATT-DEMO-2026',
                  durationMinutes: '30',
                },
              });
            },
          },
          { text: 'Thử lại', style: 'cancel' },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasteDemo = () => {
    setExamCode('AIVES_EXAM_2026_094201');
    setPasscode('686868');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Banner */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="meeting-room" size={36} color={Theme.primary} />
            </View>
            <Text style={styles.title}>Vào Ca Thi Vấn Đáp</Text>
            <Text style={styles.subtitle}>
              Nhập mã định danh ca thi và mật khẩu Passcode do Giám thị / Giảng viên cung cấp
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Input Exam Code */}
            <Text style={styles.label}>Mã ca thi (Session Code)</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="tag" size={20} color={Theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="VD: AIVES_EXAM_2026_094201"
                placeholderTextColor="#94A3B8"
                value={examCode}
                onChangeText={(val) => setExamCode(val.toUpperCase())}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              {examCode.length > 0 && (
                <TouchableOpacity onPress={() => setExamCode('')}>
                  <MaterialIcons name="clear" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Input Passcode */}
            <Text style={styles.label}>Mã Passcode (6 số bảo mật)</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="pin" size={20} color={Theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="123456"
                placeholderTextColor="#94A3B8"
                value={passcode}
                onChangeText={setPasscode}
                keyboardType="numeric"
                maxLength={6}
              />
              {passcode.length > 0 && (
                <TouchableOpacity onPress={() => setPasscode('')}>
                  <MaterialIcons name="clear" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Quick Demo Fill button */}
            <TouchableOpacity style={styles.demoFillBtn} onPress={handlePasteDemo}>
              <MaterialIcons name="content-paste" size={16} color={Theme.primary} />
              <Text style={styles.demoFillText}>Điền mã mẫu thử nghiệm</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, loading && { opacity: 0.8 }]}
              onPress={handleJoinExam}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={Theme.white} />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>Xác thực & Tiếp tục</Text>
                  <MaterialIcons name="arrow-forward" size={20} color={Theme.white} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Device & Flow Reminder */}
          <View style={styles.processStepsCard}>
            <Text style={styles.processTitle}>Quy trình chuẩn bị trước khi thi:</Text>
            
            <View style={styles.stepItem}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepHeading}>Xác thực mã phòng thi</Text>
                <Text style={styles.stepDesc}>Kiểm tra thông tin ca thi và phân quyền sinh viên.</Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={[styles.stepBadge, { backgroundColor: Theme.secondary }]}>
                <Text style={styles.stepBadgeText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepHeading}>Kiểm tra thiết bị (Device Check)</Text>
                <Text style={styles.stepDesc}>Kiểm tra Micro, Loa, Camera & Tốc độ mạng đạt chuẩn.</Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={[styles.stepBadge, { backgroundColor: Theme.accent }]}>
                <Text style={styles.stepBadgeText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepHeading}>Phòng thi vấn đáp AI</Text>
                <Text style={styles.stepDesc}>Bắt đầu trả lời các câu hỏi tự động với trợ lý khảo thí AI.</Text>
              </View>
            </View>
          </View>

          {/* Regulations Card */}
          <View style={styles.noticeCard}>
            <View style={styles.noticeHeader}>
              <MaterialIcons name="security" size={18} color="#0D9488" />
              <Text style={styles.noticeTitle}>Quy chế bảo mật khảo thí AIVES</Text>
            </View>
            <Text style={styles.noticeText}>
              • Giữ không gian thi yên tĩnh, không mở các ứng dụng khác trong quá trình thi.{'\n'}
              • Quá trình vấn đáp được ghi âm và bóc băng tự động theo thời gian thực.{'\n'}
              • Điểm số AI mang tính chất sơ bộ và được Giảng viên thẩm định trước khi công bố.
            </Text>
          </View>

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
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 14,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Theme.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Theme.text,
  },
  subtitle: {
    fontSize: 13,
    color: Theme.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 12,
    lineHeight: 18,
  },
  card: {
    backgroundColor: Theme.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.text,
    marginBottom: 8,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: Theme.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Theme.text,
    fontWeight: '600',
  },
  demoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 12,
    marginBottom: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Theme.primaryLight,
    borderRadius: 8,
  },
  demoFillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.primary,
  },
  submitBtn: {
    backgroundColor: Theme.primary,
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtnText: {
    color: Theme.white,
    fontSize: 16,
    fontWeight: '700',
  },
  processStepsCard: {
    backgroundColor: Theme.white,
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  processTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.text,
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepBadgeText: {
    color: Theme.white,
    fontSize: 12,
    fontWeight: '800',
  },
  stepContent: {
    flex: 1,
  },
  stepHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.text,
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 12,
    color: Theme.textSecondary,
    lineHeight: 16,
  },
  noticeCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },
  noticeText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 19,
  },
});
