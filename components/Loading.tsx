import { Colors } from "@/constants/Colors"
import { ActivityIndicator, View } from "react-native"

export default function Loading() {
	return (
		<View className="flex justify-center items-center h-screen bg-[#1e1e1e]">
			<ActivityIndicator size="large" color={Colors.accent} />
		</View>
	)
}
