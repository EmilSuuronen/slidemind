import * as PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import SelectFileButton from '../fileSelectButton/FileSelectButton.js'
import './topbar-styles.css'

function TopbarItem(props) {
	return null
}

TopbarItem.propTypes = { title: PropTypes.string }

function debounce(func, delay) {
	let timer
	return (...args) => {
		clearTimeout(timer)
		timer = setTimeout(() => func(...args), delay)
	}
}

function Topbar({ onSearch, onKeywordSelect, keywords, onFileProcessed }) {
	const [searchQuery, setSearchQuery] = useState('')
	const [keywordQuery, setKeywordQuery] = useState('')

	const debouncedOnSearch = useCallback(
		debounce((query) => onSearch(query), 500),
		[onSearch]
	)

	const debouncedOnKeywordSelect = useCallback(
		debounce((keyword) => onKeywordSelect(keyword), 500),
		[onKeywordSelect]
	)

	const handleSearchChange = (event) => {
		const query = event.target.value
		setSearchQuery(query)
		debouncedOnSearch(query)
	}

	const handleKeywordChange = (event) => {
		const selectedKeyword = event.target.value
		setKeywordQuery(selectedKeyword)
		debouncedOnKeywordSelect(selectedKeyword)
	}

	const filteredKeywords = keywords.filter((keyword) =>
		keyword.toLowerCase().includes(keywordQuery.toLowerCase())
	)

	return (
		<div className='div-topbar-main'>
			<h1>Slide Mind</h1>
			<div className='spacer' />
			<div className='topbar-menu'>
				<div className='search-section'>
					<label htmlFor='search-input'>
						<b>Search</b>
					</label>
					<input
						className='search-input-field'
						title='search'
						placeholder='Search'
						value={searchQuery}
						onChange={handleSearchChange}
						id='search-input'
					/>
				</div>
				<div className='keyword-section'>
					<label htmlFor='keyword-input'>
						<b>Keywords</b>
					</label>
					<div className='keyword-dropdown'>
						<input
							className='search-input-field'
							type='text'
							placeholder='Filter by keyword'
							value={keywordQuery}
							onChange={handleKeywordChange}
							list='keyword-options'
							id='keyword-input'
						/>
						<datalist id='keyword-options'>
							{filteredKeywords.map((keyword, index) => (
								<option key={index} value={keyword} />
							))}
						</datalist>
					</div>
				</div>
			</div>
			<div className='spacer' />
			<SelectFileButton onFileProcessed={onFileProcessed} />
		</div>
	)
}

Topbar.propTypes = {
	onSearch: PropTypes.func.isRequired,
	onKeywordSelect: PropTypes.func.isRequired,
	keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
	onFileProcessed: PropTypes.func.isRequired,
}

export default Topbar
