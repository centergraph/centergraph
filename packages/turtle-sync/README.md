# Turtle Sync

A function that loads turtle files from the hard disk and syncs them according to strategies to a RDF/js store or a SPARQL endpoint.

It can be used to sync configuration in the form of triples to your datastore. The main use-case is within a software development process where there is a product which receives configuration updates over time.

## Axioms

- Data is all saved in named graphs.

## TODO

- Load the existing SHACL shapes from the SPARQL endpoint or the store.
- Write back changes on the SPARQL endpoint or store to the disk.
