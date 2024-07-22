import { useSession } from "@/hooks/useAuth"
import { Text, View } from "react-native"

export default function profile() {
	const { user } = useSession()

	return (
		<View className="flex-1 bg-[#1e1e1e] p-4">
			<Text className="text-white text-2xl font-bold">Profile</Text>
			<Text className="text-white text-lg mt-2">Name: {user?.name}</Text>
			<Text className="text-white text-lg mt-2">
				Email: {user?.email}
			</Text>
		</View>
	)
}
