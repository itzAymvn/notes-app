import { useSession } from "@/hooks/useAuth"
import { FontAwesome } from "@expo/vector-icons"
import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer"
import { Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function CustomDrawerContent(
	props: DrawerContentComponentProps
) {
	const { top, bottom } = useSafeAreaInsets()
	const { signOut, user } = useSession()

	return (
		<View style={{ flex: 1 }}>
			<View
				style={{ padding: 20, paddingTop: top + 20 }}
				className="bg-accent"
			>
				<Text className="text-white font-bold text-xl">
					{user?.name}
				</Text>
				<Text className="text-white">{user?.email}</Text>
			</View>

			<DrawerContentScrollView {...props}>
				<DrawerItemList {...props} />
			</DrawerContentScrollView>

			<View style={{ padding: 20, paddingBottom: bottom + 20 }}>
				<TouchableOpacity
					className={`bg-accent p-4 rounded-lg items-center m-2`}
					style={{ marginBottom: bottom + 18 }}
					onPress={() => {
						signOut()
					}}
				>
					<View className="flex flex-row items-center">
						<FontAwesome name="sign-out" size={24} color="white" />
						<Text className="text-white ml-2">Sign Out</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	)
}
