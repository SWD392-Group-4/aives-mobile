import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/Colors';

export default function HomeScreen() {
  const router = useRouter();

  const quickStats = [
    { label: 'Phòng thi sắp tới', count: '1', icon: 'event-available', color: Theme.primary },
    { label: 'Đã hoàn thành', count: '4', icon: 'assignment-turned-in', color: Theme.success },
    { label: 'Điểm TB', count: '8.6', icon: 'military-tech', color: Theme.accent },
  ];

  const recentSessions = [
    {
      id: 'AIVES_EXAM_2026_094201',
      title: 'Kiểm tra vấn đáp Kiến trúc phần mềm',
      course: 'SWD392 - SE1701',
      date: 'Hôm nay, 14:00 - 14:30',
      status: 'Sắp diễn ra',
      statusColor: Theme.warning,
      type: 'AI Viva Voice',
    },
    {
      id: 'AIVES_EXAM_2026_081120',
      title: 'Vấn đáp Thực hành Web Frontend',
      course: 'FER202 - SE1701',
      date: '08/10/2026',
      status: 'Đã có điểm: 9.0',
      statusColor: Theme.success,
      type: 'Đã chấm AI & GV duyệt',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* User Greeting Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greetingSub}>Xin chào mừng,</Text>
            <Text style={styles.userName}>Nguyễn Văn Cường 👋</Text>
          </View>
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => router.push('/login')}
          >
            <MaterialIcons name="account-circle" size={40} color={Theme.primary} />
          </TouchableOpacity>
        </View>

        {/* Hero Join Exam Card */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <View style={styles.tagBadge}>
              <MaterialIcons name="bolt" size={14} color="#F59E0B" />
              <Text style={styles.tagText}>Vào phòng thi nhanh</Text>
            </View>
            <Text style={styles.heroTitle}>Tham gia ca thi vấn đáp AI</Text>
            <Text style={styles.heroDesc}>
              Nhập mã ca thi và mã Passcode được cấp bởi giảng viên để bắt đầu.
            </Text>

            <TouchableOpacity
              style={styles.joinActionBtn}
              onPress={() => router.push('/(tabs)/two')}
            >
              <Text style={styles.joinActionText}>Nhập mã phòng thi</Text>
              <MaterialIcons name="arrow-forward" size={16} color={Theme.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <Text style={styles.sectionTitle}>Tổng quan học tập</Text>
        <View style={styles.statsRow}>
          {quickStats.map((stat, idx) => (
            <View key={idx} style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: `${stat.color}15` }]}>
                <MaterialIcons name={stat.icon as any} size={22} color={stat.color} />
              </View>
              <Text style={styles.statCount}>{stat.count}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent Exams Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Ca thi gần đây</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {recentSessions.map((session) => (
          <View key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionTop}>
              <View style={styles.badgeCode}>
                <Text style={styles.badgeCodeText}>{session.course}</Text>
              </View>
              <Text style={[styles.statusBadge, { color: session.statusColor }]}>
                {session.status}
              </Text>
            </View>

            <Text style={styles.sessionTitle}>{session.title}</Text>

            <View style={styles.sessionMeta}>
              <MaterialIcons name="schedule" size={14} color={Theme.textSecondary} />
              <Text style={styles.sessionMetaText}>{session.date}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.sessionFooter}>
              <View style={styles.sessionType}>
                <MaterialIcons name="mic" size={14} color={Theme.primary} />
                <Text style={styles.sessionTypeText}>{session.type}</Text>
              </View>
              <TouchableOpacity
                style={styles.detailBtn}
                onPress={() => router.push('/results')}
              >
                <Text style={styles.detailBtnText}>Chi tiết</Text>
                <MaterialIcons name="chevron-right" size={16} color={Theme.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
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
    flex: 1,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  greetingSub: {
    fontSize: 13,
    color: Theme.textSecondary,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.text,
  },
  avatarBtn: {
    padding: 2,
  },
  heroBanner: {
    backgroundColor: Theme.primary,
    borderRadius: 20,
    padding: 20,
    marginVertical: 12,
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  heroContent: {
    alignItems: 'flex-start',
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
    marginBottom: 10,
  },
  tagText: {
    color: Theme.white,
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.white,
    marginBottom: 6,
  },
  heroDesc: {
    fontSize: 13,
    color: '#DBEAFE',
    lineHeight: 18,
    marginBottom: 16,
  },
  joinActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  joinActionText: {
    color: Theme.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Theme.text,
    marginVertical: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: Theme.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.border,
    elevation: 1,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCount: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.text,
  },
  statLabel: {
    fontSize: 11,
    color: Theme.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  seeAllText: {
    fontSize: 13,
    color: Theme.primary,
    fontWeight: '600',
  },
  sessionCard: {
    backgroundColor: Theme.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Theme.border,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sessionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeCode: {
    backgroundColor: Theme.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeCodeText: {
    color: Theme.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '700',
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.text,
    marginBottom: 6,
  },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sessionMetaText: {
    fontSize: 12,
    color: Theme.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.border,
    marginBottom: 12,
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sessionTypeText: {
    fontSize: 12,
    color: Theme.textSecondary,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailBtnText: {
    fontSize: 13,
    color: Theme.primary,
    fontWeight: '700',
  },
});
