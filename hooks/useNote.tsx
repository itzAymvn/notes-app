import AxiosManager from "@/lib/axios"
import { NoteContextType, TNote } from "@/types/app"
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react"
import { useSession } from "./useAuth"

const NoteContext = createContext<NoteContextType>({
	notes: [],
	isLoading: false,
	isUpdating: false,
	loadNotes: async () => {
		return null
	},
	newNote: async (_title: string, _content: string) => {
		return { success: false, message: "error" }
	},
	deleteNote: async (_ids: string[]) => {
		return { success: false, message: "error" }
	},
	updateNote: async (_id: string, _title: string, _content: string) => {
		return { success: false, message: "error" }
	},
})

export function useNote() {
	const value = useContext(NoteContext)

	if (!value) {
		throw new Error("useNote must be used within a NoteProvider")
	}

	return value
}

export function NoteProvider({ children }: { children: ReactNode }) {
	const [notes, setNotes] = useState<TNote[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isUpdating, setIsUpdating] = useState(false)

	const { session, signOut } = useSession()

	useEffect(() => {
		loadNotes()
	}, [])

	const loadNotes = async (): Promise<any> => {
		try {
			setIsLoading(true)
			const response = await AxiosManager.get("/note", {
				headers: {
					Authorization: `${session}`,
				},
			})

			if (response.status === 401) {
				return signOut()
			}

			if (response.data.success) {
				setNotes(response.data.notes)
			}
			setIsLoading(false)
		} catch (error) {
			setIsLoading(false)
			return null
		}
	}

	const deleteNote = async (ids: string[]): Promise<any> => {
		try {
			const response = await AxiosManager.delete(
				`/note/${ids.join(",")}`,
				{
					headers: {
						Authorization: `${session}`,
					},
				}
			)

			if (response.status === 401) {
				return signOut()
			}

			if (response.data.success) {
				loadNotes()
				return {
					success: true,
					message: ids.length > 1 ? "Notes deleted" : "Note deleted",
				}
			} else {
				return { success: false, message: response.data.message }
			}
		} catch (error) {
			throw new Error("Failed to delete note")
		}
	}

	const newNote = async (title: string, content: string): Promise<any> => {
		try {
			const response = await AxiosManager.post(
				"/note",
				{
					title,
					content,
				},
				{
					headers: {
						Authorization: `${session}`,
					},
				}
			)

			if (response.status === 401) {
				return signOut()
			}

			if (response.data.success) {
				loadNotes()
				return { success: true }
			} else {
				return { success: false, message: response.data.message }
			}
		} catch (error) {
			throw new Error("Failed to create note")
		}
	}

	const updateNote = async (
		id: string,
		title: string,
		content: string
	): Promise<any> => {
		setIsUpdating(true)
		try {
			const response = await AxiosManager.put(
				`/note/${id}`,
				{
					title,
					content,
				},
				{
					headers: {
						Authorization: `${session}`,
					},
				}
			)

			if (response.status === 401) {
				return signOut()
			}

			if (response.data.success) {
				const newNotes = notes.map((note) => {
					if (note._id === id) {
						return {
							...note,
							title,
							content,
						}
					}
					return note
				})

				setIsUpdating(false)
				setNotes(newNotes)
				return { success: true }
			} else {
				setIsUpdating(false)
				return { success: false, message: response.data.message }
			}
		} catch (error) {
			setIsUpdating(false)
			return { success: false, message: "Failed to update note" }
		}
	}

	return (
		<NoteContext.Provider
			value={{
				notes,
				isLoading,
				isUpdating,
				loadNotes,
				newNote,
				deleteNote,
				updateNote,
			}}
		>
			{children}
		</NoteContext.Provider>
	)
}
