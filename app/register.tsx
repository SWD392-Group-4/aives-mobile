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
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/Colors';
import { sendRegistrationOtp, register } from '@/services/authService';

export default function RegisterScreen() {
  const router = useRouter();

  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Bộ đếm ngược 60 giây khi gửi OTP
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const interval = setInterval(() => {
      setOtpCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpCooldown]);

  const isValidEmail = (value: string): boolean => {
    const trimmed = value.trim().toLowerCase();
    return trimmed.endsWith('@fpt.edu.vn') || trimmed.endsWith('@fe.edu.vn');
  };

  const handleSendOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      Alert.alert('Chưa nhập email', 'Vui lòng nhập địa chỉ email trường của bạn.');
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      Alert.alert(
        'Email không hợp lệ',
        'Vui lòng sử dụng email trường Đại học FPT có đuôi @fpt.edu.vn hoặc @fe.edu.vn'
      );
      return;
    }

    setSendingOtp(true);
    try {
      await sendRegistrationOtp(normalizedEmail);
      setOtpCooldown(60);
      Alert.alert(
        'Mã OTP đã được gửi',
        `Mã xác thực 6 số đã được gửi đến email ${normalizedEmail}. Vui lòng kiểm tra hộp thư đến (hoặc hòm thư Spam) và nhập vào form bên dưới.`
      );
    } catch (err: any) {
      Alert.alert(
        'Không thể gửi mã OTP',
        err.message || 'Lỗi gửi mã OTP. Vui lòng thử lại sau.'
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const handleRegister = async () => {
    const normalizedStudentId = studentId.trim().toUpperCase();
    const normalizedFullName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otp.trim();

    // 1. Kiểm tra MSSV
    if (!normalizedStudentId) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập Mã số sinh viên (VD: SE170123).');
      return;
    }

    // 2. Kiểm tra Họ và tên
    if (!normalizedFullName || normalizedFullName.length < 2) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập đầy đủ Họ và tên của bạn.');
      return;
    }

    // 3. Kiểm tra Email trường
    if (!isValidEmail(normalizedEmail)) {
      Alert.alert(
        'Email không hợp lệ',
        'Email sinh viên bắt buộc phải có đuôi @fpt.edu.vn hoặc @fe.edu.vn'
      );
      return;
    }

    // 4. Kiểm tra OTP
    if (!/^\d{6}$/.test(normalizedOtp)) {
      Alert.alert('Lỗi nhập liệu', 'Mã xác thực OTP phải gồm đúng 6 chữ số.');
      return;
    }

    // 5. Kiểm tra Mật khẩu
    if (!password || password.length < 6) {
      Alert.alert('Lỗi nhập liệu', 'Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    // 6. Kiểm tra Xác nhận mật khẩu
    if (password !== confirmPassword) {
      Alert.alert('Lỗi nhập liệu', 'Mật khẩu xác nhận không khớp với mật khẩu đã nhập.');
      return;
    }

    setSubmitting(true);
    try {
      // Gọi API đăng ký
      await register({
        email: normalizedEmail,
        fullName: normalizedFullName,
        password,
        otp: normalizedOtp,
      });

      Alert.alert(
        'Đăng ký thành công! 🎉',
        `Tài khoản sinh viên ${normalizedStudentId} (${normalizedFullName}) đã được kích hoạt thành công. Vui lòng đăng nhập để bắt đầu.`,
        [
          {
            text: 'Đăng nhập ngay',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert(
        'Đăng ký không thành công',
        err.message || 'Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng kiểm tra lại thông tin.'
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
        {/* Top Header & Logo */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color={Theme.text} />
          </TouchableOpacity>

          <View style={styles.logoBadge}>
            <MaterialIcons name="how-to-reg" size={38} color={Theme.primary} />
          </View>
          <Text style={styles.brandTitle}>AIVES</Text>
          <Text style={styles.pageTitle}>Đăng Ký Tài Khoản Sinh Viên</Text>
          <Text style={styles.subTitle}>
            Hệ thống Vấn đáp & Đánh giá Trực tuyến Đại học FPT
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Thông tin đăng ký</Text>

          {/* 1. Mã số sinh viên */}
          <Text style={styles.label}>Mã số sinh viên *</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="badge" size={20} color={Theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="VD: SE170123"
              placeholderTextColor="#94A3B8"
              value={studentId}
              onChangeText={setStudentId}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>

          {/* 2. Họ và tên đầy đủ */}
          <Text style={styles.label}>Họ và tên đầy đủ *</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="person-outline" size={20} color={Theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="VD: Nguyễn Văn A"
              placeholderTextColor="#94A3B8"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* 3. Email trường & Hàng gửi OTP */}
          <Text style={styles.label}>Email trường FPT *</Text>
          <View style={styles.emailRow}>
            <View style={[styles.inputContainer, styles.emailInputFlex]}>
              <MaterialIcons name="mail-outline" size={20} color={Theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="VD: sinhviense170123@fpt.edu.vn"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.otpSendBtn,
                (otpCooldown > 0 || sendingOtp) && styles.otpSendBtnDisabled,
              ]}
              onPress={handleSendOtp}
              disabled={otpCooldown > 0 || sendingOtp}
              activeOpacity={0.8}
            >
              {sendingOtp ? (
                <ActivityIndicator size="small" color={Theme.white} />
              ) : (
                <Text style={styles.otpSendBtnText}>
                  {otpCooldown > 0 ? `${otpCooldown}s` : 'Gửi mã OTP'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.hintText}>
            Yêu cầu sử dụng đuôi @fpt.edu.vn hoặc @fe.edu.vn
          </Text>

          {/* 4. Ô nhập mã OTP 6 số */}
          <Text style={styles.label}>Mã xác thực OTP (6 chữ số) *</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="pin" size={20} color={Theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="VD: 123456"
              placeholderTextColor="#94A3B8"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
            />
            {otpCooldown > 0 && (
              <View style={styles.otpTimerBadge}>
                <MaterialIcons name="timer" size={14} color={Theme.accent} />
                <Text style={styles.otpTimerText}>{otpCooldown}s</Text>
              </View>
            )}
          </View>

          {/* 5. Mật khẩu */}
          <Text style={styles.label}>Mật khẩu *</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock-outline" size={20} color={Theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Tối thiểu 6 ký tự"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <MaterialIcons
                name={showPassword ? 'visibility-off' : 'visibility'}
                size={20}
                color={Theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* 6. Xác nhận mật khẩu */}
          <Text style={styles.label}>Xác nhận mật khẩu *</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock-reset" size={20} color={Theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu"
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

          {/* Nút Hoàn tất đăng ký */}
          <TouchableOpacity
            style={[styles.submitBtn, submitting && { opacity: 0.8 }]}
            onPress={handleRegister}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color={Theme.white} />
            ) : (
              <View style={styles.btnRow}>
                <Text style={styles.submitBtnText}>Hoàn tất đăng ký</Text>
                <MaterialIcons name="check-circle-outline" size={20} color={Theme.white} />
              </View>
            )}
          </TouchableOpacity>

          {/* Footer: Đã có tài khoản? Đăng nhập ngay */}
          <TouchableOpacity
            style={styles.loginLinkContainer}
            onPress={() => router.replace('/login')}
            activeOpacity={0.7}
          >
            <Text style={styles.loginLinkPrompt}>Đã có tài khoản? </Text>
            <Text style={styles.loginLinkHighlight}>Đăng nhập ngay</Text>
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
    marginBottom: 20,
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
    paddingHorizontal: 20,
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
  cardHeader: {
    fontSize: 17,
    fontWeight: '700',
    color: Theme.text,
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.text,
    marginBottom: 6,
    marginTop: 10,
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
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emailInputFlex: {
    flex: 1,
  },
  otpSendBtn: {
    backgroundColor: Theme.primary,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 96,
  },
  otpSendBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  otpSendBtnText: {
    color: Theme.white,
    fontSize: 13,
    fontWeight: '700',
  },
  hintText: {
    fontSize: 11,
    color: Theme.textSecondary,
    marginTop: 4,
    marginLeft: 2,
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
  otpTimerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  otpTimerText: {
    fontSize: 12,
    color: Theme.warning,
    fontWeight: '700',
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
    paddingVertical: 16,
    marginTop: 8,
  },
  loginLinkPrompt: {
    color: Theme.textSecondary,
    fontSize: 14,
  },
  loginLinkHighlight: {
    color: Theme.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
