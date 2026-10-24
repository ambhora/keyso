<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Algebra

This page defines the algebra of key-value sets in general terms. The sets of
keys and values are left open; [Semantics](semantics.md) fixes them for Keyso.

## Keys, values and paths

!!! definition "Definition 1: Keys and values"

    Let $\calK$ be a set whose elements are called **keys** and $\calV$ a set
    whose elements are called **values**.

!!! definition "Definition 2: Paths"

    A **path** is a finite non-empty sequence of keys $p = (k_1, \dots, k_n)$,
    written $k_1.k_2.\cdots.k_n$. The set of paths is $\calK^{+}$, and
    $\calK^{*} = \calK^{+} \cup \{\varepsilon\}$ adds the empty sequence
    $\varepsilon$.

    For $q \in \calK^{*}$ and $p \in \calK^{+}$, the **concatenation** $q.p$ is
    the path $q$ followed by $p$, with $\varepsilon.p = p$. A path $p$ is a
    **prefix** of a path $q$, written $p \sqsubseteq q$, if $q = p.r$ or $q = p$
    for some $r \in \calK^{+}$. The **prefix closure** of a set of paths $T$ is

    $$
    {\downarrow}T = \{\, p \in \calK^{+} \mid p \sqsubseteq q \text{ for some } q \in T \,\}.
    $$

A key is a path of length one. When every path has length one, the definitions
below reduce to those of an algebra of flat key-value sets.

## Types

!!! definition "Definition 3: Type"

    A **type** is a finite set of paths $T \subseteq \calK^{+}$ that is
    **prefix-free**: for $p, q \in T$, $p \sqsubseteq q$ implies $p = q$.

The set $\{\texttt{system}, \texttt{build.compiler}, \texttt{build.mpi}\}$ is a
type. The set $\{\texttt{build}, \texttt{build.mpi}\}$ is not, because
$\texttt{build} \sqsubseteq \texttt{build.mpi}$. Every subset of a type is a
type.

!!! definition "Definition 4: Order on types"

    For types $T_1$ and $T_2$, let $T_1 \leq T_2$ if and only if
    $T_1 \subseteq T_2$. This is a partial order. If $T_1 \leq T_2$, then $T_1$
    is a **specialization** of $T_2$ and $T_2$ is a **generalization** of $T_1$.

### Coherence

!!! definition "Definition 5: Coherence"

    The **coherence** of two types is the set of paths of either type that are
    prefixes of paths of the other:

    $$
    \langle T_1, T_2 \rangle = (T_1 \cap {\downarrow}T_2) \cup (T_2 \cap {\downarrow}T_1).
    $$

    The types are **coherent** if $T_1 = T_2$, **anticoherent** if
    $\langle T_1, T_2 \rangle = \varnothing$, and **partially coherent**
    otherwise. The coherence of two configurations, or of two configuration
    sets, is the coherence of their types.

For coherent types, $\langle T, T \rangle = T$. When every path has length one,
${\downarrow}T = T$ and the coherence is the intersection $T_1 \cap T_2$. With
longer paths, $\{\texttt{build.compiler}\}$ and $\{\texttt{build.mpi}\}$ are
anticoherent, while
$\langle \{\texttt{build}\}, \{\texttt{build.mpi}\} \rangle = \{\texttt{build}\}$.
The empty type is coherent with itself and anticoherent with every type.

!!! theorem "Theorem 1: Union of anticoherent types"

    If $T_1$ and $T_2$ are anticoherent, then $T_1 \cap T_2 = \varnothing$ and
    $T_1 \cup T_2$ is a type.

    *Proof.* A path in $T_1 \cap T_2$ lies in $T_1 \cap {\downarrow}T_2$, which
    is empty. Paths $p \in T_1$ and $q \in T_2$ with $p \sqsubseteq q$ would
    place $p$ in $T_1 \cap {\downarrow}T_2$, and symmetrically for
    $q \sqsubseteq p$. Pairs within $T_1$ or within $T_2$ are covered by those
    types being prefix-free. $\square$

## Configurations

!!! definition "Definition 6: Configuration"

    A **configuration** of type $T$ is a function $c \colon T \to \calV$,
    written as the set of its pairs

    $$
    c = \{\, (p, c[p]) \mid p \in T \,\} \subseteq \calK^{+} \times \calV.
    $$

    The pair $(p, v)$ is a **component** of $c$, and $v = c[p]$ is the **value
    of $c$ at $p$**. The type of $c$ is $\calT(c) = T$. The empty set
    $\varnothing$ is the **empty configuration**, of type $\varnothing$.

