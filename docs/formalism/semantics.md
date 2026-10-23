<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Semantics

This page fixes the keys and values of the [algebra](algebra.md) for Keyso,
defines how a configuration is written as a dictionary, and maps every
definition of a document to a configuration set.

## Data model

A Keyso document is a value of a data model of strings, numbers, booleans, null,
lists and dictionaries. The definitions below use this model and not a
serialization.

!!! definition "Definition 16: Data"

    Let $\Sigma$ be the set of strings. The set of **scalars** $\calA$ contains
    the strings, the numbers, the booleans $\texttt{true}$ and $\texttt{false}$,
    and $\texttt{null}$. The set of **data** $\calD$ is the smallest set such
    that

    1. every scalar is data: $\calA \subseteq \calD$;
    2. every finite sequence $(d_1, \dots, d_n)$ of data, $n \geq 0$, is data
       and is called a **list**;
    3. every function $d$ from a finite subset of $\Sigma$ to $\calD$ is data
       and is called a **dictionary**.

    Two data are equal when they are structurally equal: scalars by value, lists
    element by element, and dictionaries key by key.

## Language words

!!! definition "Definition 17: Language words"

    A **language word** is a string that begins with $\texttt{\_}$. The words in
    use are $\texttt{\_operation}$, $\texttt{\_nested}$, $\texttt{\_literal}$
    and $\texttt{\_interval}$. The **operation names** are
    $\calO = \{\texttt{product}, \texttt{union}, \texttt{intersection}, \texttt{difference}, \texttt{set}\}$.

Every language word is reserved, including the words not yet in use. A later
version of the language can therefore add a word without changing the meaning of
any valid document.

## Keys, paths and values of Keyso

!!! definition "Definition 18: Keys and values"

    In Keyso, the set of keys $\calK \subseteq \Sigma$ contains the non-empty
    strings that do not begin with $\texttt{\_}$ and do not contain
    $\texttt{.}$, and the values are the data, $\calV = \calD$.

    A path $(k_1, \dots, k_n)$ is written as the string $k_1.k_2.\cdots.k_n$. A
    **path string** is a string written this way.

Because keys contain no $\texttt{.}$, a path string determines its path.

## Written form of configurations

A configuration is written as a dictionary that nests one level per key of its
paths. A value written in it must not be mistaken for further paths, so
dictionaries and null are marked.

!!! definition "Definition 19: Written form"

    The **written form** of a value $v \in \calD$ is

    $$
    \rho(v) =
    \begin{cases}
    v & \text{if } v \text{ is a list, or a scalar other than } \texttt{null}, \\
    \{\texttt{\_literal}: v\} & \text{if } v \text{ is a dictionary or } \texttt{null}.
    \end{cases}
    $$

    The **written form** $\rho(c)$ of a non-empty configuration $c$ is the
    dictionary whose keys are the first keys of the paths in $\calT(c)$, and
    whose entry at a key $k$ is

    $$
    \rho(c)[k] =
    \begin{cases}
    \rho(c[k]) & \text{if } k \in \calT(c), \\
    \rho(c \mathbin{/\!/} k) & \text{otherwise}.
    \end{cases}
    $$

The written form is well defined because the type is prefix-free: a key $k$ is
either a path of the configuration or the first key of longer paths, never both,
and in the second case the part of $c$ below $k$ is non-empty.

!!! definition "Definition 20: Reading a configuration operand"

    A dictionary $d$ with one or more entries, whose keys are path strings, is
    **read** as the set of components
    $\mathrm{read}(d) = \bigcup_{(s, e) \in d} \mathrm{read}(p_s, e)$, where
    $p_s$ is the path of $s$ and

    $$
    \mathrm{read}(p, e) =
    \begin{cases}
    \{(p, e)\} & \text{if } e \text{ is a list, or a scalar other than } \texttt{null}, \\
    \{(p, x)\} & \text{if } e = \{\texttt{\_literal}: x\}, \\
    p \cdot \mathrm{read}(e) & \text{if } e \text{ is a non-empty dictionary of path strings}.
    \end{cases}
    $$

    Every other entry is invalid. The dictionary is a **configuration operand**
    when $\mathrm{read}(d)$ is a configuration: its paths are distinct and form
    a type.

!!! proposition "Proposition 6: Reading inverts writing"

    For every non-empty configuration $c$, $\mathrm{read}(\rho(c)) = c$. In
    particular, $\rho$ is injective.

    *Proof.* By induction on the length of the longest path of $c$. A written
    value is a list, a scalar other than $\texttt{null}$, or a dictionary whose
    only key $\texttt{\_literal}$ is not a path string, so $\mathrm{read}$ takes
    the first two cases exactly for written values and recovers the value. A
    written part $\rho(c \mathbin{/\!/} k)$ is a dictionary of path strings,
    read by the third case as $k \cdot (c \mathbin{/\!/} k)$ by the induction
    hypothesis. The union over all first keys is $c$. $\square$

A configuration operand need not be a written form: it may spell paths with
dots, as in $\{\texttt{host.compiler}: \texttt{gcc}\}$, and mix dotted and
nested entries. Every configuration operand denotes the configuration it reads
as.

## Documents

!!! definition "Definition 21: Document"

    A **document** is a dictionary $\delta$ whose keys are **names** and whose
    values are **definitions**. Names are keys in the sense of Definition 18. A
    definition is a list of items containing exactly one **operation item**
    $\{\texttt{\_operation}: o\}$ with $o \in \calO$; the other items are its
    **operands**, in order.

    The **reference graph** of $\delta$ has the names of $\delta$ as vertices
    and an edge from $n$ to $m$ when the definition of $n$ contains the
    reference operand $m$ or an inline operand with the value
    $\{\texttt{\_nested}: m\}$.

    The document is **well formed** when every name used in a reference operand
    or a $\texttt{\_nested}$ value is a name of $\delta$ and the reference graph
    has no cycle.

