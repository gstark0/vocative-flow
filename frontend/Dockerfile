# Use an official Node runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Install dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install

# Copy the local code to the container
COPY . .

# Make port 3000 available outside this container
EXPOSE 3000

# Define environment variable
ENV NAME Frontend

# Run the app
CMD ["npm", "start"]
