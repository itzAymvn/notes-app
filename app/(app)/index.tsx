import Loading from "@/components/Loading"
import { Colors } from "@/constants/Colors"
import { useNote } from "@/hooks/useNote"
import { Feather } from "@expo/vector-icons"
import dayjs from "dayjs"
import { router } from "expo-router"
import { useEffect, useMemo, useRef, useState } from "react"
import {
	Keyboard,
	RefreshControl,
	ScrollView,
	Text,
	TextInput,
	ToastAndroid,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native"

export default function Index() {
	const { notes, isLoading, loadNotes, deleteNote } = useNote()

	const [refreshing, setRefreshing] = useState(false)
	const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set())
	const [isSelectionMode, setIsSelectionMode] = useState(false)
	const [notesState, setNotesState] = useState(notes)
	const [search, setSearch] = useState("")
	const [keyboardStatus, setKeyboardStatus] = useState("")

	const textInputRef = useRef<TextInput>(null)

	useEffect(() => {
		const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
			setKeyboardStatus("display")
		)
		const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
			setKeyboardStatus("none")
		)
		return () => {
			showSubscription.remove()
			hideSubscription.remove()
		}
	}, [])

	useEffect(() => {
		setNotesState(notes)
	}, [notes])

	useEffect(() => {
		if (search === "") {
			setNotesState(notes)
		} else {
			const filteredNotes = notes.filter((note) => {
				return (
					note.title.toLowerCase().includes(search.toLowerCase()) ||
					note.content.toLowerCase().includes(search.toLowerCase())
				)
			})
			setNotesState(filteredNotes)
		}
	}, [search])

	const checkKeyboards = () => {
		if (keyboardStatus === "none") textInputRef.current?.blur()
		return true
	}

	const onRefresh = async () => {
		setRefreshing(true)
		await loadNotes()
		setRefreshing(false)
	}

	const handleSelectNote = (noteId: string) => {
		const newSelectedNotes = new Set(selectedNotes)
		if (newSelectedNotes.has(noteId)) {
			newSelectedNotes.delete(noteId)
		} else {
			newSelectedNotes.add(noteId)
		}
		setSelectedNotes(newSelectedNotes)
	}

	const handleLongPressNote = (noteId: string) => {
		setIsSelectionMode(true)
		handleSelectNote(noteId)
	}

	const handleDeleteSelectedNotes = async () => {
		try {
			const r = await deleteNote(Array.from(selectedNotes))
			if (!r.success) {
				ToastAndroid.show(r.message, ToastAndroid.LONG)
			} else {
				ToastAndroid.show(
					"Notes deleted successfully",
					ToastAndroid.LONG
				)
				setSelectedNotes(new Set())
				setIsSelectionMode(false)
			}
		} catch (error) {
			ToastAndroid.show("Failed to delete notes", ToastAndroid.LONG)
		}
	}

	const exitSelectionMode = () => {
		setSelectedNotes(new Set())
		setIsSelectionMode(false)
	}

	const handleSearch = useMemo(() => {
		return (text: string) => {
			setSearch(text)
		}
	}, [search])

	if (isLoading) return <Loading />

	const Note = ({
		note,
	}: {
		note: {
			_id: string
			title: string
			content: string
			createdAt: string
			updatedAt: string
		}
	}) => {
		const { _id, title, content, createdAt, updatedAt } = note
		const dateToUse = updatedAt > createdAt ? updatedAt : createdAt
		const isSelected = selectedNotes.has(_id)

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

	const Notes = () => {
		return (
			<>
				<ScrollView
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
					{notesState
						.sort((a, b) => {
							return (
								new Date(b.updatedAt).getTime() -
								new Date(a.updatedAt).getTime()
							)
						})
						.map((note) => {
							return <Note key={note._id} note={note} />
						})}
				</ScrollView>
			</>
		)
	}

	const NoNotes = () => {
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
					<Feather
						name="alert-circle"
						size={48}
						color={Colors.accent}
					/>
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

	return (
		<View className="flex-1 bg-[#1e1e1e] p-4">
			<View className="flex-1 relative">
				<View className="flex flex-row items-center mb-4 border-b border-accent pb-2">
					<Feather name="search" size={24} color={Colors.accent} />
					<TextInput
						placeholder="Search notes"
						placeholderTextColor={Colors.accent}
						onChangeText={handleSearch}
						ref={textInputRef}
						value={search}
						style={{
							color: Colors.accent,
							fontSize: 16,
							flex: 1,
							marginLeft: 8,
						}}
						onPressIn={checkKeyboards}
					/>
				</View>

				<View className="flex flex-col w-full h-full max-w-md mx-auto">
					{notesState.length > 0 ? <Notes /> : <NoNotes />}
				</View>

				<View className="absolute bottom-4 right-4 flex flex-row">
					{isSelectionMode && selectedNotes.size > 0 && (
						<>
							<TouchableOpacity
								onPress={handleDeleteSelectedNotes}
								className="bg-red-500 p-4 rounded-full ml-2"
							>
								<Feather
									name="trash-2"
									size={24}
									color="#fff"
								/>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={exitSelectionMode}
								className="bg-gray-500 p-4 rounded-full ml-2"
							>
								<Feather name="x" size={24} color="#fff" />
							</TouchableOpacity>
						</>
					)}
					<TouchableOpacity
						onPress={() => router.push("create-note")}
						className="bg-accent p-4 rounded-full ml-2"
					>
						<Feather name="plus" size={24} color="#fff" />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}
