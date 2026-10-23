<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Algebra

This page defines the algebra of key-value sets in general terms. The sets of
keys and values are left open; [Semantics](semantics.md) fixes them for Keyso.

## Keys, values and configurations

!!! definition "Definition 1: Keys and values"

    Let $\calK$ be a set whose elements are called **keys** and $\calV$ a set
    whose elements are called **values**. A **key-value pair** is a pair
    $(k, v) \in \calK \times \calV$.

!!! definition "Definition 2: Configuration"

    A **configuration** is a finite set $c \subseteq \calK \times \calV$ of
    key-value pairs whose keys are pairwise distinct:

    $$
    (k, v) \in c \;\text{and}\; (k, v') \in c \implies v = v'.
    $$

    A pair $(k, v) \in c$ is a **component** of $c$, and $v$ is the **value of
    $k$ in $c$**, written $c[k] = v$. The empty set $\varnothing$ is the **empty
    configuration**.

A configuration is therefore a function from a finite set of keys to values,
written as the set of its pairs. The configuration

$$
c = \{(\texttt{compiler}, \texttt{gcc}), (\texttt{opt}, \texttt{O2})\}
$$

has $c[\texttt{compiler}] = \texttt{gcc}$ and $c[\texttt{opt}] = \texttt{O2}$.
In YAML it is written `{compiler: gcc, opt: O2}`.

## Types

!!! definition "Definition 3: Type"

    The **type** of a configuration $c$ is its set of keys:

    $$
    \calT(c) = \{\, k \in \calK \mid (k, v) \in c \text{ for some } v \in \calV \,\}.
    $$

    A **type** is a finite subset of $\calK$.

The configurations
$\{(\texttt{compiler}, \texttt{gcc}), (\texttt{opt}, \texttt{O2})\}$ and
$\{(\texttt{compiler}, \texttt{clang}), (\texttt{opt}, \texttt{O3})\}$ have the
same type $\{\texttt{compiler}, \texttt{opt}\}$.

!!! definition "Definition 4: Order on types"

    For types $T_1$ and $T_2$, let $T_1 \leq T_2$ if and only if
    $T_1 \subseteq T_2$. This is a partial order. If $T_1 \leq T_2$, then $T_1$
    is a **specialization** of $T_2$ and $T_2$ is a **generalization** of $T_1$.

### Coherence

!!! definition "Definition 5: Coherence"

    The **coherence** of two types is their intersection:

    $$
    \langle T_1, T_2 \rangle = T_1 \cap T_2.
    $$

    The types are **coherent** if $T_1 = T_2$, **anticoherent** if
    $\langle T_1, T_2 \rangle = \varnothing$, and **partially coherent**
    otherwise. The coherence of two configurations, or of two configuration
    sets, is the coherence of their types.

The empty type is both coherent with itself and anticoherent with every type.
Union, intersection and difference require coherent operands; the product
requires anticoherent operands.

## Projection and product of configurations

!!! definition "Definition 6: Projection"

    Let $c$ be a configuration and $T \leq \calT(c)$. The **projection** of $c$
    onto $T$ is

    $$
    \pi(c; T) = \{\, (k, v) \in c \mid k \in T \,\}.
    $$

    The configuration $c$ is an **extension** of $\pi(c; T)$, and the
    **quotient** of the projection is
    $c \,/\, \pi(c; T) = c \setminus \pi(c; T) = \pi(c; \calT(c) \setminus T)$.

!!! definition "Definition 7: Product of configurations"

    The **product** of two anticoherent configurations $c_1$ and $c_2$ is

    $$
    c_1 \times c_2 = c_1 \cup c_2,
    $$

    a configuration of type $\calT(c_1) \cup \calT(c_2)$. The product extends
    $c_1$ by $c_2$.

The product is a configuration because the types are disjoint, so no key appears
twice. It is commutative and associative, and the empty configuration is its
unit.

!!! proposition "Proposition 1: Projection and product are inverse"

    For a configuration $c$ and a type $T \leq \calT(c)$,

    $$
    c = \pi(c; T) \times \bigl(c \,/\, \pi(c; T)\bigr).
    $$

    Conversely, for anticoherent configurations $c_1$ and $c_2$,

    $$
    \pi(c_1 \times c_2; \calT(c_1)) = c_1 \quad\text{and}\quad (c_1 \times c_2) \,/\, c_1 = c_2.
    $$

    *Proof.* The projection and the quotient partition the pairs of $c$ by
    whether their key lies in $T$; their types are $T$ and
    $\calT(c) \setminus T$, which are disjoint. For the converse, the pairs of
    $c_1 \times c_2$ with keys in $\calT(c_1)$ are exactly the pairs of $c_1$,
    because $\calT(c_1)$ and $\calT(c_2)$ are disjoint. $\square$

## Configuration spaces and sets

!!! definition "Definition 8: Configuration space"

    The **configuration space** of a type $T$ is the set of all configurations
    of that type:

    $$
    \calC(T) = \{\, c \mid c \text{ is a configuration and } \calT(c) = T \,\}.
    $$

The space $\calC(\varnothing) = \{\varnothing\}$ contains only the empty
configuration. For a non-empty type, $\calC(T)$ is as large as the set of
functions from $T$ to $\calV$ and is in general infinite.

!!! definition "Definition 9: Configuration set"

    A **configuration set** of type $T$ is a pair $(T, S)$ where $S$ is a finite
    subset of $\calC(T)$. Its type is $\calT(T, S) = T$ and its size is $|S|$.
    Where the type is clear, the set is written $S$.

The type is recorded with the set because the empty set is a subset of every
configuration space: $(\{\texttt{compiler}\}, \varnothing)$ and
$(\{\texttt{system}\}, \varnothing)$ are different configuration sets.

## Operations on configuration sets

!!! definition "Definition 10: Product"

    The **product** of configuration sets $(T_1, S_1), \dots, (T_n, S_n)$,
    $n \geq 1$, with pairwise anticoherent types is

    $$
    \prod_{i=1}^{n} (T_i, S_i) = \Bigl(\, \bigcup_{i=1}^{n} T_i,\; \{\, c_1 \times \dots \times c_n \mid c_i \in S_i \,\} \Bigr).
    $$

!!! proposition "Proposition 2: Size and laws of the product"

    For anticoherent configuration sets $S_1$ and $S_2$,

    $$
    |S_1 \times S_2| = |S_1| \cdot |S_2|.
    $$

    The product is commutative and associative, its unit is
    $(\varnothing, \{\varnothing\})$, and the product with an empty
    configuration set is empty.

    *Proof.* By Proposition 1, the map $c \mapsto (\pi(c; T_1), \pi(c; T_2))$ is
    a bijection from $S_1 \times S_2$ onto the Cartesian product of $S_1$ and
    $S_2$, with inverse $(c_1, c_2) \mapsto c_1 \times c_2$. The laws follow
    from those of the product of configurations. $\square$

!!! definition "Definition 11: Union, intersection and difference"

    For configuration sets $(T, S_1), \dots, (T, S_n)$ of one type $T$,
    $n \geq 1$,

    $$
    \bigcup_{i=1}^{n} (T, S_i) = \Bigl(T, \bigcup_{i=1}^{n} S_i\Bigr), \qquad
    \bigcap_{i=1}^{n} (T, S_i) = \Bigl(T, \bigcap_{i=1}^{n} S_i\Bigr),
    $$

    and for two such sets

    $$
    (T, S_1) \setminus (T, S_2) = (T, S_1 \setminus S_2).
    $$

These operations are the ordinary set operations on subsets of one configuration
space $\calC(T)$. They are undefined for operands of different types.

## Choice sets

!!! definition "Definition 12: Choice set"

    For a key $k \in \calK$ and a finite set of values $A \subseteq \calV$, the
    **choice set** of $k$ over $A$ is

    $$
    [k \mapsto A] = \bigl(\{k\},\; \{\, \{(k, a)\} \mid a \in A \,\}\bigr).
    $$

    It has type $\{k\}$ and size $|A|$.

Choice sets are the building blocks of grids. For distinct keys,

$$
[\texttt{compiler} \mapsto \{\texttt{gcc}, \texttt{clang}\}] \times [\texttt{opt} \mapsto \{\texttt{O0}, \texttt{O2}\}]
$$

is the configuration set of type $\{\texttt{compiler}, \texttt{opt}\}$
containing four configurations.

## Nesting and flattening

Nesting uses configurations as values. For the rest of this page, assume that
the configurations under consideration are themselves values:
$\calC(T) \subseteq \calV$ for every type $T$ that occurs.

!!! definition "Definition 13: Nesting"

    The **nesting** of a configuration set $(T, S)$ under a key $k \in \calK$ is
    the choice set of $k$ over $S$:

    $$
    \nu_k(T, S) = [k \mapsto S] = \bigl(\{k\},\; \{\, \{(k, c)\} \mid c \in S \,\}\bigr).
    $$

!!! definition "Definition 14: Flattening"

    The **flattening** of a configuration set is the set itself:

    $$
    \varphi(T, S) = (T, S).
    $$

The two maps describe the two ways of using one configuration set inside
another. A nested set contributes the single key $k$, whatever its own type; a
flattened set contributes its own type. Flattening is the identity on
configuration sets. It is named so that every use of a set states which of the
two maps applies.

!!! proposition "Proposition 3: Nesting preserves information"

    The map $c \mapsto \{(k, c)\}$ is injective, so $|\nu_k(T, S)| = |S|$.

    Let $(T, S)$ and $(T', S')$ be anticoherent configuration sets and
    $k \notin T'$. Then

    $$
    u(c) = c[k] \times \pi(c; T')
    $$

    is a bijection from $\nu_k(T, S) \times (T', S')$ onto
    $\varphi(T, S) \times (T', S')$, with inverse

    $$
    u^{-1}(c) = \{(k, \pi(c; T))\} \times \pi(c; T').
    $$

    *Proof.* Injectivity holds because $\{(k, c)\}$ determines $c$ as its value
    of $k$. A configuration of $\nu_k(T, S) \times S'$ has the form
    $\{(k, s)\} \times s'$ with $s \in S$ and $s' \in S'$, and $u$ maps it to
    $s \times s'$, which is defined because $T$ and $T'$ are disjoint. By
    Proposition 1, $u^{-1}(s \times s') = \{(k, s)\} \times s'$, and the two
    maps are mutually inverse. $\square$

Both forms therefore describe the same choices. They differ in their types and
in their requirements: the flattened product needs $T \cap T' = \varnothing$,
while the nested product needs only $k \notin T'$. When $T$ and $T'$ share keys,
only nesting is defined.
