import { Tabs } from "expo-router";
import { ClipboardList, Menu, Settings } from "lucide-react-native";

export default function PartnerTabs() {
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: "#16a34a", headerShown: false }}
    >
      <Tabs.Screen
        name="orders"
        options={{
          title: "Live Orders",
          tabBarIcon: ({ color }) => <ClipboardList size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => <Menu size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
