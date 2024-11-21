// src/components/Sidebar.js
import * as PropTypes from "prop-types";
import './sidebar-styles.css';
import React, {useCallback, useState} from 'react';

function SidebarItem(props) {
    return null;
}

SidebarItem.propTypes = {title: PropTypes.string};

function debounce(func, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

function Sidebar({ onSearch, onKeywordSelect, keywords }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [keywordQuery, setKeywordQuery] = useState('');

    // Debounced versions of the callback functions
    const debouncedOnSearch = useCallback(
        debounce((query) => onSearch(query), 300), // 300ms delay
        [onSearch]
    );

    const debouncedOnKeywordSelect = useCallback(
        debounce((keyword) => onKeywordSelect(keyword), 300), // 300ms delay
        [onKeywordSelect]
    );

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        debouncedOnSearch(query); // Call the debounced function
    };

    const handleKeywordChange = (event) => {
        const selectedKeyword = event.target.value;
        setKeywordQuery(selectedKeyword);
        debouncedOnKeywordSelect(selectedKeyword); // Call the debounced function
    };

    // Filter keywords based on the search query for the dropdown
    const filteredKeywords = keywords.filter(keyword =>
        keyword.toLowerCase().includes(keywordQuery.toLowerCase())
    );

    return (
        <div className="div-sidebar-main">
            <h1>Slide Mind</h1>
            <div className="sidebar-menu">
                <hr className="solid" />
                <b> Search </b>
                <input
                    className="search-input-field"
                    title="search"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <hr className="solid" />
                <b> Keywords </b>
                <div className="keyword-dropdown">
                    <input
                        className="search-input-field"
                        type="text"
                        placeholder="Filter by keyword"
                        value={keywordQuery}
                        onChange={handleKeywordChange}
                        list="keyword-options"
                    />
                    <datalist id="keyword-options">
                        {filteredKeywords.map((keyword, index) => (
                            <option key={index} value={keyword} />
                        ))}
                    </datalist>
                </div>
            </div>
        </div>
    );
}

Sidebar.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onKeywordSelect: PropTypes.func.isRequired,
    keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Sidebar;
