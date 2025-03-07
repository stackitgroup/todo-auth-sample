# Use a Node.js base image with Alpine Linux
FROM public.ecr.aws/docker/library/node:22.8.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Enable Corepack (required for pnpm)
RUN corepack enable

# Install pnpm globally
RUN corepack install -g pnpm@10.0.0

# Copy only package.json and pnpm-lock.yaml for dependency caching
COPY pnpm-lock.yaml package.json ./

# Install dependencies using pnpm
# Cache the pnpm store in a Docker layer
RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build

# Expose necessary ports
EXPOSE 3000
EXPOSE 3001
EXPOSE 3002
EXPOSE 80

# Start the application
CMD ["pnpm", "run", "start"]