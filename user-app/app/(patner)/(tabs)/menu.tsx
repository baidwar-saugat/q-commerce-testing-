import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Switch,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router"; // <--- NEW
import { usePartnerStore } from "../../../src/store/partnerStore";
import { api } from "../../../src/services/api";
// import { api } from '../../../../src/services/api';
// import { usePartnerStore } from '../../../../src/store/partnerStore';

export default function MenuManagement() {
  const { storeId } = usePartnerStore();
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch ONLY when screen is focused (No Interval)
  useFocusEffect(
    useCallback(() => {
      if (storeId) fetchMenu();
    }, [storeId])
  );

  const fetchMenu = async () => {
    // Don't set loading true if we already have data (prevents flickering)
    // setLoading(true);
    const data = await api.get(`/inventory/${storeId}/menu`);
    setMenu(data || []);
    setLoading(false);
  };

  const toggleAvailability = async (
    productId: string,
    currentStatus: boolean
  ) => {
    setMenu((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, isAvailable: !currentStatus }
          : item
      )
    );

    try {
      await api.patch(`/inventory/${storeId}/products/${productId}`, {
        isAvailable: !currentStatus,
      });
    } catch (error) {
      alert("Failed to update status");
      fetchMenu();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.header}>Menu Availability</Text>

      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.product.name}</Text>
              <Text style={styles.price}>Rs. {item.price}</Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Switch
                value={item.isAvailable}
                onValueChange={() =>
                  toggleAvailability(item.productId, item.isAvailable)
                }
                trackColor={{ false: "#767577", true: "#86efac" }}
                thumbColor={item.isAvailable ? "#16a34a" : "#f4f3f4"}
              />
              <Text
                style={{
                  fontSize: 10,
                  color: item.isAvailable ? "green" : "red",
                  marginTop: 4,
                }}
              >
                {item.isAvailable ? "In Stock" : "Sold Out"}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
    alignItems: "center",
  },
  name: { fontSize: 16, fontWeight: "600", color: "#111" },
  price: { color: "#666", marginTop: 4 },
});
