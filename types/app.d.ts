/// <reference types="nativewind/types" />

type successSignInType = {
	success: true
	message: string
}
type failSignInType = {
	success: false
	message: string
}

type successSignUpType = {
	success: true
	message: string
}
type failSignUpType = {
	success: false
	message: string
}

type TUser = {
	id: string
	name: string
	email: string
}

type successGetUserType = {
	success: true
	user: TUser
}

type failGetUserType = {
	success: false
	message: string
}

export type signInType = successSignInType | failSignInType
export type signUpType = successSignUpType | failSignUpType
export type getUserType = successGetUserType | failGetUserType

export interface AuthContextType {
	signIn: (email: string, password: string) => Promise<signInType>
	signUp: (
		name: string,
		email: string,
		password: string
	) => Promise<signUpType>
	signOut: () => void
	getUser: (token: string) => Promise<getUserType>
	session: string | null
	user: TUser | null
	isLoading: boolean
}

export type TNote = {
	_id: string
	title: string
	content: string
	createdAt: string
	updatedAt: string
}

export interface NoteContextType {
	notes: TNote[] | []
	isLoading: boolean
	isUpdating: boolean
	loadNotes: () => Promise<null | undefined>
	newNote: (
		title: string,
		content: string
	) => Promise<
		{ success: true; message: string } | { success: false; message: string }
	>
	deleteNote: (
		ids: string[]
	) => Promise<
		{ success: true; message: string } | { success: false; message: string }
	>
	updateNote: (
		id: string,
		title: string,
		content: string
	) => Promise<
		{ success: true; message: string } | { success: false; message: string }
	>
}
