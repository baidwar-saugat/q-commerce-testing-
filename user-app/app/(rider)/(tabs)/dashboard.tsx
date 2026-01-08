import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
// import { api } from "../../../../src/services/api";
// import { useRiderStore } from "../../../../src/store/riderStore";
import { Bike } from "lucide-react-native";
import { useRiderStore } from "../../../src/store/riderStore";
import { api } from "../../../src/services/api";

export default function RiderDashboard() {
  const { riderId, preferredStoreId } = useRiderStore();
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchAvailable();
      const interval = setInterval(fetchAvailable, 10000);
      return () => clearInterval(interval);
    }, [preferredStoreId])
  );

  const fetchAvailable = async () => {
    // If Rider has selected a store, add ?storeId=...
    const endpoint = preferredStoreId
      ? `/rider/available?storeId=${preferredStoreId}`
      : `/rider/available`; // Else show all (optional)

    const data = await api.get(endpoint);
    setOrders(data || []);
  };
  const acceptOrder = async (orderId: string) => {
    if (!riderId) return Alert.alert("Error", "Rider ID not found");
    try {
      await api.patch(`/rider/${orderId}/accept`, { riderId });
      Alert.alert("Success", "Order Accepted! Go to 'My Deliveries'.");
      fetchAvailable();
      router.push("/(rider)/(tabs)/active"); // Auto switch tab
    } catch (e) {
      Alert.alert("Error", "Could not accept order");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Available Jobs</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No jobs available nearby.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.storeName}>{item.store.name}</Text>
              <Text style={styles.price}>Rs. {item.total}</Text>
            </View>
            <Text style={styles.address}>📍 {item.store.address}</Text>
            <View style={styles.divider} />
            <Text style={styles.customer}>Customer: {item.user.name}</Text>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => acceptOrder(item.id)}
            >
              <Bike color="#fff" size={20} style={{ marginRight: 10 }} />
              <Text style={styles.btnText}>Accept Delivery</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
    backgroundColor: "#fff",
  },
  empty: { textAlign: "center", marginTop: 50, color: "#999" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  storeName: { fontSize: 18, fontWeight: "bold" },
  price: { fontSize: 18, fontWeight: "bold", color: "#16a34a" },
  address: { color: "#666", marginBottom: 10 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  customer: { fontSize: 14, fontWeight: "500", marginBottom: 15 },
  btn: {
    backgroundColor: "#f97316",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
