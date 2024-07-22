import axios from "axios"

const AxiosManager = axios.create({
	baseURL: process.env.EXPO_PUBLIC_AUTH_API_URL,
	validateStatus(status) {
		return status < 500
	},
})

export default AxiosManager
