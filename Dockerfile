# syntax=docker/dockerfile:1

# React front-end
FROM node:16 AS client-build
WORKDIR /usr/src/signorm-docker
COPY client/ ./client/
COPY ["package.json", "package-lock.json", "./"] ./client/
RUN cd client && npm install && npm run build

# NodeJS back-end
FROM node:16 AS server-build
WORKDIR /usr/src/signorm-docker
COPY --from=client-build /usr/src/signorm-docker/client/build ./client/build
COPY ["package.json", "package-lock.json", "./"]
RUN npm install
COPY index.js ./
COPY preprocess.py ./

# Python dependencies
RUN apt update && apt install -y python3 python3-pip
RUN pip3 install numpy pandas scikit-learn matplotlib

EXPOSE 3000

CMD ["node", "index.js", "--expose-gc"]