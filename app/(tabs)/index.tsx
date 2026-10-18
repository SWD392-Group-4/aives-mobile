import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Theme } from '@/constants/Colors';

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  const quickStats = [
    {
      label: 'Ca thi sắp tới',
      count: '1',
      unit: 'ca thi',
      icon: 'event-available',
      color: Theme.primary,
      bg: '#EFF6FF',
    },
    {
      label: 'Ca thi đã làm',
      count: '4',
      unit: 'bài thi',
      icon: 'assignment-turned-in',
      color: Theme.success,
      bg: '#ECFDF5',
    },
    {
      label: 'Điểm trung bình',
      count: '8.6',
      unit: '/10',
      icon: 'military-tech',
      color: Theme.accent,
      bg: '#FEF3C7',
    },
    {
      label: 'Phúc khảo chờ duyệt',
      count: '1',
      unit: 'đơn',
      icon: 'pending-actions',
      color: '#8B5CF6',
      bg: '#F5F3FF',
    },
  ];

  const recentSessions = [
    {
      id: 'AIVES_EXAM_2026_094201',
      title: 'Kiểm tra vấn đáp Kiến trúc phần mềm',
      courseCode: 'SWD392',
      courseName: 'Software Architecture & Design',
      date: 'Hôm nay, 14:00 - 14:30',
      status: 'Sắp diễn ra',
      statusCode: 'UPCOMING',
      badgeColor: '#F59E0B',
      badgeBg: '#FEF3C7',
      duration: '30 phút',
      format: 'AI Viva Voice',
      canJoin: true,
    },
    {
      id: 'AIVES_EXAM_2026_082015',
      title: 'Vấn đáp Lập trình .NET nâng cao',
      courseCode: 'PRN231',
      courseName: 'Building Cross-Platform .NET Apps',
      date: 'Hôm nay, 09:00 - 11:30',
      status: 'Đang diễn ra',
      statusCode: 'ONGOING',
      badgeColor: '#10B981',
      badgeBg: '#D1FAE5',
      duration: '25 phút',
      format: 'AI Viva + Voice STT',
      canJoin: true,
    },
    {
      id: 'AIVES_EXAM_2026_081120',
      title: 'Vấn đáp Thực hành Web Frontend',
      courseCode: 'FER202',
      courseName: 'Front-End Web Development',
      date: '08/10/2026',
      status: 'Đã có điểm: 9.0',
      statusCode: 'PUBLISHED',
      score: '9.0',
      badgeColor: Theme.primary,
      badgeBg: Theme.primaryLight,
      duration: '20 phút',
      format: 'Đã thẩm định HITL',
      canJoin: false,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Theme.primary]} />
        }
      >
        {/* Top Header & Student Greeting */}
        <View style={styles.topBar}>
          <View style={styles.userInfoWrapper}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>NC</Text>
            </View>
            <View>
              <Text style={styles.greetingSub}>Kỳ Fall 2026 • Sinh viên</Text>
              <Text style={styles.userName}>Nguyễn Văn Cường</Text>
              <Text style={styles.studentId}>MSSV: ST180293 (K18 SE)</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => router.push('/(tabs)/profile' as any)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="settings" size={22} color={Theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Hero Card: Quick Join */}
        <View style={styles.heroBanner}>
          <View style={styles.heroHeader}>
            <View style={styles.tagBadge}>
              <MaterialIcons name="bolt" size={14} color="#F59E0B" />
              <Text style={styles.tagText}>Vào ca thi nhanh</Text>
            </View>
            <View style={styles.livePulseBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.pulseText}>Hệ thống sẵn sàng</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Tham gia ca thi vấn đáp AI</Text>
          <Text style={styles.heroDesc}>
            Nhập mã ca thi và mã Passcode được cấp bởi giảng viên để tiến hành kiểm tra thiết bị & bắt đầu thi.
          </Text>

          <TouchableOpacity
            style={styles.joinActionBtn}
            onPress={() => router.push('/(tabs)/join')}
            activeOpacity={0.85}
          >
            <MaterialIcons name="login" size={18} color={Theme.primary} />
            <Text style={styles.joinActionText}>Nhập mã vào ca thi</Text>
            <MaterialIcons name="arrow-forward" size={16} color={Theme.primary} />
          </TouchableOpacity>
        </View>

        {/* Overview Stats Grid */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Thống kê tổng quan</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/results')}>
            <Text style={styles.seeAllText}>Chi tiết</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          {quickStats.map((stat, idx) => (
            <View key={idx} style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: stat.bg }]}>
                <MaterialIcons name={stat.icon as any} size={22} color={stat.color} />
              </View>
              <View style={styles.statNumberRow}>
                <Text style={styles.statCount}>{stat.count}</Text>
                {stat.unit && <Text style={styles.statUnit}>{stat.unit}</Text>}
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent Exams Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Ca thi gần đây</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/results')}>
            <Text style={styles.seeAllText}>Xem tất cả kết quả</Text>
          </TouchableOpacity>
        </View>

        {recentSessions.map((session) => (
          <View key={session.id} style={styles.sessionCard}>
            {/* Top row */}
            <View style={styles.sessionTop}>
              <View style={styles.badgeCode}>
                <Text style={styles.badgeCodeText}>{session.courseCode}</Text>
              </View>
              <View style={[styles.statusTag, { backgroundColor: session.badgeBg }]}>
                <Text style={[styles.statusTagText, { color: session.badgeColor }]}>
                  {session.status}
                </Text>
              </View>
            </View>

            {/* Title & Course */}
            <Text style={styles.sessionTitle}>{session.title}</Text>
            <Text style={styles.sessionCourseName}>{session.courseName}</Text>

            {/* Meta tags */}
            <View style={styles.sessionMetaRow}>
              <View style={styles.metaItem}>
                <MaterialIcons name="schedule" size={14} color={Theme.textSecondary} />
                <Text style={styles.metaText}>{session.date}</Text>
              </View>
              <View style={styles.metaItem}>
                <MaterialIcons name="timelapse" size={14} color={Theme.textSecondary} />
                <Text style={styles.metaText}>{session.duration}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Footer with action */}
            <View style={styles.sessionFooter}>
              <View style={styles.sessionFormat}>
                <MaterialIcons name="mic-none" size={16} color={Theme.textSecondary} />
                <Text style={styles.sessionFormatText}>{session.format}</Text>
              </View>

              {session.canJoin ? (
                <TouchableOpacity
                  style={styles.primaryActionBtn}
                  onPress={() => router.push('/(tabs)/join')}
                >
                  <Text style={styles.primaryActionText}>Vào ca thi</Text>
                  <MaterialIcons name="chevron-right" size={16} color={Theme.white} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.outlineActionBtn}
                  onPress={() => router.push('/(tabs)/results')}
                >
                  <Text style={styles.outlineActionText}>Xem kết quả</Text>
                  <MaterialIcons name="chevron-right" size={16} color={Theme.primary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {/* Quick Guide Card */}
        <View style={styles.guideCard}>
          <MaterialIcons name="lightbulb-outline" size={24} color="#D97706" style={styles.guideIcon} />
          <View style={styles.guideContent}>
            <Text style={styles.guideTitle}>Mẹo thi vấn đáp đạt điểm cao với AI</Text>
            <Text style={styles.guideText}>
              Nói to, rõ ràng, tập trung vào từ khóa kỹ thuật. Bạn có thể yêu cầu AI nhắc lại câu hỏi nếu chưa nghe rõ.
            </Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
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
    paddingHorizontal: 18,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  userInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarText: {
    color: Theme.white,
    fontSize: 16,
    fontWeight: '800',
  },
  greetingSub: {
    fontSize: 12,
    color: Theme.textSecondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.text,
  },
  studentId: {
    fontSize: 11,
    color: Theme.textSecondary,
    fontWeight: '600',
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.border,
  },
  heroBanner: {
    backgroundColor: Theme.primary,
    borderRadius: 20,
    padding: 18,
    marginVertical: 10,
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  tagText: {
    color: Theme.white,
    fontSize: 12,
    fontWeight: '700',
  },
  livePulseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
  },
  pulseText: {
    color: '#D1FAE5',
    fontSize: 11,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 19,
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
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  joinActionText: {
    color: Theme.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Theme.text,
  },
  seeAllText: {
    fontSize: 13,
    color: Theme.primary,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: Theme.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Theme.border,
    elevation: 1,
  },
  statIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statCount: {
    fontSize: 22,
    fontWeight: '900',
    color: Theme.text,
  },
  statUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.textSecondary,
  },
  statLabel: {
    fontSize: 12,
    color: Theme.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  sessionCard: {
    backgroundColor: Theme.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
    fontWeight: '800',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.text,
    marginBottom: 2,
  },
  sessionCourseName: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginBottom: 10,
  },
  sessionMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Theme.textSecondary,
    fontWeight: '500',
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
  sessionFormat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sessionFormatText: {
    fontSize: 12,
    color: Theme.textSecondary,
  },
  primaryActionBtn: {
    backgroundColor: Theme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 2,
  },
  primaryActionText: {
    color: Theme.white,
    fontSize: 12,
    fontWeight: '700',
  },
  outlineActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 2,
    backgroundColor: Theme.primaryLight,
  },
  outlineActionText: {
    color: Theme.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  guideCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  guideIcon: {
    marginTop: 2,
  },
  guideContent: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  guideText: {
    fontSize: 12,
    color: '#B45309',
    lineHeight: 18,
  },
});
