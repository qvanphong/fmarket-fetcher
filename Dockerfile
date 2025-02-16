# Use official Node.js runtime
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependencies first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose API port
EXPOSE 3000

# Start the application
CMD ["node", "src/server.js"]
