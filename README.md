# Product Module

# Technology Used
1. Backend : 
    - Node Js
    - Express
    - JWT authentication
    - Crypto Js 
    - Python
    - Fast API
    -Sentence transformer

2.  Database : 
    - Mongo DB

# Install the project 
```git
git clone https://github.com/DevTandem/ProductModule.git
```

# Initialize node environment
```shell
npm init
```

# Install the node packages
```shell
npm i <package name>
```

# Packages used
1. bcryptjs
2. dotenv
3. express
4. init
5. jsonwebtoken
6. mongoose
7. path
8. nodemon
9. axios


# Server setup
Add the following line of code in "Scripts" of package.json : 
```JSON
"dev": "nodemon app.js"
```

# Setup env for node server
```env
JWT_SECRET_KEY = <your value>
Mongo_URL = <mongo db url>
DB_NAME = <database name>
```

# Start the node server
Paste the following in the terminal where the node js environment has been set up
```shell
npm run dev
```

# Setup search engine
Install python and pip 
Run the following command to install dependencies:
```shell
pip install <dependency name>
```

# Dependencies used
1. fastapi
2. sentence_transformers
3. pymongo
4. dotenv
5. pydantic
6. uvicorn

# Setup env for search engine
```env
Mongo_URL = <mongo db url>
DB_NAME = <database name>
```

# Start the search engine
Paste the following in the terminal where python environment has been setup
```shell
uvicorn generate_embedding:app --host 0.0.0.0 --port 8000 --reload
```