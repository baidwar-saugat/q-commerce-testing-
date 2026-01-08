import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Vibration,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Audio } from "expo-av"; // <--- For Sound
// import { api } from '../../../../src/services/api';
// import { usePartnerStore } from '../../../../src/store/partnerStore';
import { CheckCircle, ChefHat, BellOff, Volume2 } from "lucide-react-native";
import { usePartnerStore } from "../../../src/store/partnerStore";
import { api } from "../../../src/services/api";

export default function KitchenDisplay() {
  const { storeId } = usePartnerStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // --- ALARM STATE ---
  const [isRinging, setIsRinging] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const knownOrderIds = useRef<Set<string>>(new Set()); // Track IDs we already know

  // 1. Cleanup Sound on Unmount
  useEffect(() => {
    return () => {
      stopAlarm();
    };
  }, []);

  // 2. Polling Logic
  useFocusEffect(
    useCallback(() => {
      if (!storeId) return;
      fetchOrders();
      const interval = setInterval(fetchOrders, 10000); // 10 seconds
      return () => clearInterval(interval);
    }, [storeId])
  );

  const fetchOrders = async () => {
    const data = await api.get(`/orders/store/${storeId}?limit=50`);
    if (data && data.orders) {
      const active = data.orders.filter(
        (o: any) => o.status !== "COMPLETED" && o.status !== "CANCELLED"
      );
      setOrders(active);
      checkForNewOrders(active);
    }
  };

  // 3. LOGIC: Check if we need to Ring
  const checkForNewOrders = async (activeOrders: any[]) => {
    let hasNewPending = false;

    activeOrders.forEach((order) => {
      // If it's PENDING and we haven't seen this ID before...
      if (order.status === "PENDING" && !knownOrderIds.current.has(order.id)) {
        hasNewPending = true;
        knownOrderIds.current.add(order.id);
      }
    });

    if (hasNewPending) {
      startAlarm();
    }
  };

  // 4. START ALARM (Vibrate + Sound)
  const startAlarm = async () => {
    if (isRinging) return; // Already ringing
    setIsRinging(true);

    // A. Vibrate Pattern (0s wait, 500ms vibrate, 1000ms wait) - Loop
    Vibration.vibrate([0, 500, 1000], true);

    // B. Play Sound (Loop)
    try {
      // Make sure you have a file at assets/bell.mp3 or remove this block
      const { sound } = await Audio.Sound.createAsync(
        require("../../../../assets/bell.mp3"),
        { isLooping: true } // <--- Loop sound
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (e) {
      console.log("No sound file found, using vibration only.");
    }
  };

  // 5. STOP ALARM
  const stopAlarm = async () => {
    setIsRinging(false);
    Vibration.cancel();
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    stopAlarm(); // Stop ringing when they interact
    setLoading(true);
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "PENDING") return "#fbbf24";
    if (status === "PREPARING") return "#3b82f6";
    if (status === "READY") return "#10b981";
    return "#9ca3af";
  };

  const renderOrder = ({ item }: { item: any }) => (
    <View
      style={[styles.card, { borderLeftColor: getStatusColor(item.status) }]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>
          Order #{item.id.split("-")[0].toUpperCase()}
        </Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: getStatusColor(item.status) + "20" },
          ]}
        >
          <Text
            style={[styles.badgeText, { color: getStatusColor(item.status) }]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.customer}>{item.user?.name || "Guest"}</Text>
      <Text style={styles.time}>
        {new Date(item.createdAt).toLocaleTimeString()}
      </Text>

      <View style={styles.divider} />

      {item.items.map((prod: any, index: number) => (
        <View key={index} style={styles.itemRow}>
          <Text style={styles.qty}>{prod.quantity}x</Text>
          <Text style={styles.prodName}>{prod.product.name}</Text>
        </View>
      ))}

      <View style={styles.actions}>
        {item.status === "PENDING" && (
          <TouchableOpacity
            style={[styles.btn, styles.btnCook]}
            onPress={() => updateStatus(item.id, "PREPARING")}
          >
            <ChefHat size={18} color="#fff" />
            <Text style={styles.btnText}>Accept & Cook</Text>
          </TouchableOpacity>
        )}
        {item.status === "PREPARING" && (
          <TouchableOpacity
            style={[styles.btn, styles.btnReady]}
            onPress={() => updateStatus(item.id, "READY")}
          >
            <CheckCircle size={18} color="#fff" />
            <Text style={styles.btnText}>Mark Ready</Text>
          </TouchableOpacity>
        )}
        {item.status === "READY" && (
          <TouchableOpacity
            style={[styles.btn, styles.btnComplete]}
            onPress={() => updateStatus(item.id, "COMPLETED")}
          >
            <Text style={styles.btnText}>Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (!storeId)
    return (
      <View style={styles.center}>
        <Text>Please select a store in Settings.</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER WITH ALARM CONTROL */}
      <View style={[styles.headerRow, isRinging && styles.headerAlert]}>
        <Text style={[styles.header, isRinging && { color: "white" }]}>
          {isRinging ? "🔔 NEW ORDER!" : "Kitchen Display"}
        </Text>

        {isRinging && (
          <TouchableOpacity onPress={stopAlarm} style={styles.stopBtn}>
            <BellOff color="#c2410c" size={20} />
            <Text style={styles.stopText}>Stop Sound</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <ActivityIndicator
          style={{ position: "absolute", top: 80, right: 20 }}
        />
      )}

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={{ padding: 15 }}
        ListEmptyComponent={<Text style={styles.empty}>No Active Orders</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerAlert: { backgroundColor: "#ef4444" }, // Red background when ringing
  header: { fontSize: 24, fontWeight: "bold" },

  stopBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    gap: 5,
  },
  stopText: { color: "#c2410c", fontWeight: "bold" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { textAlign: "center", marginTop: 50, color: "#999", fontSize: 16 },
  card: {
    backgroundColor: "#fff",
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: { fontSize: 16, fontWeight: "bold", color: "#111" },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { fontSize: 12, fontWeight: "bold" },
  customer: { color: "#666", marginTop: 5 },
  time: { color: "#999", fontSize: 12, marginTop: 2 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  itemRow: { flexDirection: "row", marginBottom: 5 },
  qty: { fontWeight: "bold", marginRight: 10, fontSize: 16 },
  prodName: { fontSize: 16, color: "#333" },
  actions: { marginTop: 15, flexDirection: "row" },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  btnCook: { backgroundColor: "#3b82f6" },
  btnReady: { backgroundColor: "#10b981" },
  btnComplete: { backgroundColor: "#1f2937" },
  btnText: { color: "#fff", fontWeight: "bold" },
});
