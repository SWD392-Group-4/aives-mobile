import React, { useState } from 'react';
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

type FilterType = 'ALL' | 'PUBLISHED' | 'PENDING_REVIEW';

interface ExamResultItem {
  id: string;
  attemptId: string;
  courseCode: string;
  examTitle: string;
  date: string;
  duration: string;
  status: 'PUBLISHED' | 'PENDING_REVIEW';
  score?: number;
  maxScore: number;
  lecturerName: string;
  estimatedPublishTime?: string;
  feedbackPreview?: string;
  questionCount: number;
}

export default function ResultsTabScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const resultsData: ExamResultItem[] = [
    {
      id: 'RES-001',
      attemptId: 'ATT-2026-9041',
      courseCode: 'FER202',
      examTitle: 'Vấn đáp Thực hành Web Frontend & React',
      date: '08/10/2026 14:00',
      duration: '20 phút',
      status: 'PUBLISHED',
      score: 9.0,
      maxScore: 10,
      lecturerName: 'TS. Trần Hoàng Long',
      feedbackPreview: 'Trả lời lưu loát về Virtual DOM, React Hooks và Clean Architecture. Phần demo trực tiếp xuất sắc.',
      questionCount: 3,
    },
    {
      id: 'RES-002',
      attemptId: 'ATT-2026-9042',
      courseCode: 'SWD392',
      examTitle: 'Kiểm tra vấn đáp Kiến trúc phần mềm & Design Patterns',
      date: 'Hôm nay, 14:25',
      duration: '30 phút',
      status: 'PENDING_REVIEW',
      maxScore: 10,
      lecturerName: 'ThS. Nguyễn Thị Mai',
      estimatedPublishTime: 'Dự kiến: Trước 18:00 ngày 20/10/2026 (sau thẩm định HITL)',
      questionCount: 4,
    },
    {
      id: 'RES-003',
      attemptId: 'ATT-2026-8819',
      courseCode: 'PRN231',
      examTitle: 'Vấn đáp Lập trình .NET nâng cao (Microservices & gRPC)',
      date: '28/09/2026 10:15',
      duration: '25 phút',
      status: 'PUBLISHED',
      score: 8.5,
      maxScore: 10,
      lecturerName: 'ThS. Vũ Quang Hải',
      feedbackPreview: 'Nắm chắc gRPC so với RESTful API, giải thích được Protocol Buffers. Cần chú ý thêm về timeout handling.',
      questionCount: 3,
    },
    {
      id: 'RES-004',
      attemptId: 'ATT-2026-7712',
      courseCode: 'SWE301',
      examTitle: 'Vấn đáp Quy trình phát triển phần mềm Agile/Scrum',
      date: '15/09/2026 09:00',
      duration: '20 phút',
      status: 'PUBLISHED',
      score: 8.8,
      maxScore: 10,
      lecturerName: 'TS. Lê Minh Tuấn',
      feedbackPreview: 'Hiểu rõ các Scrum ceremonies, cơ chế quản lý backlog và định nghĩa Definition of Done (DoD).',
      questionCount: 3,
    },
  ];

  const filteredList = resultsData.filter((item) => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Kết Quả Thi Vấn Đáp</Text>
          <Text style={styles.headerSub}>Bảng điểm và đánh giá chi tiết theo Rubric môn học</Text>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterPill, filter === 'ALL' && styles.filterPillActive]}
            onPress={() => setFilter('ALL')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filter === 'ALL' && styles.filterTextActive]}>
              Tất cả ({resultsData.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, filter === 'PUBLISHED' && styles.filterPillActive]}
            onPress={() => setFilter('PUBLISHED')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filter === 'PUBLISHED' && styles.filterTextActive]}>
              Đã có điểm ({resultsData.filter((x) => x.status === 'PUBLISHED').length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, filter === 'PENDING_REVIEW' && styles.filterPillActive]}
            onPress={() => setFilter('PENDING_REVIEW')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filter === 'PENDING_REVIEW' && styles.filterTextActive]}>
              Đang thẩm định ({resultsData.filter((x) => x.status === 'PENDING_REVIEW').length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results List */}
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Theme.primary]} />
          }
        >
          {filteredList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="inbox" size={48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Không có kết quả nào</Text>
              <Text style={styles.emptySub}>Không tìm thấy bài thi phù hợp với bộ lọc đã chọn</Text>
            </View>
          ) : (
            filteredList.map((item) => {
              const isPublished = item.status === 'PUBLISHED';

              return (
                <View key={item.id} style={styles.card}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.courseBadge}>
                      <Text style={styles.courseBadgeText}>{item.courseCode}</Text>
                    </View>

                    {isPublished ? (
                      <View style={styles.publishedBadge}>
                        <MaterialIcons name="verified" size={13} color="#059669" />
                        <Text style={styles.publishedBadgeText}>Giảng viên đã duyệt</Text>
                      </View>
                    ) : (
                      <View style={styles.pendingBadge}>
                        <MaterialIcons name="hourglass-top" size={13} color="#D97706" />
                        <Text style={styles.pendingBadgeText}>AI đã chấm - Chờ GV duyệt</Text>
                      </View>
                    )}
                  </View>

                  {/* Title */}
                  <Text style={styles.examTitle}>{item.examTitle}</Text>

                  {/* Meta Information */}
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="calendar-today" size={13} color={Theme.textSecondary} />
                      <Text style={styles.metaText}>{item.date}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="timer" size={13} color={Theme.textSecondary} />
                      <Text style={styles.metaText}>{item.duration}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="quiz" size={13} color={Theme.textSecondary} />
                      <Text style={styles.metaText}>{item.questionCount} câu hỏi</Text>
                    </View>
                  </View>

                  {/* Lecturer Name */}
                  <View style={styles.lecturerRow}>
                    <MaterialIcons name="school" size={14} color={Theme.textSecondary} />
                    <Text style={styles.lecturerText}>Giám khảo: {item.lecturerName}</Text>
                  </View>

                  <View style={styles.divider} />

                  {/* Score or Pending Notice */}
                  {isPublished ? (
                    <View style={styles.scoreRow}>
                      <View style={styles.scoreLeft}>
                        <Text style={styles.scoreLabel}>ĐIỂM TỔNG KẾT</Text>
                        <View style={styles.scoreValueWrapper}>
                          <Text style={styles.scoreNumber}>{item.score?.toFixed(1)}</Text>
                          <Text style={styles.scoreMax}>/ {item.maxScore}</Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.detailBtn}
                        onPress={() =>
                          router.push({
                            pathname: '/result-detail',
                            params: { attemptId: item.attemptId, courseCode: item.courseCode },
                          })
                        }
                        activeOpacity={0.8}
                      >
                        <Text style={styles.detailBtnText}>Xem chi tiết</Text>
                        <MaterialIcons name="arrow-forward" size={16} color={Theme.white} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.pendingBox}>
                      <View style={styles.pendingInfoRow}>
                        <View style={styles.lockIconBox}>
                          <MaterialIcons name="lock-outline" size={18} color="#D97706" />
                        </View>
                        <View style={styles.pendingTextGroup}>
                          <Text style={styles.pendingHeading}>Điểm đang được bảo mật</Text>
                          <Text style={styles.pendingRuleNotice}>
                            Theo quy tắc BR-GRADE-001, sinh viên chỉ được xem điểm sau khi Giảng viên hoàn tất thẩm định HITL.
                          </Text>
                          {item.estimatedPublishTime && (
                            <Text style={styles.estimatedTimeText}>{item.estimatedPublishTime}</Text>
                          )}
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Theme.white,
    borderBottomWidth: 1,
    borderColor: Theme.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Theme.text,
  },
  headerSub: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Theme.white,
    borderBottomWidth: 1,
    borderColor: Theme.border,
    gap: 8,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterPillActive: {
    backgroundColor: Theme.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.textSecondary,
  },
  filterTextActive: {
    color: Theme.white,
  },
  listScroll: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: Theme.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Theme.border,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseBadge: {
    backgroundColor: Theme.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  courseBadgeText: {
    color: Theme.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  publishedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  publishedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: Theme.textSecondary,
    fontWeight: '500',
  },
  lecturerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  lecturerText: {
    fontSize: 12,
    color: Theme.textSecondary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Theme.border,
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLeft: {},
  scoreLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Theme.textSecondary,
    letterSpacing: 0.5,
  },
  scoreValueWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  scoreNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: Theme.primary,
  },
  scoreMax: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.textSecondary,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 6,
    shadowColor: Theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  detailBtnText: {
    color: Theme.white,
    fontSize: 13,
    fontWeight: '700',
  },
  pendingBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  pendingInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  lockIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  pendingTextGroup: {
    flex: 1,
  },
  pendingHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 2,
  },
  pendingRuleNotice: {
    fontSize: 11,
    color: '#B45309',
    lineHeight: 16,
    marginBottom: 4,
  },
  estimatedTimeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.text,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginTop: 4,
  },
});
