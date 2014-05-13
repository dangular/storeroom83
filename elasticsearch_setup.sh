#!/bin/bash
for entity in items storerooms vendors
do
    echo  Configuring ${entity} index...
    set V1 = `curl -XDELETE http://localhost:9200/${entity}`
    echo ${V1}
    set V2 = `curl -XDELETE http://localhost:9200/_river/s83_${entity}`
    echo ${V2}
    set V3 = `curl -XPUT --data @config/search/${entity}/${entity}_mapping.json http://localhost:9200/${entity}`
    echo ${V3}
    set V4 = `curl -XPUT --data @config/search/${entity}/${entity}_river.json http://localhost:9200/_river/s83_${entity}/_meta`
    echo ${V4}
done

