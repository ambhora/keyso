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

## A reserved prefix

Every word of the language begins with `_`, and keys never do. A language word
cannot be mistaken for a key, wherever it appears. Reserving a prefix rather
than individual words also means that a later version can add a word without
changing the meaning of any valid document. An earlier draft used plain words
such as `operation` and `flatten`; in operand position they looked like ordinary
keys.

## One way to refer, one way to nest

A bare name uses another set as it is. A `_nested` value places it under a key.
The two are told apart by their shape: a name is a string and an inline operand
is a dictionary. In the algebra both are nestings, the first with the empty
prefix, so the language needs no word for the first.

## Paths

Nesting prefixes paths instead of storing configurations inside configurations.
A nested configuration is a configuration over dotted paths, and the nested
dictionary is how it is written. This keeps one notion of configuration and one
notion of type. Type requirements are checked on paths, so two nested sets with
the same inner keys can be combined, and dotted keys reach into nested positions
where a set operation needs them.

## Marked dictionaries

A dictionary in a document is either a construct to interpret or data to keep.
Keyso never guesses. In an inline operand, every dictionary value is marked as
`_interval`, `_literal` or `_nested`. In a configuration operand, a dictionary
describes paths and a dictionary value is marked with `_literal`. Normal forms
keep the marker, so writing a configuration and reading it back gives the same
configuration.

## No bare null

In YAML, a key with nothing after its colon is null. A reference operand written
with a stray colon, `- build:` instead of `- build`, would otherwise be a valid
operand with a null value. Requiring `{_literal: null}` makes the slip an error.

## Typed empty sets

A configuration set records its type even when it is empty. An empty difference
still has a type, so it can take part in later operations whose type
requirements are checked as usual.

## No restrictions on values

Keyso does not restrict the values a path may take. In a data transfer, the
operating system of the source and of the destination may admit different
values. Paths keep the two apart as `source.os` and `destination.os`, but a
restriction per key would make the meaning of `os` depend on where a set is
used, and sets would no longer compose locally. Restrictions on values belong to
schemas and validators built on Keyso.

## Language, not implementation

This site specifies the language on a data model. It does not depend on YAML,
JSON or any implementation, and an implementation is correct when it agrees with
the [formalism](formalism/index.md).
