# Keyso Language

Keyso is a dictionary-based language for describing finite sets of configurations.

A Keyso document does not describe one configuration only. It describes a **configuration space**: a finite set whose elements are configurations.

```keyso
{
  "_product": [
    {"compiler": ["gcc", "clang"]},
    {"optimization": ["O0", "O2"]}
  ]
}
```

This describes the four configurations obtained by combining the two compiler choices with the two optimization choices.

## Scope of this documentation

This website documents the Keyso **language** only.

It intentionally does not document any parser, emitter, package, command-line tool, or implementation API. A Keyso document may be represented by any host system that can represent dictionaries, lists, strings, numbers, booleans, and null-like values.

## Core ideas

- A configuration is a mapping from keys to values.
- A configuration type is the set of keys present in a configuration.
- A configuration space is a finite set of configurations with the same type.
- `_product` combines independent configuration spaces with disjoint keys.
- `_union`, `_intersection`, and `_difference` operate on configuration spaces with the same type.
- `_set` explicitly enumerates a finite configuration space.
- `_literal` marks an object as data.
- `_nested` evaluates an independent Keyso document and uses each result as a value.

## Minimal example

```keyso
{
  "_product": [
    {"system": ["jedi", "jupiter"]},
    {"compiler": ["gcc", "clang"]},
    {"mpi": ["openmpi", "mpich"]}
  ]
}
```

The result is a configuration space with type:

```text
{system, compiler, mpi}
```
