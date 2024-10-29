import * as PropTypes from "prop-types";
import './sidebar-styles.css';

function SidebarItem(props) {
    return null;
}

SidebarItem.propTypes = {title: PropTypes.string};

function Sidebar() {
    return (
        <div className="div-sidebar-main">
            <h1>Slide Mind</h1>
            <div className="sidebar__menu">
                <input title="search" placeholder="Search"/>
                <SidebarItem title="Home"/>
                <SidebarItem title="About"/>
                <SidebarItem title="Contact"/>
            </div>
        </div>
    );
}

export default Sidebar;
