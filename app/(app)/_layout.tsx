import CustomDrawerContent from "@/components/CustomDrawerContent"
import Loading from "@/components/Loading"
import { Colors } from "@/constants/Colors"
import { useSession } from "@/hooks/useAuth"
import { NoteProvider } from "@/hooks/useNote"
import { FontAwesome } from "@expo/vector-icons"
import { Redirect } from "expo-router"
import { Drawer } from "expo-router/drawer"
import { StatusBar } from "expo-status-bar"

export default function AppLayout() {
	const { session, isLoading } = useSession()

	if (isLoading) return <Loading />

	if (!session) {
		return <Redirect href="/sign-in" />
	}

	return (
		<NoteProvider>
			<StatusBar style="light" />
			<Drawer
				drawerContent={CustomDrawerContent}
				screenOptions={{
					drawerActiveTintColor: Colors.accent,
					drawerInactiveTintColor: Colors.accent,
					drawerLabelStyle: {
						color: Colors.accent,
						fontWeight: "bold",
					},
					drawerStyle: {
						backgroundColor: "#1e1e1e",
					},
					headerShown: true,
					headerStyle: { backgroundColor: "#05080a" },
					headerTintColor: Colors.accent,
					headerTitleStyle: { fontWeight: "bold" },
					headerRightContainerStyle: { paddingRight: 16 },
				}}
			>
				<Drawer.Screen
					name="index"
					options={{
						drawerLabel: "View Notes",
						title: "Notes",
						drawerIcon: ({ color, size }) => (
							<FontAwesome
								name="list"
								size={size}
								color={color}
							/>
						),
					}}
				/>

				<Drawer.Screen
					name="create-note"
					options={{
						drawerLabel: "Create Note",
						title: "Create Note",
						drawerIcon: ({ color, size }) => (
							<FontAwesome
								name="plus"
								size={size}
								color={color}
							/>
						),
					}}
				/>

				<Drawer.Screen
					name="profile"
					options={{
						drawerLabel: "Profile",
						title: "Profile",
						drawerIcon: ({ color, size }) => (
							<FontAwesome
								name="user"
								size={size}
								color={color}
							/>
						),
					}}
				/>

				<Drawer.Screen
					name="edit-note"
					options={{
						drawerLabel: "Edit Note",
						title: "Edit Note",
						drawerItemStyle: { display: "none" },
					}}
				/>
			</Drawer>
		</NoteProvider>
	)
}
