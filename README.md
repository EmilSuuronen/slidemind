# SlideMind

## About the application

SlideMind is an application for searching and viewing your presentation files and analyzing them easily with AI generated information to help with organizing your clutter.

![alt text](https://github.com/EmilSuuronen/slidemind/blob/main/res/Screenshot%202024-12-11%20160733.png?raw=true)
## Technologies and features
- Desktop application built using Electron
- React frontend
- OpenAI API for AI analysis of files
- Manage your files to save your data locally
- Automatically generated descriptions, content validity information and content suggestion with AI.
- Search, open and find your files
- View documents directly inside the application
- Support for .ppt, .pptx and .pdf files

## Download SlideMind and documentation from https://emilsuuronen.github.io/slidemind-home/

## Using the application source code

Clone the application with `git clone https://github.com/EmilSuuronen/slidemind`

### Installing libraries:

Install required libraries with `npm install`

### Additional dependencies:

The application requires an OpenAi API key to work.
Create a new file named `.env` in `/slide-mind` folder
The `.env` requires following line inside:
`REACT_APP_OPENAI_API_KEY=your-API-key-here`

You will also need to create a new empty folder: `/tempfiles` inside the `/src` folder for pdf files created by the application.

### Running the application

Locate to the `/src` folder in cmd or git bash with:

`cd slide-mind/src`

Install dependencies with
`npm install`

You are required to run the React front end with:
`npm start`

Open another git bash session

Locate to the `/src` folder in cmd or git bash with:

`cd slide-mind/src`

Run the electron application with:
`npm run electron`
