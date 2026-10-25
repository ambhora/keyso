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

## One reserved prefix

Every word of the language is a dictionary key beginning with `_`, and keys of
configurations never begin with `_`. A language word can therefore not be
mistaken for a key, wherever it appears. Reserving a prefix rather than
individual words also means that a later version can add a word without
changing the meaning of any valid document. Only keys are reserved: string
values are never interpreted, so the language places no rule on their content.
An earlier draft used plain words such as `operation` and `flatten`; in operand
position they looked like ordinary keys.

## One construct for references

A reference `{_ref: name}` denotes the named set nested under the path where it
is written. As an operand it is written at the empty path and merges the set
unchanged; as the value of a key it places the set under that key. In the
algebra both are nestings, so the language needs a single construct. A reference
is a marked dictionary like `_literal` and `_interval`, so it is recognized by
its structure and never by the content of a string.

Earlier drafts used other forms. A bare name looked like a value. A `_nested`
marker described a reference as if it were a value. A `$` prefix reserved a
class of strings, so that data such as `$SCRATCH/install` had to be escaped, and
every string had to be checked for a leading `$`.

## Paths

Nesting prefixes paths instead of storing configurations inside configurations.
A nested configuration is a configuration over dotted paths, and the nested
dictionary is how it is written. This keeps one notion of configuration and one
notion of type. Type requirements are checked on paths, so two nested sets with
the same inner keys can be combined, and dotted keys reach into nested positions
where a set operation needs them.

## Marked dictionaries

A dictionary in a document is either a construct to interpret or data to keep.
Keyso never guesses. As the value of an operand entry, every dictionary is
marked as `_ref`, `_interval` or `_literal`. In a configuration operand, a
dictionary describes paths and a dictionary value is marked with `_literal`.
Normal forms keep the marker, so writing a configuration and reading it back
gives the same configuration.

## Values are strings

Keyso documents are written in KORML, whose scalars are text, and Keyso adds no
types of its own. `16`, `true` and `3.10` are strings, two values are equal
when they are the same string, and no value changes when a document is
re-serialized. There is no null; a key with nothing after its colon is already
invalid KORML. Typed interpretation of values, like restrictions on them,
belongs to the tools that consume configurations. `_interval` is the one
construct that reads strings as integers, and it writes its results back as
strings.

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

This site specifies the language on a data model of strings, lists and
dictionaries, the document model of KORML. It does not depend on any
implementation, and an implementation is correct when it agrees with the
[formalism](formalism/index.md).
