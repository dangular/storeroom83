#!/bin/sh
mongod --dbpath data/db --replSet rs0 --oplogSize 100
