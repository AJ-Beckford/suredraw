#!/bin/bash
# Location: network/couchdb/init.sh

# Updated ports list
PORTS=(15984 16984 17984)

# System databases
for port in "${PORTS[@]}"; do
  echo "Initializing CouchDB on port $port"
  
  # System databases
  curl -X PUT http://admin:adminpw@localhost:$port/_users
  curl -X PUT http://admin:adminpw@localhost:$port/_replicator
  curl -X PUT http://admin:adminpw@localhost:$port/_global_changes

  # Application databases
  curl -X PUT http://admin:adminpw@localhost:$port/readygroups
  curl -X PUT http://admin:adminpw@localhost:$port/adminwallet
  curl -X PUT http://admin:adminpw@localhost:$port/prospectivepools

  # Deploy indexes to readygroups database
  echo "Deploying indexes to port $port"
  curl -X PUT http://admin:adminpw@localhost:$port/readygroups/_design/indexes \
    -d @indexes.json \
    -H "Content-Type: application/json"

  echo -e "Port $port initialization complete\n"
done

echo "CouchDB cluster initialization completed successfully"