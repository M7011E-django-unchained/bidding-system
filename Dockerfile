FROM node:16

# We have to install nodemon globally before moving into the working directory
RUN npm install -g nodemon

# Create app directory
WORKDIR /usr/src/bidding-system

# Set build arguments
ARG NODE_ENV = "production"
ARG PORT = 5000
ARG DATABASE_URL = "[mongo db url]"
ARG DJANGO_API_PORT = 8000
ARG DJANGO_API_TOKEN_VERIFICATION_URL = "[django api token verification url]"

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 5000

RUN chmod +x ./start.sh

CMD ./start.sh