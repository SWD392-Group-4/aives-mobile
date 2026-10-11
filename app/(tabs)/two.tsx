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
  const [examId, setExamId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoinExam = async () => {
    if (!examId.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập Mã ca thi (VD: AIVES_EXAM_2026_094201)');
      return;
    }
    if (!passcode.trim() || passcode.length < 6) {
      Alert.alert('Thiếu thông tin', 'Mã Passcode gồm 6 chữ số do giảng viên cung cấp');
      return;
    }

    setLoading(true);
    try {
      // Gửi request thực tế tới backend: POST /exam-sessions/join
      const response = await joinExamSession({
        examId: examId.trim().toUpperCase(),
        passcode: passcode.trim(),
      });

      Alert.alert(
        'Vào phòng thi thành công',
        `Ca thi: ${response.title || examId}\nThời lượng: ${response.durationMinutes || 30} phút`,
        [
          {
            text: 'Bắt đầu vấn đáp',
            onPress: () => router.push('/exam-room'),
          },
        ]
      );
    } catch (err: any) {
      // Xử lý lỗi trả về từ API backend
      Alert.alert(
        'Không thể vào ca thi',
        err.message || 'Mã ca thi hoặc passcode không đúng, hoặc ca thi chưa bắt đầu.',
        [
          {
            text: 'Vào thử chế độ Mock',
            onPress: () => router.push('/exam-room'),
          },
          { text: 'Thử lại', style: 'cancel' },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasteDemo = () => {
    setExamId('AIVES_EXAM_2026_094201');
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
            <Text style={styles.title}>Tham Gia Ca Thi</Text>
            <Text style={styles.subtitle}>
              Gọi trực tiếp API Backend (`POST /api/exam-sessions/join`)
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Input Exam ID */}
            <Text style={styles.label}>Mã ca thi (Exam Code)</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="tag" size={20} color={Theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="VD: AIVES_EXAM_2026_094201"
                placeholderTextColor="#94A3B8"
                value={examId}
                onChangeText={(val) => setExamId(val.toUpperCase())}
                autoCapitalize="characters"
              />
            </View>

            {/* Input Passcode */}
            <Text style={styles.label}>Mã Passcode (6 số)</Text>
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
            </View>

            {/* Quick Demo Fill button */}
            <TouchableOpacity style={styles.demoFillBtn} onPress={handlePasteDemo}>
              <MaterialIcons name="content-paste" size={16} color={Theme.primary} />
              <Text style={styles.demoFillText}>Điền mã mẫu để thử</Text>
            </TouchableOpacity>

            {/* Join Button */}
            <TouchableOpacity
              style={[styles.submitBtn, loading && { opacity: 0.8 }]}
              onPress={handleJoinExam}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Theme.white} />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>Xác thực & Vào phòng thi</Text>
                  <MaterialIcons name="login" size={20} color={Theme.white} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Instructions Notice Card */}
          <View style={styles.noticeCard}>
            <View style={styles.noticeHeader}>
              <MaterialIcons name="info-outline" size={20} color={Theme.secondary} />
              <Text style={styles.noticeTitle}>Quy chế thi vấn đáp với AI</Text>
            </View>
            <Text style={styles.noticeText}>
              • Thiết bị cần cấp quyền truy cập Micro để AI nhận diện giọng nói.{'\n'}
              • Quá trình vấn đáp và phân tích tiêu chí đánh giá (Rubric) được ghi nhận tự động.{'\n'}
              • Giảng viên có quyền xem lại bản ghi âm và chấm duyệt cuối cùng.
            </Text>
          </View>
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
    marginVertical: 18,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Theme.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: Theme.white,
    borderRadius: 20,
    padding: 22,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
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
    fontWeight: '500',
  },
  demoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 12,
    marginBottom: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: Theme.primaryLight,
    borderRadius: 8,
  },
  demoFillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.primary,
  },
  submitBtn: {
    backgroundColor: Theme.primary,
    height: 52,
    borderRadius: 12,
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
  noticeCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 18,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.secondary,
  },
  noticeText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 20,
  },
});
