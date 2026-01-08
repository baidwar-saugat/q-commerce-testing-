import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
// FIX: Using Safe Area Context
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Search, Crosshair, X } from "lucide-react-native";
import * as Location from "expo-location";
import { searchAddress, getPlaceDetails } from "../services/baato";
import { api } from "../services/api";
import { useUserStore } from "../store/userStore";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function LocationModal({ visible, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const { setLocation, setStore } = useUserStore();

  // --- 1. SEARCH LOGIC ---
  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      const data = await searchAddress(text);
      setResults(data);
    } else {
      setResults([]);
    }
  };

  // --- 2. GPS LOGIC (UPDATED) ---
  const handleCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      // A. Request Permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Allow location access to use this feature."
        );
        setIsGettingLocation(false);
        return;
      }

      // B. Get Coordinates
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // C. Reverse Geocode (Get Readable Address)
      let addressText = "My Current Location"; // Default fallback
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (reverseGeocode.length > 0) {
          const place = reverseGeocode[0];
          // Construct address: "Street, City" or "District, City"
          const street = place.street || place.name;
          const city = place.city || place.subregion || place.district;

          if (street && city) {
            addressText = `${street}, ${city}`;
          } else if (city) {
            addressText = city;
          }
        }
      } catch (err) {
        console.log("Reverse geocode failed, using fallback name");
      }

      // D. Process
      await processLocation(latitude, longitude, addressText);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not fetch current location.");
      setIsGettingLocation(false);
    }
  };

  // --- 3. SELECTION LOGIC ---
  const handleSelect = async (item: any) => {
    setLoading(true);
    let lat = 0;
    let lng = 0;

    // Extract Coordinates
    if (item.centroid) {
      lat = Number(item.centroid.lat);
      lng = Number(item.centroid.lon);
    } else if (item.lat && item.lon) {
      lat = Number(item.lat);
      lng = Number(item.lon);
    } else if (item.placeId) {
      const response = await getPlaceDetails(item.placeId);
      const details = Array.isArray(response) ? response[0] : response;
      if (details) {
        if (details.centroid) {
          lat = Number(details.centroid.lat);
          lng = Number(details.centroid.lon);
        } else if (details.geometry && details.geometry.coordinates) {
          lng = Number(details.geometry.coordinates[0]);
          lat = Number(details.geometry.coordinates[1]);
        }
      }
    }

    if (!lat || !lng) {
      setLoading(false);
      alert("Invalid Location Data");
      return;
    }

    const address = item.name + (item.address ? `, ${item.address}` : "");
    await processLocation(lat, lng, address);
  };

  // --- 4. BACKEND CHECK (Shared) ---
  const processLocation = async (lat: number, lng: number, address: string) => {
    setLoading(true);
    try {
      const serviceCheck = await api.post("/location/check-availability", {
        latitude: lat,
        longitude: lng,
      });

      // Update Global State with the READABLE Address
      setLocation({ latitude: lat, longitude: lng, address: address });

      if (serviceCheck && serviceCheck.serviceable) {
        setStore(serviceCheck.store);
        onClose();
      } else {
        alert("We do not serve this area yet! But we saved your location.");
        setStore(null);
        onClose();
      }
    } catch (e) {
      alert("Network Error");
    } finally {
      setLoading(false);
      setIsGettingLocation(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.bottomSheet}
        >
          {/* Drag Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          <Text style={styles.title}>Select Your Location</Text>

          {/* Current Location Button */}
          <TouchableOpacity
            style={styles.currentLocBtn}
            onPress={handleCurrentLocation}
            disabled={isGettingLocation}
          >
            {isGettingLocation ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Crosshair size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.currentLocText}>
                  Use My Current Location
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* Search Input */}
          <View style={styles.inputWrapper}>
            <Search size={20} color="#9ca3af" />
            <TextInput
              style={styles.input}
              placeholder="Type your area manually"
              placeholderTextColor="#9ca3af"
              value={query}
              onChangeText={handleSearch}
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setQuery("");
                  setResults([]);
                }}
              >
                <X size={18} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>

          {loading && (
            <ActivityIndicator style={{ marginTop: 20 }} color="#2563eb" />
          )}

          {results.length > 0 ? (
            <View style={styles.listContainer}>
              <FlatList
                data={results}
                keyExtractor={(item, index) => index.toString()}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => handleSelect(item)}
                  >
                    <View style={styles.pinIcon}>
                      <MapPin size={16} color="#4b5563" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resTitle}>{item.name}</Text>
                      <Text style={styles.resSub}>{item.address}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : (
            <TouchableOpacity style={styles.confirmBtn} disabled={true}>
              <Text style={styles.confirmText}>Confirm Location</Text>
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handleContainer: { alignItems: "center", marginBottom: 20 },
  handle: { width: 40, height: 4, backgroundColor: "#e5e7eb", borderRadius: 2 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 20,
  },
  currentLocBtn: {
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  currentLocText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: { flex: 1, height: 1, backgroundColor: "#e5e7eb" },
  orText: {
    marginHorizontal: 10,
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: "#1f2937" },
  confirmBtn: {
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    opacity: 0.5,
  },
  confirmText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  listContainer: { maxHeight: 200, marginTop: 10 },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  pinIcon: {
    marginRight: 12,
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 20,
  },
  resTitle: { fontWeight: "600", color: "#374151", fontSize: 15 },
  resSub: { color: "#9ca3af", fontSize: 13, marginTop: 2 },
});
