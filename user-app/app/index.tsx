import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Gatekeeper() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Q-Commerce</Text>
      <Text style={styles.subtitle}>Choose your app experience</Text>

      {/* Button to go to your OLD User App */}
      <TouchableOpacity
        style={[styles.btn, styles.userBtn]}
        onPress={() => router.replace("/(user)/(tabs)/home")}
      >
        <Text style={styles.btnText}>Customer App</Text>
      </TouchableOpacity>

      {/* Button to go to the NEW Partner App */}
      <TouchableOpacity
        style={[styles.btn, styles.partnerBtn]}
        onPress={() => router.replace("/(patner)/(tabs)/orders")}
      >
        <Text style={styles.btnText}>Kitchen Partner App</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#f97316" }]}
        onPress={() => router.replace("/(rider)/(tabs)/dashboard")}
      >
        <Text style={styles.btnText}>Delivery Rider App</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#666",
  },
  btn: {
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  userBtn: { backgroundColor: "#2563eb" },
  partnerBtn: { backgroundColor: "#16a34a" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
