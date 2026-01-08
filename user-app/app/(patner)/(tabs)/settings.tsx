import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
// import { usePartnerStore } from "../../../../src/store/partnerStore";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePartnerStore } from "../../../src/store/partnerStore";

export default function PartnerSettings() {
  const { storeId, setStore, logout } = usePartnerStore();
  const [inputStoreId, setInputStoreId] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (inputStoreId.length < 5) return Alert.alert("Invalid ID");
    setStore(inputStoreId);
    Alert.alert("Success", "Connected to Kitchen");
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Kitchen Settings</Text>

      {storeId ? (
        <View style={styles.card}>
          <Text style={styles.label}>Connected Store ID:</Text>
          <Text style={styles.value}>{storeId}</Text>
          <Button title="Logout" onPress={handleLogout} color="red" />
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>Enter Store ID (From Admin):</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. b8a2e..."
            value={inputStoreId}
            onChangeText={setInputStoreId}
          />
          <Button
            title="Connect Kitchen"
            onPress={handleLogin}
            color="#16a34a"
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  label: { fontSize: 16, color: "#666", marginBottom: 10 },
  value: { fontSize: 14, fontWeight: "bold", marginBottom: 20, color: "#111" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
});
