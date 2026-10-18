import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '@/constants/Colors';

type AppealStatus = 'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED';

interface AppealItem {
  id: string;
  appealCode: string;
  examTitle: string;
  courseCode: string;
  questionTitle: string;
  submittedAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  previousScore: number;
  updatedScore?: number;
  studentReason: string;
  lecturerResponse?: string;
  reviewedAt?: string;
  lecturerName?: string;
}

export default function AppealsTabScreen() {
  const [filter, setFilter] = useState<AppealStatus>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState('SWD392 - Kiểm tra vấn đáp Kiến trúc');
  const [questionText, setQuestionText] = useState('');
  const [reasonText, setReasonText] = useState('');

  const [appealsList, setAppealsList] = useState<AppealItem[]>([
    {
      id: '1',
      appealCode: 'APP-2026-001',
      examTitle: 'Kiểm tra vấn đáp Kiến trúc phần mềm & Microservices',
      courseCode: 'SWD392',
      questionTitle: 'Câu 2: Cơ chế Saga Pattern trong hệ thống phân tán',
      submittedAt: '12/10/2026 15:30',
      status: 'PENDING',
      previousScore: 7.5,
      studentReason:
        'Em đã phân tích đầy đủ sự khác biệt giữa Choreography và Orchestration ở phút 03:45 của bản ghi âm, nhưng hệ thống AI nhận định là thiếu ví dụ rollback. Kính mong thầy/cô nghe lại đoạn audio trên.',
    },
    {
      id: '2',
      appealCode: 'APP-2026-002',
      examTitle: 'Vấn đáp Lập trình .NET nâng cao',
      courseCode: 'PRN231',
      questionTitle: 'Câu 1: Cơ chế xử lý Deadlock trong SQL Server với Entity Framework Core',
      submittedAt: '30/09/2026 11:20',
      status: 'ACCEPTED',
      previousScore: 7.0,
      updatedScore: 8.5,
      studentReason:
        'Em đã giải thích đúng Retry logic với Polly và cấu hình Snapshot Isolation Level nhưng transcript ghi nhận bị thiếu từ khóa.',
      lecturerResponse:
        'Giảng viên đã nghe lại audio lúc 04:12, xác nhận sinh viên đã trả lời đúng cơ chế Retry và Snapshot Isolation. Điểm được cập nhật từ 7.0 lên 8.5.',
      reviewedAt: '01/10/2026 16:40',
      lecturerName: 'ThS. Vũ Quang Hải',
    },
    {
      id: '3',
      appealCode: 'APP-2026-003',
      examTitle: 'Vấn đáp Quy trình phát triển Agile & Scrum',
      courseCode: 'SWE301',
      questionTitle: 'Câu 3: Định nghĩa Definition of Done (DoD) vs Acceptance Criteria',
      submittedAt: '16/09/2026 14:10',
      status: 'REJECTED',
      previousScore: 8.0,
      updatedScore: 8.0,
      studentReason:
        'Em xin cứu xét thêm 0.5 điểm cho phần giải thích kiểm thử tự động trong DoD.',
      lecturerResponse:
        'Giảng viên và hội đồng đã nghe lại bản ghi âm. Phần giải thích kiểm thử còn chung chung, chưa phân biệt được Unit Test và E2E Test theo đúng Rubric tiêu chí 2. Giữ nguyên điểm số 8.0.',
      reviewedAt: '18/09/2026 09:15',
      lecturerName: 'TS. Lê Minh Tuấn',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const totalCount = appealsList.length;
  const pendingCount = appealsList.filter((x) => x.status === 'PENDING').length;
  const acceptedCount = appealsList.filter((x) => x.status === 'ACCEPTED').length;
  const rejectedCount = appealsList.filter((x) => x.status === 'REJECTED').length;

  const filteredAppeals = appealsList.filter((item) => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  const handleSubmitNewAppeal = () => {
    if (!questionText.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập câu hỏi bạn muốn khiếu nại phúc khảo');
      return;
    }
    if (!reasonText.trim() || reasonText.length < 20) {
      Alert.alert('Lý do quá ngắn', 'Vui lòng giải trình lý do chi tiết (tối thiểu 20 ký tự) kèm mốc thời gian audio');
      return;
    }

    const newAppeal: AppealItem = {
      id: String(Date.now()),
      appealCode: `APP-2026-${Math.floor(100 + Math.random() * 900)}`,
      examTitle: selectedExam,
      courseCode: selectedExam.split(' - ')[0],
      questionTitle: questionText.trim(),
      submittedAt: 'Vừa xong',
      status: 'PENDING',
      previousScore: 8.0,
      studentReason: reasonText.trim(),
    };

    setAppealsList([newAppeal, ...appealsList]);
    setModalVisible(false);
    setQuestionText('');
    setReasonText('');
    Alert.alert('Thành công', 'Đơn phúc khảo của bạn đã được gửi tới Giảng viên phụ trách!');
  };

  const getStatusBadge = (status: AppealItem['status']) => {
    switch (status) {
      case 'PENDING':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
            <MaterialIcons name="hourglass-empty" size={13} color="#D97706" />
            <Text style={[styles.statusText, { color: '#D97706' }]}>Đang chờ duyệt</Text>
          </View>
        );
      case 'ACCEPTED':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
            <MaterialIcons name="check-circle" size={13} color="#059669" />
            <Text style={[styles.statusText, { color: '#059669' }]}>Đã chấp thuận (+điểm)</Text>
          </View>
        );
      case 'REJECTED':
        return (
          <View style={[styles.statusBadge, { backgroundColor: '#FFF1F2', borderColor: '#FECDD3' }]}>
            <MaterialIcons name="cancel" size={13} color="#E11D48" />
            <Text style={[styles.statusText, { color: '#E11D48' }]}>Bị từ chối (Giữ điểm)</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Theo Dõi Đơn Phúc Khảo</Text>
            <Text style={styles.headerSub}>Minh bạch khiếu nại & thẩm định lại với Giảng viên</Text>
          </View>

          <TouchableOpacity
            style={styles.addAppealBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <MaterialIcons name="add" size={18} color={Theme.white} />
            <Text style={styles.addAppealText}>Gửi đơn</Text>
          </TouchableOpacity>
        </View>

        {/* Counter Summary Cards */}
        <View style={styles.summaryRow}>
          <TouchableOpacity
            style={[styles.summaryCard, filter === 'ALL' && styles.summaryCardActive]}
            onPress={() => setFilter('ALL')}
          >
            <Text style={styles.summaryCount}>{totalCount}</Text>
            <Text style={styles.summaryLabel}>Tổng số đơn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.summaryCard, filter === 'PENDING' && styles.summaryCardActive]}
            onPress={() => setFilter('PENDING')}
          >
            <Text style={[styles.summaryCount, { color: '#D97706' }]}>{pendingCount}</Text>
            <Text style={styles.summaryLabel}>Chờ duyệt</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.summaryCard, filter === 'ACCEPTED' && styles.summaryCardActive]}
            onPress={() => setFilter('ACCEPTED')}
          >
            <Text style={[styles.summaryCount, { color: '#059669' }]}>{acceptedCount}</Text>
            <Text style={styles.summaryLabel}>Chấp thuận</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.summaryCard, filter === 'REJECTED' && styles.summaryCardActive]}
            onPress={() => setFilter('REJECTED')}
          >
            <Text style={[styles.summaryCount, { color: '#E11D48' }]}>{rejectedCount}</Text>
            <Text style={styles.summaryLabel}>Từ chối</Text>
          </TouchableOpacity>
        </View>

        {/* Appeals Scroll List */}
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Theme.primary]} />
          }
        >
          {filteredAppeals.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="mark-email-read" size={48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Chưa có đơn phúc khảo nào</Text>
              <Text style={styles.emptySub}>Mọi thắc mắc về điểm thi bạn có thể tạo đơn khiếu nại tại đây</Text>
            </View>
          ) : (
            filteredAppeals.map((appeal) => (
              <View key={appeal.id} style={styles.appealCard}>
                {/* Header card */}
                <View style={styles.appealCardHeader}>
                  <View style={styles.appealCodeBadge}>
                    <Text style={styles.appealCodeText}>{appeal.appealCode}</Text>
                  </View>
                  {getStatusBadge(appeal.status)}
                </View>

                {/* Exam Title */}
                <Text style={styles.examTitleText}>{appeal.examTitle}</Text>

                {/* Question Section */}
                <View style={styles.questionBox}>
                  <MaterialIcons name="help-outline" size={16} color={Theme.primary} />
                  <Text style={styles.questionText}>{appeal.questionTitle}</Text>
                </View>

                {/* Score Diff Section (if available) */}
                <View style={styles.scoreCompareRow}>
                  <View style={styles.scoreCompareItem}>
                    <Text style={styles.scoreCompareLabel}>Điểm ban đầu:</Text>
                    <Text style={styles.scoreCompareVal}>{appeal.previousScore.toFixed(1)}/10</Text>
                  </View>

                  {appeal.updatedScore !== undefined && (
                    <>
                      <MaterialIcons name="arrow-forward" size={16} color="#64748B" />
                      <View style={styles.scoreCompareItem}>
                        <Text style={styles.scoreCompareLabel}>Điểm sau duyệt:</Text>
                        <Text
                          style={[
                            styles.scoreCompareVal,
                            {
                              color:
                                appeal.updatedScore > appeal.previousScore ? '#059669' : Theme.text,
                            },
                          ]}
                        >
                          {appeal.updatedScore.toFixed(1)}/10
                        </Text>
                      </View>
                    </>
                  )}
                </View>

                {/* Student Explanation */}
                <View style={styles.reasonSection}>
                  <Text style={styles.reasonTitle}>Lý do sinh viên giải trình:</Text>
                  <Text style={styles.reasonBody}>{appeal.studentReason}</Text>
                  <Text style={styles.timeMeta}>Thời gian gửi: {appeal.submittedAt}</Text>
                </View>

                {/* Lecturer Response if Reviewed */}
                {appeal.lecturerResponse && (
                  <View style={styles.responseSection}>
                    <View style={styles.responseHeader}>
                      <MaterialIcons name="record-voice-over" size={16} color="#0D9488" />
                      <Text style={styles.responseTitle}>
                        Phản hồi từ {appeal.lecturerName || 'Giảng viên'}
                      </Text>
                    </View>
                    <Text style={styles.responseBody}>{appeal.lecturerResponse}</Text>
                    {appeal.reviewedAt && (
                      <Text style={styles.responseMeta}>Đã thẩm định: {appeal.reviewedAt}</Text>
                    )}
                  </View>
                )}
              </View>
            ))
          )}

          <View style={{ height: 30 }} />
        </ScrollView>

        {/* Modal tạo đơn phúc khảo */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Tạo Đơn Phúc Khảo Mới</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <MaterialIcons name="close" size={24} color={Theme.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalLabel}>Ca thi muốn khiếu nại</Text>
                <View style={styles.readonlyInput}>
                  <Text style={styles.readonlyText}>{selectedExam}</Text>
                </View>

                <Text style={styles.modalLabel}>Câu hỏi khiếu nại</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="VD: Câu 1: Kiến trúc Microservices vs Monolith"
                  placeholderTextColor="#94A3B8"
                  value={questionText}
                  onChangeText={setQuestionText}
                />

                <Text style={styles.modalLabel}>Lý do giải trình chi tiết</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalTextArea]}
                  placeholder="Ghi rõ thời điểm audio bạn đã trả lời, trích dẫn nội dung bạn cho rằng hệ thống AI chưa nhận diện đủ..."
                  placeholderTextColor="#94A3B8"
                  value={reasonText}
                  onChangeText={setReasonText}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <View style={styles.ruleNoticeBox}>
                  <MaterialIcons name="info-outline" size={16} color="#D97706" />
                  <Text style={styles.ruleNoticeText}>
                    Theo quy chế thi, đơn phúc khảo sẽ được Giảng viên thẩm định lại băng ghi âm và đối chiếu trực tiếp với Rubric. Kết quả thẩm định là quyết định cuối cùng.
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.modalSubmitBtn}
                  onPress={handleSubmitNewAppeal}
                  activeOpacity={0.85}
                >
                  <MaterialIcons name="send" size={18} color={Theme.white} />
                  <Text style={styles.modalSubmitText}>Gửi Đơn Phúc Khảo</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Theme.white,
    borderBottomWidth: 1,
    borderColor: Theme.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.text,
  },
  headerSub: {
    fontSize: 12,
    color: Theme.textSecondary,
    marginTop: 2,
  },
  addAppealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 4,
  },
  addAppealText: {
    color: Theme.white,
    fontSize: 12,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    padding: 14,
    gap: 8,
    backgroundColor: Theme.white,
    borderBottomWidth: 1,
    borderColor: Theme.border,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  summaryCardActive: {
    borderColor: Theme.primary,
    backgroundColor: Theme.primaryLight,
  },
  summaryCount: {
    fontSize: 18,
    fontWeight: '900',
    color: Theme.text,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Theme.textSecondary,
    marginTop: 2,
  },
  listScroll: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  appealCard: {
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
  appealCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appealCodeBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  appealCodeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  examTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: Theme.text,
    marginBottom: 8,
  },
  questionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Theme.primaryLight,
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  questionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: Theme.primaryDark,
  },
  scoreCompareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  scoreCompareItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreCompareLabel: {
    fontSize: 11,
    color: Theme.textSecondary,
    fontWeight: '600',
  },
  scoreCompareVal: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.text,
  },
  reasonSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  reasonTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 4,
  },
  reasonBody: {
    fontSize: 12,
    color: Theme.text,
    lineHeight: 18,
  },
  timeMeta: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 6,
    textAlign: 'right',
  },
  responseSection: {
    backgroundColor: '#F0FDFA',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  responseTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
  responseBody: {
    fontSize: 12,
    color: '#134E4A',
    lineHeight: 18,
  },
  responseMeta: {
    fontSize: 10,
    color: '#0D9488',
    marginTop: 6,
    textAlign: 'right',
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
    textAlign: 'center',
    paddingHorizontal: 20,
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
    maxHeight: '85%',
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
  modalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.text,
    marginBottom: 6,
    marginTop: 10,
  },
  readonlyInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  readonlyText: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.text,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1.5,
    borderColor: Theme.border,
    fontSize: 13,
    color: Theme.text,
  },
  modalTextArea: {
    height: 90,
  },
  ruleNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  ruleNoticeText: {
    flex: 1,
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
  },
  modalSubmitBtn: {
    backgroundColor: Theme.primary,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  modalSubmitText: {
    color: Theme.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
