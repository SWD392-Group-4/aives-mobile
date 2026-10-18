import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/Colors';
import { logout } from '@/services/authService';

export default function ProfileTabScreen() {
  const router = useRouter();

  // Settings states
  const [autoTTS, setAutoTTS] = useState(true);
  const [noiseSuppression, setNoiseSuppression] = useState(true);
  const [autoVadSilence, setAutoVadSilence] = useState(true);
  const [waveformVisualizer, setWaveformVisualizer] = useState(true);

  // Change password modal states
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingPass, setLoadingPass] = useState(false);

  // Logout handler
  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất tài khoản',
      'Bạn có chắc chắn muốn đăng xuất khỏi AIVES Mobile?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (err) {
              console.log('Logout error', err);
            } finally {
              router.replace('/login');
            }
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    if (!currentPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu hiện tại');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có tối thiểu 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Xác nhận mật khẩu mới không trùng khớp');
      return;
    }

    setLoadingPass(true);
    setTimeout(() => {
      setLoadingPass(false);
      setPasswordModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Thành công', 'Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới của bạn.');
    }, 700);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hồ Sơ Cá Nhân</Text>
          <Text style={styles.headerSub}>Thông tin thí sinh & thiết lập khảo thí</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>NC</Text>
            <View style={styles.onlineBadge} />
          </View>

          <Text style={styles.userName}>Nguyễn Văn Cường</Text>
          <Text style={styles.userRole}>Sinh viên FPT University</Text>

          <View style={styles.infoPillsRow}>
            <View style={styles.infoPill}>
              <MaterialIcons name="badge" size={14} color={Theme.primary} />
              <Text style={styles.infoPillText}>MSSV: ST180293</Text>
            </View>
            <View style={[styles.infoPill, { backgroundColor: '#ECFDF5' }]}>
              <MaterialIcons name="code" size={14} color="#059669" />
              <Text style={[styles.infoPillText, { color: '#059669' }]}>Ngành: KTPM (SE)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Detailed Info List */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email trường:</Text>
            <Text style={styles.detailValue}>cuongnvse180293@fpt.edu.vn</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Lớp sinh hoạt:</Text>
            <Text style={styles.detailValue}>SE1802 - Khóa K18</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Kỳ học hiện tại:</Text>
            <Text style={styles.detailValue}>Học kỳ Fall 2026</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cơ sở đào tạo:</Text>
            <Text style={styles.detailValue}>FPT University Đà Nẵng</Text>
          </View>
        </View>

        {/* Security & Authentication */}
        <Text style={styles.sectionTitle}>Bảo mật & Tài khoản</Text>
        <View style={styles.settingsGroup}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setPasswordModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
                <MaterialIcons name="lock-outline" size={20} color={Theme.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Đổi mật khẩu</Text>
                <Text style={styles.settingSub}>Cập nhật mật khẩu định kỳ để an toàn</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.groupDivider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#ECFDF5' }]}>
                <MaterialIcons name="verified-user" size={20} color="#059669" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Xác thực 2 bước (2FA)</Text>
                <Text style={styles.settingSub}>Bảo vệ qua OTP Email trường</Text>
              </View>
            </View>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>Đã bật</Text>
            </View>
          </View>
        </View>

        {/* Audio & Device Settings */}
        <Text style={styles.sectionTitle}>Cấu hình Âm thanh & Khảo thí</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#F5F3FF' }]}>
                <MaterialIcons name="record-voice-over" size={20} color="#7C3AED" />
              </View>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.settingTitle}>Giọng đọc AI tự động (TTS)</Text>
                <Text style={styles.settingSub}>Tự động phát âm thanh câu hỏi khi chuyển câu</Text>
              </View>
            </View>
            <Switch
              value={autoTTS}
              onValueChange={setAutoTTS}
              trackColor={{ false: '#CBD5E1', true: Theme.primary }}
              thumbColor={Theme.white}
            />
          </View>

          <View style={styles.groupDivider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                <MaterialIcons name="noise-control-off" size={20} color="#D97706" />
              </View>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.settingTitle}>Khử tiếng ồn Micro (AI Filter)</Text>
                <Text style={styles.settingSub}>Lọc tạp âm và tiếng vọng từ môi trường xung quanh</Text>
              </View>
            </View>
            <Switch
              value={noiseSuppression}
              onValueChange={setNoiseSuppression}
              trackColor={{ false: '#CBD5E1', true: Theme.primary }}
              thumbColor={Theme.white}
            />
          </View>

          <View style={styles.groupDivider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
                <MaterialIcons name="graphic-eq" size={20} color={Theme.primary} />
              </View>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.settingTitle}>Sóng âm thanh trực quan</Text>
                <Text style={styles.settingSub}>Hiển thị thanh dao động giọng nói khi trả lời</Text>
              </View>
            </View>
            <Switch
              value={waveformVisualizer}
              onValueChange={setWaveformVisualizer}
              trackColor={{ false: '#CBD5E1', true: Theme.primary }}
              thumbColor={Theme.white}
            />
          </View>

          <View style={styles.groupDivider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#F0FDFA' }]}>
                <MaterialIcons name="timelapse" size={20} color="#0D9488" />
              </View>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.settingTitle}>Tự ngắt khi im lặng ≥ 10s</Text>
                <Text style={styles.settingSub}>Quy tắc BR-VIVA-003 chống treo mic</Text>
              </View>
            </View>
            <Switch
              value={autoVadSilence}
              onValueChange={setAutoVadSilence}
              trackColor={{ false: '#CBD5E1', true: Theme.primary }}
              thumbColor={Theme.white}
            />
          </View>
        </View>

        {/* App Info & About */}
        <Text style={styles.sectionTitle}>Thông tin ứng dụng</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#F1F5F9' }]}>
                <MaterialIcons name="info-outline" size={20} color="#64748B" />
              </View>
              <View>
                <Text style={styles.settingTitle}>Phiên bản AIVES Mobile</Text>
                <Text style={styles.settingSub}>Phiên bản v1.2.0 • Build 2026.10</Text>
              </View>
            </View>
            <Text style={styles.versionTag}>Mới nhất</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <MaterialIcons name="logout" size={20} color="#EF4444" />
          <Text style={styles.logoutBtnText}>Đăng xuất khỏi thiết bị</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal Change Password */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Đổi Mật Khẩu</Text>
              <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={Theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Mật khẩu hiện tại</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nhập mật khẩu đang dùng"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <Text style={styles.inputLabel}>Mật khẩu mới</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Tối thiểu 6 ký tự"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <Text style={styles.inputLabel}>Xác nhận mật khẩu mới</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nhập lại mật khẩu mới"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              style={[styles.savePassBtn, loadingPass && { opacity: 0.7 }]}
              onPress={handleChangePassword}
              disabled={loadingPass}
            >
              {loadingPass ? (
                <ActivityIndicator color={Theme.white} />
              ) : (
                <Text style={styles.savePassBtnText}>Lưu Thay Đổi</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 18,
  },
  header: {
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Theme.text,
  },
  headerSub: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginTop: 2,
  },
  profileCard: {
    backgroundColor: Theme.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.border,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  avatarLarge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarLargeText: {
    color: Theme.white,
    fontSize: 26,
    fontWeight: '900',
  },
  onlineBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2.5,
    borderColor: Theme.white,
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  userName: {
    fontSize: 19,
    fontWeight: '800',
    color: Theme.text,
  },
  userRole: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  infoPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Theme.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  infoPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.primary,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Theme.border,
    marginVertical: 10,
  },
  detailRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  detailLabel: {
    fontSize: 12,
    color: Theme.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
    color: Theme.text,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.text,
    marginBottom: 10,
    marginTop: 10,
  },
  settingsGroup: {
    backgroundColor: Theme.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Theme.border,
    overflow: 'hidden',
    marginBottom: 14,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.text,
  },
  settingSub: {
    fontSize: 11,
    color: Theme.textSecondary,
    marginTop: 1,
  },
  groupDivider: {
    height: 1,
    backgroundColor: Theme.border,
    marginLeft: 62,
  },
  activeTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeTagText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
  },
  versionTag: {
    fontSize: 11,
    fontWeight: '700',
    color: Theme.primary,
    backgroundColor: Theme.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginTop: 8,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#EF4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Theme.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.text,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.text,
    marginBottom: 6,
    marginTop: 10,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: Theme.border,
    fontSize: 13,
    color: Theme.text,
  },
  savePassBtn: {
    backgroundColor: Theme.primary,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  savePassBtnText: {
    color: Theme.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
