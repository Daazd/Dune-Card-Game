
FROM node:16 as build

# Set the working directory in the container
WORKDIR /usr/src/app


COPY package*.json ./

# Install the dependencies
RUN npm install


COPY . .

# Build the application for production
RUN npm run build

# Use a smaller base image for the production environment
FROM node:16-alpine


WORKDIR /usr/src/app


COPY --from=build /usr/src/app/build ./build


COPY package*.json ./
RUN npm install --only=production

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
