import React from 'react';
import './keyword-styles.css';

function Keyword(keywords) {

    const inputtedKeywords = keywords.keywords;

    return (
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
            {inputtedKeywords.map((inputtedKeywords, index) => (
                <span
                    key={index}
                    className="keyword-span"
                >{inputtedKeywords}</span>
            ))}
        </div>
    );
}

export default Keyword;
