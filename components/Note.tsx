import { Colors } from "@/constants/Colors"
import { Feather } from "@expo/vector-icons"
import dayjs from "dayjs"
import { router } from "expo-router"
import { Text, TouchableWithoutFeedback, View } from "react-native"

const Note = ({
	note,
	isSelectionMode,
	isSelected,
	handleLongPressNote,
	handleSelectNote,
}: {
	note: {
		_id: string
		title: string
		content: string
		createdAt: string
		updatedAt: string
	}
	isSelectionMode: boolean
	isSelected: boolean
	handleLongPressNote: (id: string) => void
	handleSelectNote: (id: string) => void
}) => {
	const { _id, title, content, createdAt, updatedAt } = note
	const dateToUse = updatedAt > createdAt ? updatedAt : createdAt

	return (
		<TouchableWithoutFeedback
			key={_id}
			onLongPress={() => handleLongPressNote(_id)}
			onPress={() =>
				isSelectionMode
					? handleSelectNote(_id)
					: router.push(`/edit-note?id=${_id}`)
			}
		>
			<View
				className={`bg-[#2a2a2a] p-6 rounded-xl shadow-lg mb-4 ${
					isSelected ? "opacity-30" : ""
				}`}
			>
				<View className="flex flex-row items-center mb-2">
					<Feather name="edit" size={24} color={Colors.accent} />
					<Text className="text-accent font-bold text-xl ml-2">
						{title}
					</Text>
				</View>

				<Text className="text-white text-lg">
					{content.length > 100
						? `${content.slice(0, 100)}... ${
								content.length - 100
						  } more`
						: content}
				</Text>

				<Text className="text-accent text-xs text-right mt-2">
					{dayjs(dateToUse).format("DD MMM YYYY HH:mm")}
				</Text>
			</View>
		</TouchableWithoutFeedback>
	)
}

export default Note
