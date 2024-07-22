import { SessionProvider } from "@/hooks/useAuth"
import { Slot } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { NativeWindStyleSheet } from "nativewind"
import { GestureHandlerRootView } from "react-native-gesture-handler"

NativeWindStyleSheet.setOutput({
	default: "native",
})

export default function Root() {
	return (
		<SessionProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<StatusBar style="light" />
				<Slot />
			</GestureHandlerRootView>
		</SessionProvider>
	)
}
