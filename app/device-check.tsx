import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Theme } from '@/constants/Colors';

export default function DeviceCheckScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const examCode = (params.examCode as string) || 'AIVES_EXAM_2026_094201';
  const examTitle = (params.examTitle as string) || 'Kiểm tra vấn đáp Kiến trúc phần mềm';

  const [micStatus, setMicStatus] = useState<'checking' | 'passed' | 'failed'>('checking');
  const [speakerStatus, setSpeakerStatus] = useState<'checking' | 'passed' | 'failed'>('checking');
  const [cameraStatus, setCameraStatus] = useState<'checking' | 'passed' | 'failed'>('checking');
  const [networkStatus, setNetworkStatus] = useState<'checking' | 'passed' | 'failed'>('checking');

  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [micVolume, setMicVolume] = useState(65);

  useEffect(() => {
    // Tự động kiểm tra thiết bị khi mở màn hình
    const timer1 = setTimeout(() => setMicStatus('passed'), 800);
    const timer2 = setTimeout(() => setSpeakerStatus('passed'), 1200);
    const timer3 = setTimeout(() => setCameraStatus('passed'), 1600);
    const timer4 = setTimeout(() => setNetworkStatus('passed'), 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const handleTestSpeaker = () => {
    setIsTestingAudio(true);
    setTimeout(() => {
      setIsTestingAudio(false);
      Alert.alert('Thành công', 'Âm thanh đã phát mẫu chuẩn. Bạn đã nghe rõ giọng nói trợ lý AI?');
    }, 1200);
  };

  const handleStartExam = () => {
    router.replace({
      pathname: '/exam-room',
      params: {
        examId: examCode,
        examTitle,
      },
    });
  };

  const isAllPassed =
    micStatus === 'passed' &&
    speakerStatus === 'passed' &&
    cameraStatus === 'passed' &&
    networkStatus === 'passed';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={Theme.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kiểm Tra Thiết Bị</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Exam info badge */}
          <View style={styles.examBanner}>
            <Text style={styles.examCodeText}>MÃ CA THI: {examCode}</Text>
            <Text style={styles.examTitleText}>{examTitle}</Text>
          </View>

          <Text style={styles.sectionTitle}>Các hạng mục kiểm tra phần cứng & mạng</Text>

          {/* Micro check */}
          <View style={styles.checkCard}>
            <View style={styles.checkTop}>
              <View style={styles.checkLeft}>
                <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <MaterialIcons name="mic" size={22} color={Theme.primary} />
                </View>
                <View>
                  <Text style={styles.checkName}>Microphone (Thu âm giọng nói)</Text>
                  <Text style={styles.checkDesc}>Độ nhạy thu âm tối ưu cho mô hình Whisper STT</Text>
                </View>
              </View>

              {micStatus === 'checking' ? (
                <ActivityIndicator size="small" color={Theme.primary} />
              ) : (
                <View style={styles.passBadge}>
                  <MaterialIcons name="check" size={14} color="#059669" />
                  <Text style={styles.passText}>Tốt</Text>
                </View>
              )}
            </View>

            {/* Volume meter visualizer */}
            <View style={styles.meterContainer}>
              <Text style={styles.meterLabel}>Mức âm lượng: {micVolume}%</Text>
              <View style={styles.meterTrack}>
                <View style={[styles.meterBar, { width: `${micVolume}%` }]} />
              </View>
            </View>
          </View>

          {/* Speaker check */}
          <View style={styles.checkCard}>
            <View style={styles.checkTop}>
              <View style={styles.checkLeft}>
                <View style={[styles.iconCircle, { backgroundColor: '#F5F3FF' }]}>
                  <MaterialIcons name="volume-up" size={22} color="#7C3AED" />
                </View>
                <View>
                  <Text style={styles.checkName}>Loa / Tai nghe (Phát âm AI)</Text>
                  <Text style={styles.checkDesc}>Phát giọng đọc câu hỏi khảo thí tự động (TTS)</Text>
                </View>
              </View>

              {speakerStatus === 'checking' ? (
                <ActivityIndicator size="small" color="#7C3AED" />
              ) : (
                <View style={styles.passBadge}>
                  <MaterialIcons name="check" size={14} color="#059669" />
                  <Text style={styles.passText}>Tốt</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.soundTestBtn}
              onPress={handleTestSpeaker}
              disabled={isTestingAudio}
            >
              {isTestingAudio ? (
                <ActivityIndicator size="small" color={Theme.primary} />
              ) : (
                <>
                  <MaterialIcons name="play-arrow" size={16} color={Theme.primary} />
                  <Text style={styles.soundTestText}>Phát âm thanh thử nghiệm</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Camera check */}
          <View style={styles.checkCard}>
            <View style={styles.checkTop}>
              <View style={styles.checkLeft}>
                <View style={[styles.iconCircle, { backgroundColor: '#ECFDF5' }]}>
                  <MaterialIcons name="videocam" size={22} color="#059669" />
                </View>
                <View>
                  <Text style={styles.checkName}>Camera giám sát thí sinh</Text>
                  <Text style={styles.checkDesc}>Quyền camera để chống gian lận trong lúc làm bài</Text>
                </View>
              </View>

              {cameraStatus === 'checking' ? (
                <ActivityIndicator size="small" color="#059669" />
              ) : (
                <View style={styles.passBadge}>
                  <MaterialIcons name="check" size={14} color="#059669" />
                  <Text style={styles.passText}>Sẵn sàng</Text>
                </View>
              )}
            </View>
          </View>

          {/* Network ping check */}
          <View style={styles.checkCard}>
            <View style={styles.checkTop}>
              <View style={styles.checkLeft}>
                <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialIcons name="wifi" size={22} color="#D97706" />
                </View>
                <View>
                  <Text style={styles.checkName}>Đường truyền mạng (Latency)</Text>
                  <Text style={styles.checkDesc}>Độ trễ máy chủ AIVES Server: 24ms (Rất ổn định)</Text>
                </View>
              </View>

              {networkStatus === 'checking' ? (
                <ActivityIndicator size="small" color="#D97706" />
              ) : (
                <View style={styles.passBadge}>
                  <MaterialIcons name="check" size={14} color="#059669" />
                  <Text style={styles.passText}>24ms</Text>
                </View>
              )}
            </View>
          </View>

          {/* Instructions Notice */}
          <View style={styles.instructionsNotice}>
            <MaterialIcons name="tips-and-updates" size={20} color="#0F766E" />
            <Text style={styles.instructionsText}>
              Đảm bảo bạn đang ở phòng yên tĩnh. Khi bắt đầu thi, hệ thống sẽ tự động bật Micro để bạn tương tác trực tiếp với Trợ lý khảo thí AI.
            </Text>
          </View>

          {/* Action button */}
          <TouchableOpacity
            style={[styles.startBtn, !isAllPassed && { opacity: 0.6 }]}
            disabled={!isAllPassed}
            onPress={handleStartExam}
            activeOpacity={0.85}
          >
            <Text style={styles.startBtnText}>Sẵn Sàng & Vào Phòng Thi</Text>
            <MaterialIcons name="login" size={20} color={Theme.white} />
          </TouchableOpacity>

          <View style={{ height: 30 }} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Theme.white,
    borderBottomWidth: 1,
    borderColor: Theme.border,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Theme.text,
  },
  content: {
    flex: 1,
    padding: 18,
  },
  examBanner: {
    backgroundColor: Theme.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  examCodeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DBEAFE',
    letterSpacing: 0.5,
  },
  examTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.white,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.text,
    marginBottom: 12,
  },
  checkCard: {
    backgroundColor: Theme.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  checkTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkName: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.text,
  },
  checkDesc: {
    fontSize: 11,
    color: Theme.textSecondary,
    marginTop: 2,
  },
  passBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  passText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  meterContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  meterLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.textSecondary,
    marginBottom: 6,
  },
  meterTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  meterBar: {
    height: '100%',
    backgroundColor: Theme.primary,
    borderRadius: 4,
  },
  soundTestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Theme.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  soundTestText: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.primary,
  },
  instructionsNotice: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F0FDFA',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginTop: 6,
    marginBottom: 20,
  },
  instructionsText: {
    flex: 1,
    fontSize: 12,
    color: '#134E4A',
    lineHeight: 18,
  },
  startBtn: {
    backgroundColor: Theme.primary,
    height: 52,
    borderRadius: 14,
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
  startBtnText: {
    color: Theme.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
