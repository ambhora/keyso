# Language Overview

Keyso is a small dictionary language for describing configuration spaces by combining simple constructs with set operations.

The language is deliberately based on a data model rather than a text format. Examples in this documentation use dictionary notation, but the semantics are independent of whether a document is written, stored, or transmitted using a particular serialization.

## Constructs

Keyso has two kinds of constructs:

1. **Value constructs**, used as values of ordinary keys.
2. **Space constructs**, used to construct configuration spaces.

Value constructs:

| Construct | Meaning |
| --- | --- |
| ordinary scalar | one possible value |
| list | multiple possible values for one key |
| `_literal` | treat the contained object as data |
| `_nested` | evaluate an independent Keyso document and use its results as values |

Space constructs:

| Construct | Meaning |
| --- | --- |
| key-value mapping | one configuration with one key |
| key-multivalue mapping | one key with several possible values |
| `_set` | explicit finite set of configurations |
| `_product` | product of spaces with disjoint types |
| `_union` | union of spaces with the same type |
| `_intersection` | intersection of spaces with the same type |
| `_difference` | difference of two spaces with the same type |

## Explicit product rule

A dictionary with several ordinary keys is not a shorthand for product.

This is invalid:

```keyso
{
  "compiler": ["gcc", "clang"],
  "optimization": ["O0", "O2"]
}
```

Use `_product` instead:

```keyso
{
  "_product": [
    {"compiler": ["gcc", "clang"]},
    {"optimization": ["O0", "O2"]}
  ]
}
```
