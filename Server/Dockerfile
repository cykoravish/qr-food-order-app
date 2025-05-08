# Use Node.js base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the backend files
COPY . .

# Expose port (match your backend port)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
