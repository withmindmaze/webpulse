# Use an image that includes Chrome and Node.js
FROM browserless/chrome:latest

USER root

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci
RUN npm i --save-dev @types/cookie

# Copy the rest of your application
COPY . .

# Remove unnecessary files
RUN rm -rf jest.config.ts

# Build your application
RUN npm run build

# Expose the ports needed for your app and Chrome
EXPOSE 3000

# Start your application
CMD ["npm", "run", "start"]
