FROM node:18

# Install LaTeX
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra

# Set working directory to match your local setup
WORKDIR /cover-sume

# Copy everything except what's in .dockerignore
COPY . .

# Install backend deps
RUN cd backend && npm install

# Set permissions
RUN mkdir -p /cover-sume/backend/uploads && \
    chown -R node:node /cover-sume && \
    chmod -R 755 /cover-sume/backend/uploads

USER node

# Start from backend
WORKDIR /cover-sume/backend
CMD ["node", "server.js"]
