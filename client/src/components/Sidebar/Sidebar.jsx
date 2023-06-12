import Header from "../Header/Header";
import Contacts from "../Contacts/Contacts";

import "./Sidebar.css";

const Sidebar = ({ user }) => {

	return (
		<aside className="app__sidebar">
			<Header user={user}/>
			<Contacts user={user}/>
		</aside>
	);
};

export default Sidebar;