The configuration

$$
c = \{(\texttt{system}, \texttt{jedi}), (\texttt{build.compiler}, \texttt{gcc})\}
$$

has $\calT(c) = \{\texttt{system}, \texttt{build.compiler}\}$. In YAML it is
written `{system: jedi, build: {compiler: gcc}}`.

## Projection and product of configurations

!!! definition "Definition 7: Projection"

    Let $c$ be a configuration and $T \leq \calT(c)$. The **projection** of $c$
    onto $T$ is

    $$
    \pi(c; T) = \{\, (p, v) \in c \mid p \in T \,\}.
    $$

    The configuration $c$ is an **extension** of $\pi(c; T)$, and the
    **quotient** of the projection is
    $c \,/\, \pi(c; T) = c \setminus \pi(c; T) = \pi(c; \calT(c) \setminus T)$.

!!! definition "Definition 8: Product of configurations"

    The **product** of two anticoherent configurations $c_1$ and $c_2$ is

    $$
    c_1 \times c_2 = c_1 \cup c_2,
    $$

    a configuration of type $\calT(c_1) \cup \calT(c_2)$. The product extends
    $c_1$ by $c_2$.

By Theorem 1, the union of the types is a type and no path appears twice, so
the product is a configuration. It is commutative and associative, and the empty
configuration is its unit.

!!! theorem "Theorem 2: Projection and product are inverse"

    For a configuration $c$ and a type $T \leq \calT(c)$,

    $$
    c = \pi(c; T) \times \bigl(c \,/\, \pi(c; T)\bigr).
    $$

    Conversely, for anticoherent configurations $c_1$ and $c_2$,

    $$
    \pi(c_1 \times c_2; \calT(c_1)) = c_1 \quad\text{and}\quad (c_1 \times c_2) \,/\, c_1 = c_2.
    $$

    *Proof.* The projection and the quotient partition the components of $c$ by
    whether their path lies in $T$. Their types $T$ and $\calT(c) \setminus T$
    are subsets of the prefix-free set $\calT(c)$, so no path of one is a prefix
    of a path of the other, and the types are anticoherent. For the converse,
    the components of $c_1 \times c_2$ with paths in $\calT(c_1)$ are exactly
    those of $c_1$, because the two types are disjoint. $\square$

## Prefixing

!!! definition "Definition 9: Prefixing"

    For a sequence of keys $q \in \calK^{*}$, a type $T$ and a configuration
    $c$, let

    $$
    q \cdot T = \{\, q.p \mid p \in T \,\}, \qquad
    q \cdot c = \{\, (q.p, v) \mid (p, v) \in c \,\}.
    $$

    For a path $q$, the **part of $c$ below $q$** is
    $c \mathbin{/\!/} q = \{\, (p, v) \mid (q.p, v) \in c \,\}$.

!!! theorem "Theorem 3: Prefixing"

    For every $q \in \calK^{*}$:

    1. $q \cdot T$ is a type, $q \cdot c$ is a configuration of type
       $q \cdot \calT(c)$, and $\varepsilon \cdot c = c$.
    2. For a path $q$, $(q \cdot c) \mathbin{/\!/} q = c$. In particular,
       $c \mapsto q \cdot c$ is injective.
    3. $T_1$ and $T_2$ are anticoherent if and only if $q \cdot T_1$ and
       $q \cdot T_2$ are.
    4. For anticoherent $c_1$ and $c_2$,
       $q \cdot (c_1 \times c_2) = (q \cdot c_1) \times (q \cdot c_2)$.

    *Proof.* Concatenation with a fixed $q$ is injective, and
    $q.p \sqsubseteq q.r$ holds if and only if $p \sqsubseteq r$. The first and
    third items follow because prefixing therefore preserves and reflects the
    prefix order. The second follows from the definition of the part below $q$,
    and the fourth because prefixing distributes over the union of components.
    $\square$

## Configuration spaces and sets

!!! definition "Definition 10: Configuration space"

    The **configuration space** of a type $T$ is the set of all configurations
    of that type:

    $$
    \calC(T) = \{\, c \mid c \text{ is a configuration and } \calT(c) = T \,\}.
    $$

The space $\calC(\varnothing) = \{\varnothing\}$ contains only the empty
configuration. For a non-empty type, $\calC(T)$ is as large as the set of
functions from $T$ to $\calV$ and is in general infinite.

