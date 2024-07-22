import AxiosManager from "@/lib/axios"
import {
	AuthContextType,
	getUserType,
	signInType,
	signUpType,
	TUser,
} from "@/types/app"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react"

const validateToken = async (token: string) => {
	const response = await AxiosManager.post(
		"/user",
		{},
		{
			headers: {
				authorization: `${token}`,
			},
		}
	)

	// The API Endpoint will extract the user _id from the token
	// Then it will check if there is a user with that _id that ALSO has the token in their tokens array
	// If there is, it will return the user object which means the token is valid
	// If there isn't, it will return an error message which means the token is invalid

	if (!response.data.success) {
		await AsyncStorage.removeItem("token")
		return null
	}

	return response.data.user
}

const AuthContext = createContext<AuthContextType>({
	signIn: async () => {
		return {
			success: false,
			message: "Not implemented",
		}
	},
	signOut: () => {
		return
	},
	signUp: async () => {
		return {
			success: false,
			message: "Not implemented",
		}
	},
	getUser: async () => {
		return {
			success: false,
			message: "Not implemented",
		}
	},
	session: null,
	user: null,
	isLoading: false,
})

export function useSession() {
	const value = useContext(AuthContext)

	if (!value) {
		throw new Error("useSession must be used within a SessionProvider")
	}

	return value
}

export function SessionProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<string | null>(null)
	const [user, setUser] = useState<TUser | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const loadSession = async () => {
			setIsLoading(true)
			const token = await AsyncStorage.getItem("token")
			if (!token) {
				setIsLoading(false)
				return
			}

			const user = await validateToken(token)
			if (!user) {
				setIsLoading(false)
				return
			}

			setUser(user)
			setSession(token)
			setIsLoading(false)
		}

		loadSession()
	}, [])

	const signIn = async (
		email: string,
		password: string
	): Promise<signInType> => {
		if (email === "" || password === "") {
			return {
				success: false,
				message: "Please fill in all fields",
			}
		}

		// Validate email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			return {
				success: false,
				message: "Invalid email address",
			}
		}

		setIsLoading(true)
		try {
			const response = await AxiosManager.post("/login", {
				email,
				password,
			})

			if (!response.data.success) {
				throw new Error(response.data.message)
			} else {
				await AsyncStorage.setItem("token", response.data.token)
				setSession(response.data.token)

				const userResponse = await getUser(response.data.token)
				if (!userResponse.success) {
					throw new Error(userResponse.message)
				}

				setUser(userResponse.user)

				setIsLoading(false)
				return {
					success: true,
					message:
						"Successfully logged in with token: " +
						response.data.token,
				}
			}
		} catch (error) {
			setIsLoading(false)
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error"
			return {
				success: false,
				message: errorMessage,
			}
		}
	}

	const signOut = async () => {
		await AsyncStorage.removeItem("token")
		await AxiosManager.post(
			"/logout",
			{},
			{
				headers: {
					authorization: `${session}`,
				},
			}
		)
		setUser(null)
		setSession(null)
	}

	const signUp = async (
		name: string,
		email: string,
		password: string
	): Promise<signUpType> => {
		setIsLoading(true)
		try {
			const response = await AxiosManager.post("/signup", {
				name,
				email,
				password,
			})

			setIsLoading(false)
			return {
				success: response.data.success,
				message: response.data.message,
			}
		} catch (error) {
			setIsLoading(false)
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error"
			return {
				success: false,
				message: errorMessage,
			}
		}
	}

	const getUser = async (token: string): Promise<getUserType> => {
		if (token === "") {
			return {
				success: false,
				message: "Token is required",
			}
		}

		try {
			const response = await AxiosManager.post(
				"/user",
				{},
				{
					headers: {
						authorization: `${token}`,
					},
				}
			)

			if (!response.data.success) {
				return {
					success: false,
					message: response.data.message as string,
				}
			} else {
				return {
					success: true,
					user: {
						id: response.data.user.id as string,
						name: response.data.user.name as string,
						email: response.data.user.email as string,
					},
				}
			}
		} catch (error) {
			setIsLoading(false)
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error"
			return {
				success: false,
				message: errorMessage,
			}
		}
	}

	return (
		<AuthContext.Provider
			value={{
				signIn,
				signOut,
				signUp,
				getUser,
				session,
				user,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
