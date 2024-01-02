FROM node:16

# We have to install nodemon globally before moving into the working directory
RUN npm install -g nodemon

# Create app directory
WORKDIR /usr/src/bidding-system

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 5000

ARG NODE_ENV
ARG PORT
ARG DATABASE_URL
ARG DJANGO_API_PORT
ARG DJANGO_API_TOKEN_VERIFICATION_URL

RUN chmod +x ./start.sh

CMD ./start.sh