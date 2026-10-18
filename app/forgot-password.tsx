import React, { useState } from 'react';
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
import { forgotPassword } from '@/services/authService';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      Alert.alert('Chưa nhập email', 'Vui lòng nhập địa chỉ email tài khoản trường của bạn.');
      return;
    }

    if (!normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
      Alert.alert('Email không hợp lệ', 'Vui lòng nhập đúng định dạng email (VD: student@fpt.edu.vn).');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(normalizedEmail);
      Alert.alert(
        'Đã gửi mã xác thực',
        `Mã OTP đặt lại mật khẩu đã được gửi đến ${normalizedEmail}. Vui lòng kiểm tra email và nhập mã để tạo mật khẩu mới.`,
        [
          {
            text: 'Tiếp tục',
            onPress: () => {
              router.push({
                pathname: '/reset-password',
                params: { email: normalizedEmail },
              });
            },
          },
        ]
      );
    } catch (err: any) {
      Alert.alert(
        'Lỗi gửi mã OTP',
        err.message || 'Không thể gửi mã xác thực. Vui lòng kiểm tra lại email hoặc kết nối mạng.'
      );
    } finally {
      setLoading(false);
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
            <MaterialIcons name="lock-reset" size={40} color={Theme.primary} />
          </View>
          <Text style={styles.brandTitle}>AIVES</Text>
          <Text style={styles.pageTitle}>Khôi Phục Mật Khẩu</Text>
          <Text style={styles.instructionText}>
            Nhập địa chỉ email trường của bạn để nhận mã xác thực OTP đặt lại mật khẩu.
          </Text>
        </View>

        {/* Card Form */}
        <View style={styles.card}>
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
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, loading && { opacity: 0.8 }]}
            onPress={handleSendOtp}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={Theme.white} />
            ) : (
              <View style={styles.btnRow}>
                <Text style={styles.submitBtnText}>Gửi mã OTP đặt lại mật khẩu</Text>
                <MaterialIcons name="send" size={18} color={Theme.white} />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backToLoginBtn}
            onPress={() => router.replace('/login')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={16} color={Theme.primary} />
            <Text style={styles.backToLoginText}>Quay lại đăng nhập</Text>
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
    justifyContent: 'center',
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 48 : 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Theme.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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
    fontSize: 20,
    fontWeight: '700',
    color: Theme.primary,
    marginTop: 6,
  },
  instructionText: {
    fontSize: 13,
    color: Theme.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
    lineHeight: 20,
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.text,
    marginBottom: 8,
  },
  inputContainer: {
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
    fontSize: 14,
    color: Theme.text,
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
  backToLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    marginTop: 10,
  },
  backToLoginText: {
    color: Theme.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
