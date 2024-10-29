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
                        content: `Create a short summary describing the contents and extract keywords for this PowerPoint content create 
                        maximum 3 keywords. If the file contains links, list them.
                        ${fileContents}

                        Respond in the following JSON format:
                        {
                            "description": "<summary>",
                            "keywords": ["keyword1", "keyword2", "keyword3"]
                            "links": ["link1", "link2", "link3"...]
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
        const parsedResponse = JSON.parse(responseData)
        return (parsedResponse);
    } catch (error) {
        console.error("Error calling OpenAI API", error);
    }
};

