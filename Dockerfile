FROM public.ecr.aws/lambda/nodejs:20-arm64

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm ci --only=production

# Set the CMD to your handler (this will be overridden by SAM template)
CMD ["dist/handlers/createUser.handler"]