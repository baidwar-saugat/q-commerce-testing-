import { Tabs } from "expo-router";
import { Map, List, User } from "lucide-react-native";

export default function RiderTabs() {
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: "#f97316", headerShown: false }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "New Jobs",
          tabBarIcon: ({ color }) => <List size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="active"
        options={{
          title: "My Deliveries",
          tabBarIcon: ({ color }) => <Map size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
