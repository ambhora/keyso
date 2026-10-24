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

## Two reserved prefixes

Every word of the language begins with `_`, every reference to a definition
begins with `$`, and keys begin with neither. A language word or a reference can
therefore not be mistaken for a key, wherever it appears. Reserving a prefix
rather than individual words also means that a later version can add a word
without changing the meaning of any valid document. An earlier draft used plain
words such as `operation` and `flatten`; in operand position they looked like
ordinary keys.

## One construct for references

A reference `$name` denotes the named set nested under the path where it is
written. As an operand it is written at the empty path and merges the set
unchanged; as the value of a key it places the set under that key. In the
algebra both are nestings, so the language needs a single construct. Earlier
drafts used a bare name for the first position and a `_nested` marker for the
second; a bare name looked like a value, and the marker described a reference as
if it were a value.

The cost of the `$` prefix is that a value cannot begin with `$` unmarked.
Environment variables such as `$SCRATCH` are common in configurations, so such
data is written with `_literal`. A `$` string in any other position is an error,
never a silent change of meaning, and Keyso has no interpolation that would make
`$a/$b` a template.

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
`_interval` or `_literal`. In a configuration operand, a dictionary
describes paths and a dictionary value is marked with `_literal`. Normal forms
keep the marker, so writing a configuration and reading it back gives the same
configuration.

## No bare null

In YAML, a key with nothing after its colon is null. An inline operand written
with a stray colon, `- compiler:` with its values forgotten, would otherwise be
a valid operand with a null value. Requiring `{_literal: null}` makes the slip
an error. The same slip on a reference, `- $build:`, fails twice: the key begins
with `$` and its value is null.

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
