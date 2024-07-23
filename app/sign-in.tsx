import { Images } from "@/constants/Images"
import { useSession } from "@/hooks/useAuth"
import { FontAwesome } from "@expo/vector-icons"
import { Link, useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import {
	Controller,
	FieldValues,
	SubmitHandler,
	useForm,
} from "react-hook-form"
import {
	ImageBackground,
	Text,
	TextInput,
	ToastAndroid,
	TouchableOpacity,
	View,
} from "react-native"

export default function SignIn() {
	const { signIn } = useSession()
	const [showPassword, setShowPassword] = useState(false)
	const router = useRouter()
	const params = useLocalSearchParams()

	if (params.created) {
		ToastAndroid.show("Account created successfully", ToastAndroid.SHORT)
	}

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm()

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		const t = await signIn(data.email, data.password)
		if (!t.success) {
			ToastAndroid.show(t.message, ToastAndroid.SHORT)
		} else {
			router.push("/")
		}
	}

	return (
		<View className="flex-1">
			<ImageBackground
				source={Images.auth}
				blurRadius={2}
				className="flex-1 justify-center items-center px-4 bg-[#1e1e1e] w-screen"
			>
				<View className="w-full max-w-sm">
					<Text className="text-2xl font-bold text-center text-accent mb-2 uppercase">
						Sign In
					</Text>

					<Text className="text-white text-center mb-8">
						Welcome back! Please sign in to your account
					</Text>

					<View className="mb-4">
						<Controller
							control={control}
							render={({
								field: { onChange, onBlur, value },
							}) => (
								<TextInput
									className="p-3 rounded mb-1 bg-white"
									onChangeText={onChange}
									onBlur={onBlur}
									value={value}
									placeholder="Email"
									keyboardType="email-address"
								/>
							)}
							name="email"
							defaultValue=""
							rules={{
								required: "Email is required",
								pattern: {
									value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
									message: "Email is not valid",
								},
							}}
						/>
						{errors.email && (
							<Text className="text-red-500">
								{errors.email.message?.toString()}
							</Text>
						)}
					</View>

					<View className="mb-6">
						<Controller
							control={control}
							render={({
								field: { onChange, onBlur, value },
							}) => (
								<View className="relative">
									<TextInput
										className="p-3 rounded mb-1 pr-10 bg-white"
										onChangeText={onChange}
										onBlur={onBlur}
										value={value}
										placeholder="Password"
										secureTextEntry={!showPassword}
									/>
									<TouchableOpacity
										className="text-blue-500 absolute inset-y-0 right-0 px-3 flex justify-center"
										onPress={() =>
											setShowPassword(!showPassword)
										}
									>
										<FontAwesome
											name={
												showPassword
													? "eye"
													: "eye-slash"
											}
											size={20}
										/>
									</TouchableOpacity>
								</View>
							)}
							name="password"
							defaultValue=""
							rules={{
								required: "Password is required",
								minLength: {
									value: 6,
									message:
										"Password must be at least 6 characters",
								},
								maxLength: {
									value: 20,
									message:
										"Password cannot exceed 20 characters",
								},
							}}
						/>
						{errors.password && (
							<Text className="text-red-500">
								{errors.password.message?.toString()}
							</Text>
						)}
					</View>

					<TouchableOpacity
						className="bg-accent p-3 rounded shadow-lg mb-4"
						onPress={handleSubmit(onSubmit)}
					>
						<Text className="text-white text-center font-bold">
							{isSubmitting ? (
								<FontAwesome name="spinner" size={20} spin />
							) : (
								<FontAwesome name="sign-in" size={20} />
							)}
						</Text>
					</TouchableOpacity>

					<View className="mt-4 flex justify-center">
						<Text className="text-white">
							Don't have an account?{" "}
							<Link href="/sign-up" className="text-accent">
								Sign Up
							</Link>
						</Text>
					</View>
				</View>
			</ImageBackground>
		</View>
	)
}
