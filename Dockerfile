# Use an image that includes Chrome and Node.js
FROM browserless/chrome:latest

USER root

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci

# Copy the rest of your application
COPY . .

# Build the Next.js application
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_STRIPE_PUBLIC_KEY
ARG NEXT_PUBLIC_STRIPE_SECRET_KEY

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_STRIPE_PUBLIC_KEY=$NEXT_PUBLIC_STRIPE_PUBLIC_KEY
ENV NEXT_PUBLIC_STRIPE_SECRET_KEY=$NEXT_PUBLIC_STRIPE_SECRET_KEY

# Remove unnecessary files
RUN rm -rf jest.config.ts
RUN rm -rf deno

# Build your application
RUN npm run build

# Expose the ports needed for your app and Chrome
EXPOSE 3000

# Start your application
CMD ["npm", "run", "start"]
