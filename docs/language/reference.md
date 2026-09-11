# Reference

## Reserved keywords

| Keyword | Role |
| --- | --- |
| `_literal` | Treat the contained object as a value |
| `_nested` | Evaluate the contained Keyso document independently and use its results as values |
| `_interval` | Enumerate an inclusive finite integer range |
| `_set` | Explicitly enumerate a finite configuration space |
| `_product` | Product of spaces with disjoint types |
| `_union` | Union of spaces with equal types |
| `_intersection` | Intersection of spaces with equal types |
| `_difference` | Difference of two spaces with equal types |
| `_minuend` | Left operand of `_difference` |
| `_subtrahend` | Right operand of `_difference` |

## Construct summary

### Key-value

```keyso
{"key": "value"}
```

### Key-multivalue

```keyso
{"key": ["value1", "value2"]}
```

### Interval

```keyso
{
  "key": {
    "_interval": {
      "start": 16,
      "stop": 32,
      "step": 8
    }
  }
}
```

`start` and `stop` are required integers. `step` is an optional positive integer and defaults to `1`. `stop` is inclusive.

### Explicit set

```keyso
{
  "_set": [
    {"key1": "value1", "key2": "value2"},
    {"key1": "value3", "key2": "value4"}
  ]
}
```

### Product

```keyso
{
  "_product": [
    {"key1": ["a", "b"]},
    {"key2": ["c", "d"]}
  ]
}
```

### Union

```keyso
{
  "_union": [
    {"key": ["a", "b"]},
    {"key": ["b", "c"]}
  ]
}
```

### Intersection

```keyso
{
  "_intersection": [
    {"key": ["a", "b"]},
    {"key": ["b", "c"]}
  ]
}
```

### Difference

```keyso
{
  "_difference": {
    "_minuend": {"key": ["a", "b", "c"]},
    "_subtrahend": {"key": ["b"]}
  }
}
```

## Type requirements

| Operation | Type requirement |
| --- | --- |
| `_product` | operands must have disjoint types |
| `_union` | operands must have equal types |
| `_intersection` | operands must have equal types |
| `_difference` | minuend and subtrahend must have equal types |
| `_set` | all listed configurations must have equal types |

## Dictionary value rules

| Form | Meaning |
| --- | --- |
| `{"key": {"_literal": object}}` | `object` is data |
| `{"key": {"_nested": keyso_document}}` | `keyso_document` is evaluated independently |
| `{"key": {"_interval": {"start": a, "stop": b, "step": s}}}` | inclusive integer values from `a` through `b` using positive step `s` |
| `{"key": { ... }}` | invalid unless wrapped in `_literal`, `_nested`, or `_interval` |
