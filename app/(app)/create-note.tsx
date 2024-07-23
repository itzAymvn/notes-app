import { useNote } from "@/hooks/useNote"
import { useFocusEffect } from "@react-navigation/native"
import { useRouter } from "expo-router"
import React, { useCallback } from "react"
import {
	Controller,
	FieldValues,
	SubmitHandler,
	useForm,
} from "react-hook-form"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import Toast from "react-native-root-toast"

export default function CreateNote() {
	const { newNote } = useNote()
	const router = useRouter()
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm()

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		try {
			const r = await newNote(data.title, data.content)
			if (!r.success) {
				Toast.show("Failed to create note", {
					duration: Toast.durations.SHORT,
				})
			} else {
				Toast.show("Note created successfully", {
					duration: Toast.durations.SHORT,
				})
				router.push("/")
			}
		} catch (error) {
			Toast.show("Failed to create note", {
				duration: Toast.durations.SHORT,
			})
		}
	}

	useFocusEffect(
		useCallback(() => {
			reset()
		}, [reset])
	)

	return (
		<View className="flex-1 bg-[#1e1e1e] p-4">
			<Controller
				control={control}
				name="title"
				rules={{
					required: "Title is required",
					pattern: {
						value: /^[a-zA-Z0-9 ]*$/,
						message: "Title can only contain letters and numbers",
					},
				}}
				render={({ field: { onChange, onBlur, value = "" } }) => (
					<TextInput
						placeholder="Title"
						placeholderTextColor="#888"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						multiline={false}
						style={{
							backgroundColor: "#2a2a2a",
							color: "#fff",
							padding: 10,
							borderRadius: 5,
							marginBottom: 15,
							textAlignVertical: "top",
						}}
					/>
				)}
			/>
			{errors.title && (
				<Text className="text-red-500 mb-4">
					{errors.title.message?.toString()}
				</Text>
			)}

			<Controller
				control={control}
				name="content"
				rules={{ required: "Content is required" }}
				render={({ field: { onChange, onBlur, value = "" } }) => (
					<TextInput
						placeholder="Content"
						placeholderTextColor="#888"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						multiline
						numberOfLines={4}
						style={{
							backgroundColor: "#2a2a2a",
							color: "#fff",
							padding: 10,
							borderRadius: 5,
							marginBottom: 15,
							textAlignVertical: "top",
						}}
					/>
				)}
			/>
			{errors.content && (
				<Text className="text-red-500 mb-4">
					{errors.content.message?.toString()}
				</Text>
			)}

			<TouchableOpacity
				className="bg-accent p-3 rounded"
				onPress={handleSubmit(onSubmit)}
			>
				<Text className="text-white text-center font-bold">
					Create Note
				</Text>
			</TouchableOpacity>
		</View>
	)
}
