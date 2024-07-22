import { Colors } from "@/constants/Colors"
import { useNote } from "@/hooks/useNote"
import { TNote } from "@/types/app"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
	Controller,
	FieldValues,
	SubmitHandler,
	useForm,
} from "react-hook-form"
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TextInput,
	ToastAndroid,
	TouchableOpacity,
	View,
} from "react-native"

export default function ViewNote() {
	const router = useRouter()
	const { id } = useLocalSearchParams()
	const { notes, isUpdating, updateNote } = useNote()
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm()

	const [note, setNote] = useState<TNote | null>(null)

	useEffect(() => {
		if (!id) {
			ToastAndroid.show("Note not found", ToastAndroid.LONG)
			router.push("/")
			return
		}

		const note = notes.find((note) => note._id === id)
		if (!note) {
			ToastAndroid.show("Note not found", ToastAndroid.LONG)
			router.push("/")
			return
		}

		setNote(note)
	}, [id])

	if (!note) {
		return (
			<View className="flex justify-center items-center h-screen bg-[#1e1e1e]">
				<ActivityIndicator size="large" color={Colors.accent} />
			</View>
		)
	}

	const { _id, title, content } = note

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		const t = await updateNote(_id, data.title, data.content)
		if (!t.success) {
			ToastAndroid.show("Failed to update note", ToastAndroid.LONG)
		} else {
			router.push("/")
		}
	}

	return (
		<KeyboardAvoidingView
			className="flex-1 bg-[#1e1e1e]"
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ScrollView
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ flexGrow: 1, padding: 16 }}
				className="flex-1"
			>
				<View>
					<Controller
						control={control}
						name="title"
						defaultValue={title}
						rules={{
							required: "Title is required",
							pattern: {
								value: /^[a-zA-Z0-9 ]*$/,
								message:
									"Title can only contain letters and numbers",
							},
							minLength: {
								value: 3,
								message: "Title is too short",
							},
							maxLength: {
								value: 50,
								message: "Title is too long",
							},
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								className="text-accent text-2xl font-bold mb-4"
								placeholder="Title"
								placeholderTextColor="#888"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								multiline={false}
								style={{
									backgroundColor: "#2a2a2a",
									padding: 10,
									borderRadius: 5,
									marginBottom: 15,
									textAlignVertical: "top",
								}}
							/>
						)}
					/>

					{errors.title && (
						<Text className="text-red-500 text-sm mb-4">
							{errors.title.message?.toString()}
						</Text>
					)}

					<Controller
						control={control}
						name="content"
						defaultValue={content}
						rules={{
							required: "Content is required",
							minLength: {
								value: 3,
								message: "Content is too short",
							},
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								className="text-white mb-4 text-lg"
								placeholder="Content"
								placeholderTextColor="#888"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								multiline
								numberOfLines={4}
								style={{
									backgroundColor: "#2a2a2a",
									padding: 10,
									borderRadius: 5,
									textAlignVertical: "top",
								}}
							/>
						)}
					/>

					{errors.content && (
						<Text className="text-red-500 text-sm mb-4">
							{errors.content.message?.toString()}
						</Text>
					)}

					<TouchableOpacity
						onPress={handleSubmit(onSubmit)}
						disabled={isSubmitting}
						className="bg-accent p-4 rounded-lg mt-4"
					>
						<Text className="text-white text-center text-lg font-bold">
							{isUpdating ? "Updating..." : "Update"}
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	)
}
