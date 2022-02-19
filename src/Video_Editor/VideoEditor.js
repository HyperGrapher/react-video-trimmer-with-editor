import React from "react";
import { FileDrop } from "react-file-drop";
import { BASE_URL } from "../utils/constants";
import "./css/editor.css";
import Editor from "./Editor";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLightbulb, faMoon } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

class VideoEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isUpload: true,
			videoUrl: "",
			isDarkMode: false,
			resFileName: "",
			resFilePath: "",
		};
	}

	componentDidMount = () => {
		this.toggleThemes();
		document.addEventListener("drop", function (e) {
			e.preventDefault();
			e.stopPropagation();
		});
	};

	render_uploader = () => {
		return (
			<div className={"wrapper"}>
				<input onChange={(e) => this.upload_file(e.target.files)} type="file" className="hidden" id="up_file" />
				<FileDrop
					onDrop={(e) => this.upload_file(e)}
					onTargetClick={() => document.getElementById("up_file").click()}
				>
					Tiklayin yada editlemek istediginiz videoyu buraya surukleyin!
				</FileDrop>
			</div>
		);
	};

	saveVideo = async (metadata) => {
		// console.log("metadata");
		// console.log(metadata);
		// alert("Please check your console to see all the metadata. This can be used for video post-processing.")
	
    

		try {
			const res = await axios.post(`${BASE_URL}/trim`, metadata );

			if(res.status === 201) {
				// console.log('setting video url');
				window.open(`${BASE_URL}/video_out.mp4`, '_blank');
				// this.setState({ videoUrl: `http://localhost:4000/video_out.mp4` });
			}


			// console.log(`Response: ${res.data}`);
		} catch (error) {
			console.error(error.response);

		}
    
    };

	render_editor = () => {
		return (
			// Props:
			// videoUrl --> URL of uploaded video
			// saveVideo(<metadata of edited video>) --> gives the cut times and if video is muted or not
			<Editor videoUrl={this.state.videoUrl} saveVideo={this.saveVideo} />
		);
	};

	toggleThemes = () => {
		if (this.state.isDarkMode) {
			document.body.style.backgroundColor = "#1f242a";
			document.body.style.color = "#fff";
		} else {
			document.body.style.backgroundColor = "#fff";
			document.body.style.color = "#1f242a";
		}
		this.setState({ isDarkMode: !this.state.isDarkMode });
	};

	upload_file = async (fileInput) => {

		let fileUrl = window.URL.createObjectURL(fileInput[0]);
		// let filename = fileInput.name;

		console.log(`file ${fileUrl}`);
		this.setState({
			isUpload: false,
			videoUrl: fileUrl,
		});

		const formData = new FormData();
		formData.append("file", fileInput[0]);

		try {
			const res = await axios.post(`${BASE_URL}/upload`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			const { filename, filepath } = res.data;
			this.setState({ resFileName: filename, resFilePath: filepath });

			console.log(`Response: ${filename} -- ${filepath}`);
		} catch (error) {
			console.error(error.response);

			/*
if(error.response.status === 500) console.log('Server error');
            else 
            */
		}
	};

	render = () => {
		return (
			<div>
				{this.state.isUpload ? this.render_uploader() : this.render_editor()}
				{/* <div className={"theme_toggler"} onClick={this.toggleThemes}>{this.state.isDarkMode? (<i className="toggle" aria-hidden="true"><FontAwesomeIcon icon={faLightbulb} /></i>) : <i className="toggle"><FontAwesomeIcon icon={faMoon} /></i>}</div> */}
			</div>
		);
	};
}

export default VideoEditor;
