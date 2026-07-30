const Loading = ({ text }) => {
	return (
		<div className="flex items-center gap-2 justify-center">
			<div className="w-5 h-5 border-2 border-gray-300 border-t-2 border-t-blue-500 rounded-full animate-spin"></div>
			<p>{text}</p>
		</div>

	)
}

export default Loading;
