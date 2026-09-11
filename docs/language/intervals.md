# Intervals

`_interval` is a value construct for compactly describing a finite sequence of integer values.

It is equivalent to explicitly listing those values in a normal Keyso multivalue.

## Syntax

```keyso
{
  "cores": {
    "_interval": {
      "start": 16,
      "stop": 32,
      "step": 8
    }
  }
}
```

This is equivalent to:

```keyso
{
  "cores": [16, 24, 32]
}
```

## Fields

| Field | Required | Meaning |
| --- | --- | --- |
| `start` | yes | First integer value |
| `stop` | yes | Inclusive upper bound |
| `step` | no | Positive integer increment; defaults to `1` |

For example:

```keyso
{
  "cores": {
    "_interval": {
      "start": 16,
      "stop": 20
    }
  }
}
```

is equivalent to:

```keyso
{
  "cores": [16, 17, 18, 19, 20]
}
```

## Semantics

`_interval` does not introduce an infinite or symbolic configuration space. It is compact syntax for a finite enumeration.

Given:

```keyso
{
  "key": {
    "_interval": {
      "start": s,
      "stop": e,
      "step": p
    }
  }
}
```

the values are:

```text
s, s + p, s + 2p, ...
```

up to and including `e` when it is reached exactly.

The following constraints apply:

- `start` and `stop` must be integers.
- `step` must be a positive integer.
- `step` defaults to `1`.
- `start` must be less than or equal to `stop`.

A single-value interval is valid:

```keyso
{
  "threads": {
    "_interval": {
      "start": 8,
      "stop": 8
    }
  }
}
```

and is equivalent to:

```keyso
{"threads": 8}
```

## Use in configuration spaces

Intervals can be combined with the normal Keyso constructs. For example:

```keyso
{
  "_product": [
    {
      "cores": {
        "_interval": {
          "start": 16,
          "stop": 32,
          "step": 8
        }
      }
    },
    {
      "compiler": ["gcc", "clang"]
    }
  ]
}
```

describes the Cartesian product of:

```text
cores = {16, 24, 32}
compiler = {gcc, clang}
```

and therefore still denotes a finite configuration space.
