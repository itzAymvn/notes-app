import { Colors } from "@/constants/Colors"
import { Feather } from "@expo/vector-icons"
import { RefreshControl, ScrollView, Text, View } from "react-native"

const NoNotes = ({
	search,
	refreshing,
	onRefresh,
}: {
	search: string
	refreshing: boolean
	onRefresh: () => void
}) => {
	return (
		<ScrollView
			className="flex bg-[#1e1e1e]"
			showsHorizontalScrollIndicator={false}
			showsVerticalScrollIndicator={false}
			keyboardShouldPersistTaps="never"
			contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
					colors={[Colors.accent]}
				/>
			}
		>
			<View className="p-6 rounded-lg shadow-lg bg-[#2a2a2a] flex items-center">
				<Feather name="alert-circle" size={48} color={Colors.accent} />
				<Text className="text-white text-xl font-bold mt-4">
					No notes found
				</Text>
				<Text className="text-white text-sm mt-2 text-center">
					{search === ""
						? "You haven't created any notes yet. Tap the '+' button below to add your first note!"
						: "Couldn't find any notes matching your search query."}
				</Text>
			</View>
		</ScrollView>
	)
}

export default NoNotes
