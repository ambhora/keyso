# Examples

## Compiler matrix

```keyso
{
  "_product": [
    {"compiler": ["gcc", "clang"]},
    {"optimization": ["O0", "O2", "O3"]}
  ]
}
```

## HPC run matrix

```keyso
{
  "_product": [
    {"system": ["jedi", "jupiter"]},
    {"nodes": [1, 2, 4]},
    {"tasks_per_node": [4, 8]}
  ]
}
```

## Explicit exceptional cases

```keyso
{
  "_set": [
    {"compiler": "gcc", "optimization": "O2"},
    {"compiler": "clang", "optimization": "O3"}
  ]
}
```

## Add one special case to a product

```keyso
{
  "_union": [
    {
      "_product": [
        {"compiler": ["gcc", "clang"]},
        {"optimization": ["O2", "O3"]}
      ]
    },
    {
      "_set": [
        {"compiler": "intel", "optimization": "O2"}
      ]
    }
  ]
}
```

## Remove an unsupported combination

```keyso
{
  "_difference": {
    "_minuend": {
      "_product": [
        {"compiler": ["gcc", "clang"]},
        {"optimization": ["O0", "O2"]}
      ]
    },
    "_subtrahend": {
      "_set": [
        {"compiler": "clang", "optimization": "O0"}
      ]
    }
  }
}
```

## Nested build and run sections

```keyso
{
  "_product": [
    {"system": ["jedi", "jupiter"]},
    {
      "build": {
        "_nested": {
          "_product": [
            {"compiler": ["gcc", "clang"]},
            {"mpi": ["openmpi", "mpich"]}
          ]
        }
      }
    },
    {
      "run": {
        "_nested": {
          "_product": [
            {"nodes": [1, 2]},
            {"tasks_per_node": [4, 8]}
          ]
        }
      }
    }
  ]
}
```
