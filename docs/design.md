<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Design notes

The reasons behind the shape of Keyso.

## Sets of configurations

Configuration descriptions tend to add complexity of their own. Grids with
exclusion lists grow a new exclusion for every irregularity, and rule-based
descriptions hide the structure of the set behind conditions. Keyso describes a
set by the operations that build it: product, union, intersection and difference
of smaller sets. A description written this way is only as complex as the set it
describes, and every step of it is itself a set.

## Flat documents and named definitions

A document maps names to definitions, and definitions never contain other
definitions. Every intermediate set therefore has a name: it can be inspected,
reused and tested on its own, and an error points to a named definition rather
than a position deep inside an expression. Each definition names exactly one
operation, so it reads like one equation of the algebra.

## Flatten and nested are both explicit

A named set can be used in two ways that produce different types: its keys can
join the result, or its configurations can become the values of one key. Neither
use is a default. A bare name could be read either way, and in YAML a stray
colon turns a bare name into a key with a null value, which is valid but means
something else. Writing `flatten: build` or `build: {nested: build}` states the
type of the result at the point of use, and makes both uses equally visible to
the reader.

## Marked dictionaries

A dictionary in a document is either a construct to interpret or data to keep.
Keyso never guesses: every dictionary value of an inline operand is marked as
`interval`, `literal` or `nested`, and a plain dictionary is invalid. Under
`set`, where operands are complete configurations, all values are data.

## Words instead of sigils

Reserved words are plain words in fixed positions: `operation` and `flatten` as
item keys, `interval`, `literal` and `nested` as the single key of a dictionary
value. Earlier drafts marked keywords with a leading underscore. Positions make
the same distinction without reserving a character, and keep documents readable.

## Typed empty sets

A configuration set records its type even when it is empty. An empty difference
still has a type, so it can take part in later operations whose type
requirements are checked as usual, and an empty result never silently changes
the type of a document.

## No restrictions on values

Keyso does not restrict the values a key may take. In a data transfer between a
source and a destination, the key `os` may need different admissible values on
each side. Nesting keeps that structure, with `source: {nested: ...}` and
`destination: {nested: ...}`, but a per-key restriction would make the meaning
of `os` depend on where a set is used, and sets would no longer compose locally.
Restrictions on values belong to schemas and validators built on Keyso.

## Language, not implementation

This site specifies the language on a data model. It does not depend on YAML,
JSON or any implementation, and an implementation is correct when it agrees with
the [formalism](formalism/index.md).
