import Header from "../Header/Header";
import Contacts from "../Contacts/Contacts";

import "./Sidebar.css";

const Sidebar = ({ user }) => {

	return (
		<div className="app__sidebar">
			<Header user={user}/>
			<Contacts user={user}/>
		</div>
	);
};

export default Sidebar;
