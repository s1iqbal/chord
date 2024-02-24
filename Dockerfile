# Dockerfile
FROM node:21-alpine
# Create app directory
# Create app directory
RUN mkdir -p /chord_bot/
WORKDIR /chord_bot/
 
COPY package.json /chord_bot/
RUN npm install
 
# Get all the code needed to run the app
COPY . /chord_bot/
 
# Expose the port the app runs in
EXPOSE 5000
 
# Serve the app
CMD ["npm", "start"]