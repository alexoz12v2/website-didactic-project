import Header from "../Header/Header";
import Contact from "../Contact/Contact";

import "./Sidebar.css";

const Sidebar = ({ user }) => {

	return (
		<div className="app__sidebar">
			<Header user={user}/>
			<Contact user={{
				avatar: "https://wallpapers.com/images/featured/87h46gcobjl5e4xu.jpg",
				name: {
					first: "bob",
					last: "rossi",
				},
			}} />
		</div>
	);
};

export default Sidebar;
