import "./Message.css";

const Message = ({ placement, content }) => {
	return (
		<div className="chat__message" style={{
			alignSelf: placement,
		}}>
			<div style={{margin: "5px"}}>
			{ content }
			</div>
		</div>
	);
}

export default Message;
