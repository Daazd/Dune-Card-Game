#ARG CACHEBUST=1
#
## Use the official Node.js image as the base image
#FROM node:18 as build
#
## Set the environment variable
#ENV REACT_APP_API_URL=http://dune-backend-service:8000/api
#ENV REACT_APP_MEDIA_URL=http://dune-backend-service:8000/media
#
## Set the working directory
#WORKDIR /app
#
## Copy package.json and package-lock.json files to the working directory
#COPY package*.json ./
#
## Install the dependencies
#RUN npm install
#
## Copy the rest of the application code to the working directory
#COPY . .
#
#RUN echo "CACHEBUST=${CACHEBUST}"
#
## Build the application for production
#ARG REACT_APP_API_URL
#ARG REACT_APP_MEDIA_URL
#RUN REACT_APP_API_URL=$REACT_APP_API_URL REACT_APP_MEDIA_URL=$REACT_APP_MEDIA_URL npm run build
#
## Use a smaller base image for the production environment
#FROM nginx:alpine
#
## Copy the nginx configuration
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#
## Copy the built application from the previous stage
#COPY --from=build /app/dist /usr/share/nginx/html
#
## Expose the port the app runs on
#EXPOSE 80
#
## Command to run the application
#CMD ["nginx", "-g", "daemon off;"]

#TEST

# Use the official Node.js image as the base image
FROM node:18 as build

# Set the environment variable
ENV REACT_APP_API_URL=http://dune-backend-service:8000/api
ENV REACT_APP_MEDIA_URL=http://dune-backend-service:8000/media

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application for production
ARG REACT_APP_API_URL
ARG REACT_APP_MEDIA_URL
RUN REACT_APP_API_URL=$REACT_APP_API_URL REACT_APP_MEDIA_URL=$REACT_APP_MEDIA_URL npm run build

# Use a smaller base image for the production environment
FROM nginx:alpine

# Copy the nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built application from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Command to run the application
CMD ["nginx", "-g", "daemon off;"]


