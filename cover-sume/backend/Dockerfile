FROM node:18

#install latex
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra

WORKDIR /backend

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "server.js"]