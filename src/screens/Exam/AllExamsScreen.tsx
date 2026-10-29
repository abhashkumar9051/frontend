
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { AppStackParamList } from "../../navigation/AppNavigator";
import { getExams, type Exam } from "../../services/examService";

type Props = NativeStackScreenProps<AppStackParamList, "AllExams">;

const AllExamsScreen = ({ navigation }: Props) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExams = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getExams();
      setExams(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Exams load nahi ho paaye.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  const filteredExams = exams.filter((exam) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      (exam.name || "").toLowerCase().includes(query) ||
      (exam.shortName || "").toLowerCase().includes(query) ||
      (exam.description || "").toLowerCase().includes(query)
    );
  });

  const getEmoji = (shortName: string) => {
    const name = (shortName || "").toUpperCase();

    if (name.includes("GATE")) return "📚";
    if (name.includes("BPSC")) return "🏛️";
    if (name.includes("SSC")) return "💻";
    if (name.includes("UPSC")) return "🎓";
    if (name.includes("BANK") || name.includes("IBPS")) return "🏦";
    if (name.includes("RRB") || name.includes("RAILWAY")) return "🚆";
    if (name.includes("NEET")) return "🩺";
    if (name.includes("JEE")) return "🎓";

    return "📝";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>All Exams</Text>
          <Text style={styles.subtitle}>
            {exams.length} exams available
          </Text>
        </View>
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search exams..."
        placeholderTextColor="#9CA3AF"
        style={styles.searchInput}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.infoText}>Exams load ho rahe hain...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadExams}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredExams}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {search.trim() ? "Koi matching exam nahi mila." : "Abhi koi exam available nahi hai."}
            </Text>
          }
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.examCard}
              onPress={() =>
                navigation.navigate("ExamDetails", {
                  examId: item._id,
                })
              }
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: ["#DBEAFE", "#DCFCE7", "#FFEDD5", "#F3E8FF"][index % 4] },
                ]}
              >
                <Text style={styles.emoji}>
                  {getEmoji(item.shortName)}
                </Text>
              </View>

              <View style={styles.examInfo}>
                <Text style={styles.examShortName}>
                  {item.shortName || "Exam"}
                </Text>
                <Text style={styles.examName}>
                  {item.name}
                </Text>
                {!!item.description && (
                  <Text numberOfLines={2} style={styles.description}>
                    {item.description}
                  </Text>
                )}
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )}
          refreshing={loading}
          onRefresh={loadExams}
        />
      )}
    </SafeAreaView>
  );
};

export default AllExamsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  backText: {
    fontSize: 32,
    lineHeight: 36,
    color: "#4F46E5",
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 14,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    flexGrow: 1,
  },
  examCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    elevation: 2,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  emoji: {
    fontSize: 25,
  },
  examInfo: {
    flex: 1,
  },
  examShortName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  examName: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 3,
  },
  description: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
  },
  arrow: {
    fontSize: 28,
    color: "#9CA3AF",
    marginLeft: 8,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  infoText: {
    color: "#6B7280",
    marginTop: 12,
  },
  errorText: {
    color: "#DC2626",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 15,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 40,
  },
});
