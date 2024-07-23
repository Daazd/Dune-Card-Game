# Use the official Node.js image as the base image
FROM node:18 as build

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application for production
RUN npm run build

# Use a smaller base image for the production environment
FROM nginx:alpine

# Copy the built application from the previous stage
COPY --from=build /dist /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Command to run the application
CMD ["nginx", "-g", "daemon off;"]