!!! definition "Definition 11: Configuration set"

    A **configuration set** of type $T$ is a pair $(T, S)$ where $S$ is a finite
    subset of $\calC(T)$. Its type is $\calT(T, S) = T$ and its size is $|S|$.
    Where the type is clear, the set is written $S$.

The type is recorded with the set because the empty set is a subset of every
configuration space: $(\{\texttt{compiler}\}, \varnothing)$ and
$(\{\texttt{system}\}, \varnothing)$ are different configuration sets.

## Operations on configuration sets

!!! definition "Definition 12: Product"

    The **product** of configuration sets $(T_1, S_1), \dots, (T_n, S_n)$,
    $n \geq 1$, with pairwise anticoherent types is

    $$
    \prod_{i=1}^{n} (T_i, S_i) = \Bigl(\, \bigcup_{i=1}^{n} T_i,\; \{\, c_1 \times \dots \times c_n \mid c_i \in S_i \,\} \Bigr).
    $$

!!! theorem "Theorem 4: Size and laws of the product"

    For anticoherent configuration sets $S_1$ and $S_2$,

    $$
    |S_1 \times S_2| = |S_1| \cdot |S_2|.
    $$

    The product is commutative and associative, its unit is
    $(\varnothing, \{\varnothing\})$, and the product with an empty
    configuration set is empty.

    *Proof.* By Theorem 2, the map $c \mapsto (\pi(c; T_1), \pi(c; T_2))$ is
    a bijection from $S_1 \times S_2$ onto the Cartesian product of $S_1$ and
    $S_2$, with inverse $(c_1, c_2) \mapsto c_1 \times c_2$. The laws follow
    from those of the product of configurations. $\square$

!!! definition "Definition 13: Union, intersection and difference"

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

!!! definition "Definition 14: Choice set"

    For a path $p \in \calK^{+}$ and a finite set of values $A \subseteq \calV$,
    the **choice set** of $p$ over $A$ is

    $$
    [p \mapsto A] = \bigl(\{p\},\; \{\, \{(p, a)\} \mid a \in A \,\}\bigr).
    $$

    It has type $\{p\}$ and size $|A|$.

Choice sets are the building blocks of grids. For distinct keys,

$$
[\texttt{compiler} \mapsto \{\texttt{gcc}, \texttt{clang}\}] \times [\texttt{opt} \mapsto \{\texttt{O0}, \texttt{O2}\}]
$$

is the configuration set of type $\{\texttt{compiler}, \texttt{opt}\}$
containing four configurations.

## Nesting

!!! definition "Definition 15: Nesting"

    The **nesting** of a configuration set $(T, S)$ under $q \in \calK^{*}$ is

    $$
    q \cdot (T, S) = \bigl(q \cdot T,\; \{\, q \cdot c \mid c \in S \,\}\bigr).
    $$

Nesting under the empty sequence is the identity,
$\varepsilon \cdot (T, S) = (T, S)$. Using a set as it is and placing it under a
key are therefore one operation with different prefixes.

!!! theorem "Theorem 5: Nesting is a homomorphism"

    For every $q \in \calK^{*}$:

    1. $|q \cdot S| = |S|$.
    2. For anticoherent $S_1$ and $S_2$,
       $q \cdot (S_1 \times S_2) = (q \cdot S_1) \times (q \cdot S_2)$.
    3. For coherent $S_1$ and $S_2$, nesting commutes with union, intersection
       and difference:
       $q \cdot (S_1 \cup S_2) = (q \cdot S_1) \cup (q \cdot S_2)$, and likewise
       for $\cap$ and $\setminus$.
    4. For a path $p$ and values $A$, $q \cdot [p \mapsto A] = [q.p \mapsto A]$.

    *Proof.* The first item holds because prefixing is injective on
    configurations, by Theorem 3. The second follows from the fourth item of
    Theorem 3, applied to every pair of configurations. The third holds
    because an injective map commutes with union, intersection and difference of
    sets. The fourth is immediate from the definitions. $\square$

Nesting a grid therefore gives a grid on prefixed paths:

$$
\texttt{build} \cdot \bigl([\texttt{compiler} \mapsto A] \times [\texttt{mpi} \mapsto B]\bigr) = [\texttt{build.compiler} \mapsto A] \times [\texttt{build.mpi} \mapsto B].
$$

Nesting a set of empty type leaves it unchanged:
$q \cdot (\varnothing, \{\varnothing\}) = (\varnothing, \{\varnothing\})$, so no
trace of $q$ remains. [Semantics](semantics.md) therefore requires a nested set
to have a non-empty type.
