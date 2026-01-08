import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
// import { useRiderStore } from '../../../../src/store/riderStore';
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRiderStore } from "../../../src/store/riderStore";

export default function RiderProfile() {
  const { riderId, setRider, logout, preferredStoreId, setStorePreference } =
    useRiderStore();
  const [inputId, setInputId] = useState("");
  const [storeInput, setStoreInput] = useState(""); // For Store ID
  const router = useRouter();

  const handleLogin = () => {
    if (inputId.length < 5) return Alert.alert("Invalid Rider ID");
    setRider(inputId);
  };

  const handleSaveStore = () => {
    setStorePreference(storeInput);
    Alert.alert("Updated", "You will now see orders for this store.");
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Rider Profile</Text>

      {/* SECTION 1: LOGIN */}
      {!riderId ? (
        <View style={styles.card}>
          <Text style={styles.label}>Enter Rider User ID:</Text>
          <TextInput
            style={styles.input}
            placeholder="User UUID"
            value={inputId}
            onChangeText={setInputId}
          />
          <Button title="Login" onPress={handleLogin} color="#f97316" />
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>Logged in as:</Text>
          <Text style={styles.value}>{riderId}</Text>

          <View style={styles.divider} />

          {/* SECTION 2: STORE SELECTION */}
          <Text style={styles.label}>Your Hub (Store ID):</Text>
          {preferredStoreId ? (
            <View>
              <Text style={styles.value}>{preferredStoreId}</Text>
              <Button
                title="Change Store"
                onPress={() => setStorePreference("")}
              />
            </View>
          ) : (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Enter Store ID (from Admin)"
                value={storeInput}
                onChangeText={setStoreInput}
              />
              <Button
                title="Set Hub"
                onPress={handleSaveStore}
                color="#2563eb"
              />
            </View>
          )}

          <View style={{ marginTop: 30 }}>
            <Button title="Logout" onPress={handleLogout} color="red" />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  label: { fontSize: 14, color: "#666", marginBottom: 5 },
  value: { fontSize: 14, fontWeight: "bold", marginBottom: 10, color: "#111" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 20 },
});
