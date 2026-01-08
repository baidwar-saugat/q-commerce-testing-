import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 👇 FIXED IMPORTS (Added extra ../)
import { useUserStore } from "../../../src/store/userStore";
import LocationModal from "../../../src/components/LocationModal";
import { api } from "../../../src/services/api";
// 👆

import { ChevronDown } from "lucide-react-native";

export default function HomeScreen() {
  const { location, activeStore, addToCart } = useUserStore(); // Added addToCart
  const [modalVisible, setModalVisible] = useState(false);
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Check Location on Mount
  useEffect(() => {
    if (!location) {
      setModalVisible(true);
    } else if (activeStore) {
      // 2. If we have a store, fetch its menu
      fetchMenu(activeStore.id);
    }
  }, [location, activeStore]);

  const fetchMenu = async (storeId: string) => {
    setLoading(true);
    const data = await api.get(`/inventory/${storeId}/menu`);
    setMenu(data || []);
    setLoading(false);
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      productId: item.productId,
      name: item.product.name,
      price: item.price,
      quantity: 1,
    });
    alert("Added to Cart!");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.deliverTo}>Delivering to</Text>
          <TouchableOpacity
            style={styles.locationBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.address} numberOfLines={1}>
              {location ? location.address : "Select Location"}
            </Text>
            <ChevronDown size={16} color="#2563eb" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={{ marginTop: 50 }}
        />
      ) : !activeStore ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>No Store Available Here.</Text>
          <Text style={styles.subText}>
            Try changing location to where you created a store.
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{ marginTop: 10 }}
          >
            <Text style={{ color: "#2563eb" }}>Change Location</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={menu}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 15 }}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.textContainer}>
                <Text style={styles.productName}>{item.product.name}</Text>
                <Text style={styles.productCat}>
                  {item.product.category?.name || "General"}
                </Text>
                <Text style={styles.price}>Rs. {item.price}</Text>
              </View>
              {/* Image Placeholder */}
              <View style={styles.imagePlaceholder}>
                <Text style={{ color: "#fff", fontSize: 10 }}>IMG</Text>
              </View>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.addBtnText}>ADD</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Location Modal */}
      <LocationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  deliverTo: { fontSize: 12, color: "#6b7280", marginBottom: 2 },
  locationBtn: { flexDirection: "row", alignItems: "center" },
  address: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginRight: 5,
    maxWidth: "80%",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, fontWeight: "bold", color: "#374151" },
  subText: { color: "#6b7280", marginTop: 5 },

  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  textContainer: { flex: 1 },
  productName: { fontSize: 16, fontWeight: "600", color: "#111" },
  productCat: { fontSize: 12, color: "#9ca3af", marginBottom: 4 },
  price: { fontSize: 14, fontWeight: "bold", color: "#2563eb" },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#ccc",
    borderRadius: 8,
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    position: "absolute",
    right: 15,
    bottom: 15,
    backgroundColor: "#eff6ff",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  addBtnText: { color: "#2563eb", fontWeight: "bold", fontSize: 12 },
});
