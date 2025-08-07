FROM node:22 as build

RUN apt-get update && apt-get dist-upgrade -y
RUN useradd -m appuser
WORKDIR /app 
COPY package*.json ./ 
RUN npm install 

COPY . . 
RUN mkdir -p /app/build
RUN chown -R appuser /app
USER appuser 

EXPOSE 5173
CMD ["npm", "run", "dev"]