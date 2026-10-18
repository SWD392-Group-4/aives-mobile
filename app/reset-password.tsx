import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Theme } from '@/constants/Colors';
import { resetPassword, forgotPassword } from '@/services/authService';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();

  const [email, setEmail] = useState(params.email || '');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  // Đồng hồ đếm ngược hiệu lực 5 phút (300 giây)
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(300);

  // Cooldown gửi lại mã (60 giây)
  const [resendCooldown, setResendCooldown] = useState(60);

  useEffect(() => {
    if (params.email) {
      setEmail(params.email);
    }
  }, [params.email]);

  // Timer đếm ngược hiệu lực OTP (5 phút)
  useEffect(() => {
    if (otpExpirySeconds <= 0) return;
    const interval = setInterval(() => {
      setOtpExpirySeconds((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpExpirySeconds]);

  // Timer cooldown gửi lại mã OTP (60s)
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleResendOtp = async () => {
    const targetEmail = email.trim().toLowerCase();
    if (!targetEmail) {
      Alert.alert('Chưa có email', 'Vui lòng nhập địa chỉ email nhận mã OTP.');
      return;
    }

    setResending(true);
    try {
      await forgotPassword(targetEmail);
      setOtpExpirySeconds(300); // Đặt lại 5 phút
      setResendCooldown(60);    // Cooldown 60s
      Alert.alert(
        'Đã gửi lại mã OTP',
        `Mã OTP mới đã được gửi đến email ${targetEmail}. Vui lòng kiểm tra hộp thư.`
      );
    } catch (err: any) {
      Alert.alert(
        'Không thể gửi lại mã',
        err.message || 'Lỗi gửi lại mã OTP. Vui lòng thử lại sau.'
      );
    } finally {
      setResending(false);
    }
  };

  const handleResetPassword = async () => {
    const targetEmail = email.trim().toLowerCase();
    const normalizedOtp = otpCode.trim();

    if (!targetEmail) {
      Alert.alert('Lỗi', 'Vui lòng nhập email nhận mã xác thực.');
      return;
    }

    if (!/^\d{6}$/.test(normalizedOtp)) {
      Alert.alert('Lỗi nhập liệu', 'Mã xác thực OTP phải gồm đúng 6 chữ số.');
      return;
    }

    if (otpExpirySeconds <= 0) {
      Alert.alert(
        'Mã OTP hết hiệu lực',
        'Mã OTP đã hết thời hạn 5 phút. Vui lòng bấm "Chưa nhận được mã? Gửi lại" để nhận mã mới.'
      );
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Lỗi nhập liệu', 'Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi nhập liệu', 'Mật khẩu xác nhận không khớp với mật khẩu mới.');
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({
        email: targetEmail,
        otpCode: normalizedOtp,
        newPassword,
      });

      Alert.alert(
        'Đổi mật khẩu thành công! 🎉',
        'Mật khẩu tài khoản của bạn đã được cập nhật thành công. Vui lòng đăng nhập với mật khẩu mới.',
        [
          {
            text: 'Đăng nhập ngay',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert(
        'Đặt lại mật khẩu thất bại',
        err.message || 'Mã OTP không chính xác hoặc đã hết hạn. Vui lòng kiểm tra lại.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color={Theme.text} />
          </TouchableOpacity>

          <View style={styles.logoBadge}>
            <MaterialIcons name="vpn-key" size={38} color={Theme.primary} />
          </View>
          <Text style={styles.brandTitle}>AIVES</Text>
          <Text style={styles.pageTitle}>Đặt Lại Mật Khẩu</Text>
          <Text style={styles.subTitle}>
            Tạo mật khẩu an toàn mới cho tài khoản sinh viên FPT của bạn
          </Text>
        </View>

        {/* Email Highlight Card */}
        <View style={styles.emailBadgeCard}>
          <MaterialIcons name="mark-email-read" size={20} color={Theme.primary} />
          <View style={styles.emailBadgeContent}>
            <Text style={styles.emailBadgeLabel}>Mã OTP được gửi đến:</Text>
            <Text style={styles.emailBadgeValue} numberOfLines={1}>
              {email || 'Chưa xác định'}
            </Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          {/* Email input nếu chưa có sẵn */}
          {!params.email && (
            <>
              <Text style={styles.label}>Email tài khoản</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="mail-outline" size={20} color={Theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="VD: student@fpt.edu.vn"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </>
          )}

          {/* OTP 6 số + Timer 5 phút */}
          <View style={styles.otpLabelRow}>
            <Text style={styles.label}>Mã xác thực OTP (6 số) *</Text>
            <View
              style={[
                styles.timerBadge,
                otpExpirySeconds <= 60 && styles.timerBadgeWarning,
              ]}
            >
              <MaterialIcons
                name="schedule"
                size={14}
                color={otpExpirySeconds <= 60 ? Theme.danger : Theme.warning}
              />
              <Text
                style={[
                  styles.timerText,
                  otpExpirySeconds <= 60 && styles.timerTextWarning,
                ]}
              >
                Hiệu lực: {formatTime(otpExpirySeconds)}
              </Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="pin" size={20} color={Theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="VD: 123456"
              placeholderTextColor="#94A3B8"
              value={otpCode}
              onChangeText={setOtpCode}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>

          {/* Nút gửi lại OTP */}
          <View style={styles.resendRow}>
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={resendCooldown > 0 || resending}
              style={styles.resendBtn}
              activeOpacity={0.7}
            >
              {resending ? (
                <ActivityIndicator size="small" color={Theme.primary} />
              ) : (
                <Text
                  style={[
                    styles.resendText,
                    resendCooldown > 0 && styles.resendTextDisabled,
                  ]}
                >
                  {resendCooldown > 0
                    ? `Chưa nhận được mã? Gửi lại (${resendCooldown}s)`
                    : 'Chưa nhận được mã? Gửi lại'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Mật khẩu mới */}
          <Text style={styles.label}>Mật khẩu mới *</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock-outline" size={20} color={Theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Tối thiểu 6 ký tự"
              placeholderTextColor="#94A3B8"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
              <MaterialIcons
                name={showNewPassword ? 'visibility-off' : 'visibility'}
                size={20}
                color={Theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Xác nhận mật khẩu mới */}
          <Text style={styles.label}>Xác nhận mật khẩu mới *</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock-reset" size={20} color={Theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu mới"
              placeholderTextColor="#94A3B8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <MaterialIcons
                name={showConfirmPassword ? 'visibility-off' : 'visibility'}
                size={20}
                color={Theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Nút Xác nhận đổi mật khẩu */}
          <TouchableOpacity
            style={[styles.submitBtn, submitting && { opacity: 0.8 }]}
            onPress={handleResetPassword}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color={Theme.white} />
            ) : (
              <View style={styles.btnRow}>
                <Text style={styles.submitBtnText}>Xác nhận đổi mật khẩu</Text>
                <MaterialIcons name="check-circle" size={18} color={Theme.white} />
              </View>
            )}
          </TouchableOpacity>

          {/* Quay lại đăng nhập */}
          <TouchableOpacity
            style={styles.loginLinkContainer}
            onPress={() => router.replace('/login')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={16} color={Theme.primary} />
            <Text style={styles.loginLinkText}>Quay lại Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 48 : 28,
    paddingBottom: 36,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.white,
    borderWidth: 1,
    borderColor: Theme.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 2,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Theme.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Theme.text,
    letterSpacing: 1.5,
  },
  pageTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: Theme.primary,
    marginTop: 4,
  },
  subTitle: {
    fontSize: 13,
    color: Theme.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  emailBadgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 12,
  },
  emailBadgeContent: {
    flex: 1,
  },
  emailBadgeLabel: {
    fontSize: 11,
    color: Theme.textSecondary,
    fontWeight: '500',
  },
  emailBadgeValue: {
    fontSize: 14,
    color: Theme.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  card: {
    backgroundColor: Theme.white,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: Theme.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  otpLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginTop: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.text,
    marginBottom: 6,
    marginTop: 10,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  timerBadgeWarning: {
    backgroundColor: '#FEE2E2',
  },
  timerText: {
    fontSize: 12,
    color: Theme.warning,
    fontWeight: '700',
  },
  timerTextWarning: {
    color: Theme.danger,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: Theme.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Theme.text,
  },
  eyeIcon: {
    padding: 4,
  },
  resendRow: {
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 2,
  },
  resendBtn: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  resendText: {
    fontSize: 12,
    color: Theme.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  resendTextDisabled: {
    color: Theme.textSecondary,
    textDecorationLine: 'none',
  },
  submitBtn: {
    backgroundColor: Theme.primary,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    elevation: 2,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: Theme.white,
    fontSize: 15,
    fontWeight: '700',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    marginTop: 8,
  },
  loginLinkText: {
    color: Theme.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
