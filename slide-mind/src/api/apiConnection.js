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
                        Create short description of the contents. Description should be usable in search functionality and have all the necessary information from the powerpoint.
                        List maximum of 3 keywords that describe the content in general way. These keywords will be used for a search functionality.
                        List all links present in the content as an array.

                        Respond in the following JSON format:
                        {
                            "description": "<summary>",
                            "keywords": ["keyword1", "keyword2", "keyword3"]
                            "links": ["link1", "link2", "link3"]
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

