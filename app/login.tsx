import React, { useState, useEffect, useRef } from 'react';
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
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Theme } from '@/constants/Colors';
import { login, loginWithGoogle } from '@/services/authService';
import { API_BASE_URL } from '@/services/apiClient';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('student@aives.edu.vn');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'LECTURER'>('STUDENT');
  const isProcessingGoogle = useRef(false);

  const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: googleClientId,
    webClientId: googleClientId,
    androidClientId: googleClientId,
    iosClientId: googleClientId,
  });

  const processGoogleToken = async (idToken: string) => {
    if (isProcessingGoogle.current) return;
    isProcessingGoogle.current = true;
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle(idToken);
      Alert.alert(
        'Đăng nhập Google thành công',
        `Chào mừng ${res.user.fullName || res.user.email} (${res.user.role})!`,
        [
          {
            text: 'Tiếp tục',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
      if (Platform.OS === 'web') {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      Alert.alert(
        'Đăng nhập Google thất bại',
        err.message || 'Lỗi xác thực Google với hệ thống AIVES.'
      );
    } finally {
      setGoogleLoading(false);
      isProcessingGoogle.current = false;
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.params?.id_token;
      if (idToken && !isProcessingGoogle.current) {
        processGoogleToken(idToken);
      }
    } else if (response?.type === 'error') {
      Alert.alert(
        'Đăng nhập Google thất bại',
        response.error?.message || 'Có lỗi xảy ra khi xác thực với Google.'
      );
    }
  }, [response]);

  const handleGoogleLogin = async () => {
    if (!request) {
      Alert.alert('Thông báo', 'Đang kết nối dịch vụ Google Auth, vui lòng thử lại sau giây lát.');
      return;
    }

    setGoogleLoading(true);
    try {
      const res = await promptAsync();
      if (res?.type === 'success') {
        const idToken = res.params?.id_token;
        if (idToken) {
          await processGoogleToken(idToken);
        }
      } else if (res?.type === 'error') {
        Alert.alert(
          'Đăng nhập Google thất bại',
          res.error?.message || 'Đã xảy ra lỗi trong quá trình xác thực với Google.'
        );
      }
    } catch (err: any) {
      Alert.alert('Đăng nhập Google thất bại', err.message || 'Không thể mở cửa sổ đăng nhập Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ Email và Mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email: email.trim(), password });
      Alert.alert(
        'Đăng nhập thành công',
        `Chào mừng ${res.user.fullName || res.user.email} (${res.user.role})!`,
        [
          {
            text: 'Tiếp tục',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert(
        'Đăng nhập thất bại',
        err.message || 'Lỗi xác thực với Backend API. Vui lòng kiểm tra lại tài khoản hoặc kết nối Dev Tunnel.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role: 'STUDENT' | 'LECTURER' | 'ADMIN') => {
    setSelectedRole(role === 'ADMIN' ? 'LECTURER' : role);
    if (role === 'STUDENT') {
      setEmail('testmobile@fpt.edu.vn');
      setPassword('Password@123');
    } else if (role === 'LECTURER') {
      setEmail('lamnn@fe.edu.vn');
      setPassword('Aives@123');
    } else {
      setEmail('admin@aives.local');
      setPassword('Aives@123');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header & Logo */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <MaterialIcons name="school" size={40} color={Theme.primary} />
          </View>
          <Text style={styles.brandTitle}>AIVES</Text>
          <Text style={styles.subTitle}>Hệ thống Vấn đáp & Đánh giá Trực tuyến với AI</Text>
          <View style={styles.endpointBadge}>
            <MaterialIcons name="cloud-queue" size={14} color={Theme.primary} />
            <Text style={styles.endpointText} numberOfLines={1}>
              API: {API_BASE_URL}
            </Text>
          </View>
        </View>

        {/* Role Toggle Selector */}
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleTab, selectedRole === 'STUDENT' && styles.roleTabActive]}
            onPress={() => handleQuickFill('STUDENT')}
          >
            <MaterialIcons
              name="person"
              size={18}
              color={selectedRole === 'STUDENT' ? Theme.primary : Theme.textSecondary}
            />
            <Text style={[styles.roleText, selectedRole === 'STUDENT' && styles.roleTextActive]}>
              Sinh viên
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleTab, selectedRole === 'LECTURER' && styles.roleTabActive]}
            onPress={() => handleQuickFill('LECTURER')}
          >
            <MaterialIcons
              name="psychology"
              size={18}
              color={selectedRole === 'LECTURER' ? Theme.primary : Theme.textSecondary}
            />
            <Text style={[styles.roleText, selectedRole === 'LECTURER' && styles.roleTextActive]}>
              Giảng viên
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Đăng nhập Backend</Text>

          {/* Email Input */}
          <Text style={styles.label}>Email tài khoản</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="mail-outline" size={20} color={Theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="VD: student@aives.edu.vn"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <Text style={styles.label}>Mật khẩu</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock-outline" size={20} color={Theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <MaterialIcons
                name={showPassword ? 'visibility-off' : 'visibility'}
                size={20}
                color={Theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password Link */}
          <View style={styles.forgotPasswordRow}>
            <TouchableOpacity
              onPress={() => router.push('/forgot-password')}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, (loading || googleLoading) && { opacity: 0.8 }]}
            onPress={handleLogin}
            disabled={loading || googleLoading}
          >
            {loading ? (
              <ActivityIndicator color={Theme.white} />
            ) : (
              <View style={styles.btnRow}>
                <Text style={styles.submitBtnText}>Gửi yêu cầu tới API</Text>
                <MaterialIcons name="arrow-forward" size={18} color={Theme.white} />
              </View>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>HOẶC</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign-In Button */}
          <TouchableOpacity
            style={[styles.googleBtn, (loading || googleLoading) && { opacity: 0.8 }]}
            onPress={handleGoogleLogin}
            disabled={loading || googleLoading}
            activeOpacity={0.8}
          >
            {googleLoading ? (
              <ActivityIndicator color={Theme.primary} />
            ) : (
              <View style={styles.googleBtnContent}>
                <FontAwesome name="google" size={18} color="#EA4335" style={styles.googleIcon} />
                <Text style={styles.googleBtnText}>Tiếp tục với Google</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity
            style={styles.registerLinkRow}
            onPress={() => router.push('/register')}
            activeOpacity={0.7}
          >
            <Text style={styles.registerPrompt}>Chưa có tài khoản? </Text>
            <Text style={styles.registerHighlight}>Đăng ký ngay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.skipBtnText}>Bỏ qua để xem giao diện tĩnh</Text>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 26,
    fontWeight: '800',
    color: Theme.text,
    letterSpacing: 1.5,
  },
  subTitle: {
    fontSize: 13,
    color: Theme.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  endpointBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Theme.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
    maxWidth: '90%',
  },
  endpointText: {
    fontSize: 11,
    color: Theme.primary,
    fontWeight: '600',
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  roleTabActive: {
    backgroundColor: Theme.white,
    elevation: 2,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.textSecondary,
  },
  roleTextActive: {
    color: Theme.primary,
  },
  card: {
    backgroundColor: Theme.white,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: Theme.border,
    elevation: 3,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.text,
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.text,
    marginBottom: 6,
    marginTop: 8,
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
  submitBtn: {
    backgroundColor: Theme.primary,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
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
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 6,
  },
  skipBtnText: {
    color: Theme.textSecondary,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  forgotPasswordRow: {
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 4,
  },
  forgotPasswordText: {
    color: Theme.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  registerLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  registerPrompt: {
    color: Theme.textSecondary,
    fontSize: 13,
  },
  registerHighlight: {
    color: Theme.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  googleBtn: {
    backgroundColor: Theme.white,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  googleIcon: {
    marginRight: 2,
  },
  googleBtnText: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '600',
  },
});
