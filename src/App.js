import EditorParent from "./editor/EditorParent";

function App() {
	return (
		<div className="container mt-5">
			<h4 className="display-5 text-center mb-2">Video Trimming Proof of Concept</h4>
			<p className="text-center text-danger">Video maximum 59 saniye ve mp4 olmali</p>
			<EditorParent />
		</div>
	);
}

export default App;

