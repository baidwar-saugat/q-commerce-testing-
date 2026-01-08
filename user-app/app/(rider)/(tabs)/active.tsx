import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
// import { api } from '../../../../src/services/api';
// import { useRiderStore } from '../../../../src/store/riderStore';
import { CheckCircle } from "lucide-react-native";
import { useRiderStore } from "../../../src/store/riderStore";
import { api } from "../../../src/services/api";

export default function ActiveDeliveries() {
  const { riderId } = useRiderStore();
  const [orders, setOrders] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchMyOrders();
    }, [riderId])
  );

  const fetchMyOrders = async () => {
    if (!riderId) return;
    const data = await api.get(`/rider/${riderId}/active`);
    setOrders(data || []);
  };

  const completeOrder = async (orderId: string) => {
    try {
      await api.patch(`/rider/${orderId}/complete`, {});
      Alert.alert("Great Job!", "Delivery Completed.");
      fetchMyOrders();
    } catch (e) {
      Alert.alert("Error", "Could not complete order");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Deliveries</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No active deliveries.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.status}>STATUS: {item.status}</Text>
            <Text style={styles.customer}>{item.user.name}</Text>
            <Text style={styles.address}>Dropoff: Contact Customer</Text>
            {/* In real app, user model should have address */}

            <View style={styles.itemsBox}>
              {item.items.map((i: any, idx: number) => (
                <Text key={idx}>
                  - {i.quantity}x {i.productId.slice(0, 5)}...
                </Text> // Simplify
              ))}
            </View>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => completeOrder(item.id)}
            >
              <CheckCircle color="#fff" size={20} style={{ marginRight: 10 }} />
              <Text style={styles.btnText}>Mark Delivered</Text>
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
    borderLeftWidth: 5,
    borderLeftColor: "#f97316",
  },
  status: { color: "#f97316", fontWeight: "bold", marginBottom: 5 },
  customer: { fontSize: 18, fontWeight: "bold" },
  address: { color: "#666", marginBottom: 10 },
  itemsBox: {
    backgroundColor: "#f9fafb",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#10b981",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
