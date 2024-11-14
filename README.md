# slidemind

## About the application



## Getting started

Clone the application with ```git clone https://github.com/EmilSuuronen/slidemind```

### Additional dependencies: 

The application requires an OpenAi API key to work.
Create a new file named ```.env``` in ```/slide-mind``` folder
The ```.env``` requires following line inside: 
```REACT_APP_OPENAI_API_KEY=your-API-key-here```

You will also need to create a new empty folder: ```tempfiles``` inside the ```/src``` folder for pdf files created by the application.

### Running the application

Locate to the ```/src``` folder in cmd

Install dependencies with
```npm install```

You are required to run the React front end with:
```npm start```

Run the electron application with:
```npm run electron```
