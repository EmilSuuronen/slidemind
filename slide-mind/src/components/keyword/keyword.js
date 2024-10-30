import React from 'react';

function Keyword(keywords) {

    const inputtedKeywords = keywords.keywords;

    return (
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
            {inputtedKeywords.map((inputtedKeywords, index) => (
                <span
                    key={index}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#5c5cff',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#333',
                        margin: '5px 0'
                    }}
                >{inputtedKeywords}</span>
            ))}
        </div>
    );
}

export default Keyword;