In a well-formed document, the definitions can be evaluated in an order in which
every definition follows the definitions it refers to. The definitions below are
recursive along this order, which is well founded because the graph is finite
and acyclic. For a name $n$ of $\delta$, write $\sem{n} = (T_n, S_n)$ for the
configuration set its definition denotes.

## Values of inline operands

!!! definition "Definition 22: Value sets"

    The **value set** $\mathrm{val}(v) \subseteq \calD$ of the value $v$ of an
    inline operand is:

    | Value $v$ | $\mathrm{val}(v)$ | Condition |
    | --- | --- | --- |
    | $a$ | $\{a\}$ | $a \in \calA$, $a \neq \texttt{null}$ |
    | $(a_1, \dots, a_n)$ | $\{a_1, \dots, a_n\}$ | $a_i \in \calA$, $a_i \neq \texttt{null}$ |
    | $\{\texttt{\_interval}: \{\texttt{start}: s, \texttt{stop}: e, \texttt{step}: r\}\}$ | $\{\, s + i r \mid i \in \mathbb{N},\; s + i r \leq e \,\}$ | $s, e \in \mathbb{Z}$, $s \leq e$, $r \in \mathbb{Z}$, $r \geq 1$ |
    | $\{\texttt{\_literal}: d\}$ | $\{d\}$ | $d \in \calD$ |

    In an interval, the field $\texttt{step}$ may be omitted and then $r = 1$.
    The value $\{\texttt{\_nested}: m\}$ is treated in Definition 23. Every
    other value is invalid; in particular, $\texttt{null}$ and every dictionary
    that is not a single language-word entry of this table or of
    $\texttt{\_nested}$.

## Operands

!!! definition "Definition 23: Operands"

    The configuration set denoted by an operand of a definition other than
    $\texttt{set}$ is:

    | Operand | Denotes | Condition |
    | --- | --- | --- |
    | reference operand $m$ | $\varepsilon \cdot \sem{m} = \sem{m}$ | $m$ a name of $\delta$ |
    | $\{s: \{\texttt{\_nested}: m\}\}$ | $p_s \cdot \sem{m}$ | $m$ a name of $\delta$, $T_m \neq \varnothing$ |
    | $\{s: v\}$, any other value | $[p_s \mapsto \mathrm{val}(v)]$ | $v$ valid |

    Here $s$ is a path string and $p_s$ its path. Under $\texttt{set}$, a
    configuration operand $d$ denotes the configuration $\mathrm{read}(d)$.

A reference operand and a nested operand are both nestings in the sense of
Definition 15, with the empty prefix and with the path of the operand. By
Proposition 5, an inline operand with a dotted key is the nesting of an inline
operand with a plain key:
$\sem{\{\texttt{run.nodes}: v\}} = \texttt{run} \cdot \sem{\{\texttt{nodes}: v\}}$.

## Definitions

!!! definition "Definition 24: Meaning of a definition"

    Let the definition of $n$ have the operation $o$ and the operands
    $x_1, \dots, x_r$. Then

    | $o$ | $\sem{n}$ | Requirement |
    | --- | --- | --- |
    | $\texttt{product}$ | $\sem{x_1} \times \dots \times \sem{x_r}$ | $r \geq 1$, pairwise anticoherent types |
    | $\texttt{union}$ | $\sem{x_1} \cup \dots \cup \sem{x_r}$ | $r \geq 1$, coherent types |
    | $\texttt{intersection}$ | $\sem{x_1} \cap \dots \cap \sem{x_r}$ | $r \geq 1$, coherent types |
    | $\texttt{difference}$ | $\sem{x_1} \setminus \sem{x_2}$ | $r = 2$, coherent types |
    | $\texttt{set}$ | $(T, \{\mathrm{read}(x_1), \dots, \mathrm{read}(x_r)\})$ | $r \geq 1$, every $x_i$ a configuration operand of type $T$ |

    Under $\texttt{product}$, $\texttt{union}$, $\texttt{intersection}$ and
    $\texttt{difference}$, every operand is a reference operand or an inline
    operand. Under $\texttt{set}$, every operand is a configuration operand.

    A definition is **valid** when its operands are valid and its requirement
    holds. A document is **valid** when it is well formed and all its
    definitions are valid.

## Equivalence and normal form

!!! definition "Definition 25: Equivalence and normal form"

    Two definitions, in the same document or in different documents, are
    **equivalent** when they denote the same configuration set. A definition
    with $\sem{n} = (T, S)$ and $S \neq \varnothing$ has the **normal form**

    $$
    \bigl[\, \rho(c_1), \dots, \rho(c_{|S|}), \{\texttt{\_operation}: \texttt{set}\} \,\bigr],
    $$

    where $c_1, \dots, c_{|S|}$ are the configurations of $S$ in any order.

By Proposition 6, the normal form of a definition is equivalent to it, and two
definitions with non-empty sets are equivalent exactly when their normal forms
contain the same written configurations. A definition whose set is empty has no
normal form, because a $\texttt{set}$ needs at least one configuration to
determine its type.

## Remarks

Keyso does not restrict the values of a path. Restricting values per key would
make the meaning of a key depend on where a configuration set is used, and would
weaken the composition of sets. Paths keep such distinctions available without
restrictions: $\texttt{source.os}$ and $\texttt{destination.os}$ are different
paths. Restrictions on values belong to schemas and validation tools built on
top of Keyso.
