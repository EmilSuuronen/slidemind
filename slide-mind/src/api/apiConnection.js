import React from "react";
import axios from "axios";

export const callOpenAiAPI = async (fileContents) => {
    const apiKey =  process.env.REACT_APP_OPENAI_API_KEY;
    try {
        const result = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: `Your task is to create the JSON object from the given text content extracted from this PowerPoint file:
                        ${fileContents}
                        Stay always strict to these rules:
                        - Create short summary of the contents of the document called description.
                        - List maximum of 3 keywords describing the content.
                        - The keywords should not be too unique: use words which can be used in multiple contexts and files and re-use them accordingly.
                        - List all links present in the content as an array.
                        - Create a "contentSuggestion" field: small bulleted list of contents if the user were to 
                        re-use the powerpoint to create a new powerpoint. Use exact references from the text.
                        - Create analysis of content that might be outdated or incorrect which might require further research called "informationValidity",
                        - If the language of the extracted text I have given is Finnish your the response should ALWAYS be in Finnish.

                        Respond in the following JSON format:
                        {
                            "description": "<summary>",
                            "keywords": ["keyword1", "keyword2", "keyword3"],
                            "links": ["link1", "link2", "link3"],
                            "contentSuggestion": "",
                            "informationValidity": ""
                        }`
                    }
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );
        const responseData = result.data.choices[0].message.content;
        console.log("OpenAI API response:", responseData);
        const parsedResponse = JSON.parse(responseData)
        return (parsedResponse);
    } catch (error) {
        console.error("Error calling OpenAI API", error);
    }
};

