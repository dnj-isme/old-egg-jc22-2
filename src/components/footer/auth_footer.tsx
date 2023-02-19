import { ThemeContext } from "@/contexts/ThemeContext"
import { useContext } from "react"

export default function AuthFooter() {

	const theme = useContext(ThemeContext)
	
	return (
		<footer className='flex-column align-center'>
			<div>
				<p style={{color: theme.textColor}} ><a>Term & Conditions</a> | <a>Privacy Policy</a></p>
			</div>
			<div>
				<p style={{color: theme.textColor}} >© 2000-2023 Newegg Inc. All rights reserved.</p>
			</div>
		</footer>
	)
}