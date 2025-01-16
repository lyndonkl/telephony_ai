FROM node:18-alpine

WORKDIR /app

# First, copy configuration files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Now copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"] 