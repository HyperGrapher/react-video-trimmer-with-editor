import React from "react";
import { FileDrop } from "react-file-drop";
import { BASE_URL } from "../utils/constants";
import "./css/editor.css";
import VideoEditor from "./VideoEditor";
import axios from "axios";
import DisplayResult from "./DisplayResult";

class EditorParent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isUpload: true,
			videoUrl: "",
			isDarkMode: true,
			resFileName: "",
			resFilePath: "",
			busy: false,
			result_url: "",
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
		this.setState({ busy: true });

		try {
			const res = await axios.post(`${BASE_URL}/trim`, metadata);

			if (res.status === 201) {
				this.setState({ busy: false, result_url: `${BASE_URL}/video_out.mp4` });
				console.log("setting video url: ", `${BASE_URL}/video_out.mp4`);
			}
		} catch (error) {
			console.error(error.response);
			this.setState({ busy: false });
		}
	};

	render_editor = () => {
		return <VideoEditor videoUrl={this.state.videoUrl} saveVideo={this.saveVideo} />;
	};

	display_result = () => {
		return <DisplayResult videoUrl={this.state.result_url} />;
	};

	upload_file = async (fileInput) => {
		let fileUrl = window.URL.createObjectURL(fileInput[0]);

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
		}
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

	render = () => {
		return this.state.result_url ? (
			this.display_result()
		) : (
			<div>
				{this.state.busy && (
					<div className="loader">
						<div className="cent">
							<div className="loading-indicator">
								<div></div>
								<div></div>
							</div>
						</div>
						<h5 className="text-center mt-3">Bekleyiniz..</h5>
					</div>
				)}
				{this.state.isUpload ? this.render_uploader() : this.render_editor()}
			</div>
		);
	};
}

export default EditorParent;
