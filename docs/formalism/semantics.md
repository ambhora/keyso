<!--
SPDX-FileCopyrightText: 2026 keyso developers
SPDX-License-Identifier: Apache-2.0
-->
# Semantics

This page fixes the keys and values of the [algebra](algebra.md) for Keyso and
maps every definition of a document to a configuration set.

## Data model

A Keyso document is a value of a data model of strings, numbers, booleans, null,
lists and dictionaries. The definitions below use this model and not a
serialization.

!!! definition "Definition 15: Data"

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

## Reserved words

!!! definition "Definition 16: Reserved words"

    The **item words** are
    $\calR_{\mathrm{item}} = \{\texttt{operation}, \texttt{flatten}\}$, the
    **value words** are
    $\calR_{\mathrm{value}} = \{\texttt{interval}, \texttt{literal}, \texttt{nested}\}$
    and the **operation names** are
    $\calO = \{\texttt{product}, \texttt{union}, \texttt{intersection}, \texttt{difference}, \texttt{set}\}$.

## Keys and values of Keyso

!!! definition "Definition 17: Keys and values"

    In Keyso, the keys are the strings other than the item words, and the values
    are the data:

    $$
    \calK = \Sigma \setminus \calR_{\mathrm{item}}, \qquad \calV = \calD.
    $$

A configuration in the sense of the algebra is a function from a finite set of
keys to data. Since every key is a string, every configuration is a dictionary,
and therefore data:

$$
\calC(T) \subseteq \calD = \calV \quad \text{for every type } T.
$$

This is the assumption under which the algebra defines
[nesting](algebra.md#nesting-and-flattening). In Keyso, every configuration set
can be nested.

## Documents

!!! definition "Definition 18: Document"

    A **document** is a dictionary $\delta$ whose keys are **names** and whose
    values are **definitions**. A definition is a list of items containing
    exactly one **operation item** $\{\texttt{operation}: o\}$ with
    $o \in \calO$; the other items are its **operands**, in order.

    The **reference graph** of $\delta$ has the names of $\delta$ as vertices
    and an edge from $n$ to $m$ when the definition of $n$ contains the operand
    $\{\texttt{flatten}: m\}$ or an inline operand with the value
    $\{\texttt{nested}: m\}$.

    The document is **well formed** when every name given to $\texttt{flatten}$
    or $\texttt{nested}$ is a name of $\delta$ and the reference graph has no
    cycle.

In a well-formed document, the definitions can be evaluated in an order in which
every definition follows the definitions it refers to. The definitions below are
recursive along this order, which is well founded because the graph is finite
and acyclic. For a name $n$ of $\delta$, write $\sem{n} = (T_n, S_n)$ for the
configuration set its definition denotes.

## Values of inline operands

!!! definition "Definition 19: Value sets"

    The **value set** $\mathrm{val}(v) \subseteq \calD$ of the value $v$ of an
    inline operand is:

    | Value $v$ | $\mathrm{val}(v)$ | Condition |
    | --- | --- | --- |
    | $a$ | $\{a\}$ | $a \in \calA$ |
    | $(a_1, \dots, a_n)$ | $\{a_1, \dots, a_n\}$ | $a_i \in \calA$ |
    | $\{\texttt{interval}: \{\texttt{start}: s, \texttt{stop}: e, \texttt{step}: p\}\}$ | $\{\, s + i p \mid i \in \mathbb{N},\; s + i p \leq e \,\}$ | $s, e \in \mathbb{Z}$, $s \leq e$, $p \in \mathbb{Z}$, $p \geq 1$ |
    | $\{\texttt{literal}: d\}$ | $\{d\}$ | $d \in \calD$ |
    | $\{\texttt{nested}: m\}$ | $S_m$ | $m$ a name of $\delta$ |

    In an interval, the field $\texttt{step}$ may be omitted and then $p = 1$.
    Every other value is invalid; in particular, a dictionary is invalid unless
    it has exactly one key and that key is a value word.

## Operands

!!! definition "Definition 20: Operands"

    The configuration set denoted by an operand is:

    $$
    \begin{aligned}
    \sem{\{k: v\}} &= [k \mapsto \mathrm{val}(v)] && k \in \calK, \\
    \sem{\{\texttt{flatten}: m\}} &= \varphi(\sem{m}) = \sem{m} && m \text{ a name of } \delta.
    \end{aligned}
    $$

    A **configuration operand** $\{k_1: d_1, \dots, k_n: d_n\}$ with $n \geq 1$,
    distinct $k_i \in \calK$ and $d_i \in \calD$ denotes the configuration

    $$
    \{(k_1, d_1), \dots, (k_n, d_n)\}.
    $$

    Its values are data and are not interpreted.

For a nested value, the first equation gives

$$
\sem{\{k: \{\texttt{nested}: m\}\}} = [k \mapsto S_m] = \nu_k(\sem{m}),
$$

so flatten operands and nested values denote the two maps $\varphi$ and $\nu_k$
of the algebra.

## Definitions

!!! definition "Definition 21: Meaning of a definition"

    Let the definition of $n$ have the operation $o$ and the operands
    $x_1, \dots, x_r$. Then

    | $o$ | $\sem{n}$ | Requirement |
    | --- | --- | --- |
    | $\texttt{product}$ | $\sem{x_1} \times \dots \times \sem{x_r}$ | $r \geq 1$, pairwise anticoherent types |
    | $\texttt{union}$ | $\sem{x_1} \cup \dots \cup \sem{x_r}$ | $r \geq 1$, coherent types |
    | $\texttt{intersection}$ | $\sem{x_1} \cap \dots \cap \sem{x_r}$ | $r \geq 1$, coherent types |
    | $\texttt{difference}$ | $\sem{x_1} \setminus \sem{x_2}$ | $r = 2$, coherent types |
    | $\texttt{set}$ | $(T, \{x_1, \dots, x_r\})$ | $r \geq 1$, every $x_i$ a configuration operand of type $T$ |

    Under $\texttt{product}$, $\texttt{union}$, $\texttt{intersection}$ and
    $\texttt{difference}$, every operand is an inline operand or a flatten
    operand. Under $\texttt{set}$, every operand is a configuration operand.

    A definition is **valid** when its operands are valid and its requirement
    holds. A document is **valid** when it is well formed and all its
    definitions are valid.

## Equivalence and normal form

!!! definition "Definition 22: Equivalence and normal form"

    Two definitions, in the same document or in different documents, are
    **equivalent** when they denote the same configuration set. A definition
    with $\sem{n} = (T, S)$ and $S \neq \varnothing$ has the **normal form**

    $$
    \bigl[\, c_1, \dots, c_{|S|}, \{\texttt{operation}: \texttt{set}\} \,\bigr],
    $$

    where $c_1, \dots, c_{|S|}$ are the configurations of $S$, written as
    configuration operands, in any order.

The normal form of a definition is equivalent to it, and two definitions with
non-empty sets are equivalent exactly when their normal forms contain the same
configurations. A definition whose set is empty has no normal form, because a
$\texttt{set}$ needs at least one configuration to determine its type.

## Remarks

Keyso does not restrict the values of a key. The key $\texttt{os}$ may take any
value in any configuration set, and the language has no notion of the values a
key admits. Restricting values per key would make the meaning of a key depend on
where a configuration set is used, and would weaken the composition of sets.
Such restrictions belong to schemas and validation tools built on top of Keyso.
