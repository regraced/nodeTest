#!/bin/bash


docker compose down

cd node && npm install && cd ..
cd react && npm install && cd ..

docker compose build
docker compose up

