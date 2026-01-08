import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../../src/store/userStore";
import { api } from "../../../src/services/api";
import { Trash2, ShoppingBag } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function CartScreen() {
  const { cart, removeFromCart, clearCart, activeStore } = useUserStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Calculate Total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    // 1. Validation
    if (!activeStore) {
      Alert.alert(
        "Error",
        "No active store found. Please select a location on Home screen."
      );
      return;
    }

    setLoading(true);

    try {
      // 2. Prepare Payload
      // ⚠️ REPLACE THIS STRING WITH THE UUID YOU COPIED FROM STEP 1
      const VALID_USER_UUID = "f3ddcd41-0f75-48d8-9744-796ca0ee05ed";

      const payload = {
        userId: VALID_USER_UUID,
        storeId: activeStore.id,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      console.log("Sending Order...", payload);

      // 3. Send Request
      const response = await api.post("/orders", payload);

      if (response) {
        Alert.alert("Success", "Your order has been placed!", [
          {
            text: "OK",
            onPress: () => {
              clearCart();
              router.push("/(user)/(tabs)/home");
            },
          },
        ]);
      } else {
        Alert.alert(
          "Order Failed",
          "Server did not return a success response."
        );
      }
    } catch (error) {
      console.error("Order Error:", error);
      Alert.alert("Error", "Failed to place order. Check console logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.storeName}>
          {activeStore
            ? `Ordering from: ${activeStore.name}`
            : "No Store Selected"}
        </Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.center}>
          <ShoppingBag size={64} color="#e5e7eb" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => router.push("/(user)/(tabs)/home")}
          >
            <Text style={styles.browseText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.productId}
            contentContainerStyle={{ padding: 20 }}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDetails}>
                    Rs. {item.price} x {item.quantity}
                  </Text>
                </View>

                <View style={styles.itemRight}>
                  <Text style={styles.itemTotal}>
                    Rs. {item.price * item.quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeFromCart(item.productId)}
                    style={styles.deleteBtn}
                  >
                    <Trash2 size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>Rs. {total}</Text>
            </View>

            <TouchableOpacity
              style={[styles.checkoutBtn, loading && styles.disabledBtn]}
              onPress={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Place Order</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 20, borderBottomWidth: 1, borderColor: "#f3f4f6" },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#111" },
  storeName: { fontSize: 14, color: "#6b7280", marginTop: 4 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    fontSize: 18,
    color: "#9ca3af",
    marginTop: 15,
    marginBottom: 20,
  },
  browseBtn: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  browseText: { color: "#2563eb", fontWeight: "600" },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "600", color: "#374151" },
  itemDetails: { color: "#9ca3af", marginTop: 4 },
  itemRight: { flexDirection: "row", alignItems: "center", gap: 15 },
  itemTotal: { fontSize: 16, fontWeight: "bold", color: "#111" },
  deleteBtn: { padding: 5 },

  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#f3f4f6",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  totalLabel: { fontSize: 18, color: "#6b7280" },
  totalValue: { fontSize: 24, fontWeight: "bold", color: "#2563eb" },

  checkoutBtn: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  disabledBtn: { backgroundColor: "#93c5fd" },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
