<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Formalism

Keyso rests on an algebra of key-value sets. A configuration assigns values to
paths of keys, a configuration set is a finite set of configurations of one
type, and a document combines configuration sets with set operations. This
section states these ideas mathematically in two layers.

- **[Algebra](algebra.md)** gives the general definitions: keys, paths, values,
  types, coherence, configurations, configuration spaces and sets, and the
  operations on them, including nesting. It is independent of any syntax and
  leaves the sets of keys and values open.
- **[Semantics](semantics.md)** gives the Keyso-specific definitions. It fixes
  keys and values for Keyso, defines how configurations are written as
  dictionaries, and maps every definition of a document to a configuration set
  of the algebra.

The [language](../language/index.md) section describes the same rules
informally. Where the two differ, this section is authoritative.

## Notation

| Symbol | Meaning |
| --- | --- |
| $\calK$, $\calV$ | the set of keys and the set of values |
| $\calK^{+}$, $\calK^{*}$ | the paths, and the sequences of keys including the empty sequence $\varepsilon$ |
| $q.p$ | the concatenation of a sequence of keys $q$ and a path $p$ |
| $p \sqsubseteq q$ | $p$ is a prefix of $q$ |
| ${\downarrow}T$ | the prefixes of the paths in $T$ |
| $\langle T_1, T_2 \rangle$ | the coherence of two types |
| $c$, $c[p]$ | a configuration and its value at path $p$ |
| $\calT(c)$ | the type of a configuration: its set of paths |
| $\pi(c; T)$ | the projection of a configuration onto a type |
| $q \cdot c$, $q \cdot (T, S)$ | prefixing a configuration or a configuration set with $q$ |
| $\calC(T)$ | the configuration space of type $T$ |
| $(T, S)$ | a configuration set $S \subseteq \calC(T)$ of type $T$ |
| $[p \mapsto A]$ | the choice set of path $p$ over the values $A$ |
| $\rho(c)$ | the written form of a configuration |
| $\sem{x}$ | the configuration set denoted by a construct $x$ |
