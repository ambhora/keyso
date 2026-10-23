<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Formalism

Keyso rests on an algebra of key-value sets. A configuration is a set of
key-value pairs, a configuration set is a set of configurations of one type, and
a document combines configuration sets with set operations. This section states
these ideas mathematically in two layers.

- **[Algebra](algebra.md)** gives the general definitions: keys, values,
  configurations, types, coherence, configuration spaces and sets, and the
  operations on them, including nesting and flattening. It is independent of any
  syntax and leaves the sets of keys and values open.
- **[Semantics](semantics.md)** gives the Keyso-specific definitions. It fixes
  keys and values for Keyso and maps every definition of a document to a
  configuration set of the algebra.

The [language](../language/index.md) section describes the same rules
informally. Where the two differ, this section is authoritative.

## Notation

| Symbol | Meaning |
| --- | --- |
| $\calK$, $\calV$ | the set of keys and the set of values |
| $c$, $c[k]$ | a configuration and the value of key $k$ in it |
| $\calT(c)$ | the type of a configuration: its set of keys |
| $\langle T_1, T_2 \rangle$ | the coherence of two types |
| $\pi(c; T)$ | the projection of a configuration onto a type |
| $\calC(T)$ | the configuration space of type $T$ |
| $(T, S)$ | a configuration set $S \subseteq \calC(T)$ of type $T$ |
| $[k \mapsto A]$ | the choice set of key $k$ over the values $A$ |
| $\nu_k$, $\varphi$ | nesting under key $k$, and flattening |
| $\sem{x}$ | the configuration set denoted by a construct $x$ |
