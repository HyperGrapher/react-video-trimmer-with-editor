import "./css/editor.css";

const DisplayResult = ({ videoUrl }) => {
	return (
		<div className="result-wrapper">

			<video className="result-video mt-4" width="480"  controls>
				<source src={videoUrl} type="video/mp4" />
				Desteklenmeyen browser
			</video>
		</div>
	);
};

export default DisplayResult;
