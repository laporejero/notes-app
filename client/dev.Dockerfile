FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Start dev server with host binding for Docker
CMD ["npm", "run", "dev", "--", "--host"]
