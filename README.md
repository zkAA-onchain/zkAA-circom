# Test Register

```bash
$ ./test_register.sh

# Constraints
template instances: 174
non-linear constraints: 4504
linear constraints: 0
public inputs: 4
private inputs: 4
public outputs: 0
wires: 4508
labels: 22420

# GAS
Min: 209823
Max: 209823
Average: 209823
Standard Deviation: 0 (sqrt(0))

# Time: witness
Min: 0.263 seconds
Max: 0.282 seconds
Average: 0.271 seconds
Standard Deviation: 0.008041558721209862 seconds

# Time: proof
Min: 1.178 seconds
Max: 1.201 seconds
Average: 1.1893333333333334 seconds
Standard Deviation: 0.009392668535736967 seconds
```

# Test Publish

```bash
$ ./test_publish.sh

# Constraints
template instances: 75
non-linear constraints: 297
linear constraints: 1
public inputs: 2
private inputs: 4
public outputs: 1
wires: 304
labels: 1175

# GAS
Min: 203066
Max: 203066
Average: 203066
Standard Deviation: 0 (sqrt(0))

# Time: witness
Min: 0.142 seconds
Max: 0.146 seconds
Average: 0.1443333333333333 seconds
Standard Deviation: 0.0016996731711975965 seconds

# Time: proof
Min: 0.926 seconds
Max: 0.982 seconds
Average: 0.9493333333333333 seconds
Standard Deviation: 0.023795424396766313 seconds
```

---

# Generate Inputs

```bash
$ cd circuit/zkaa_register
(zkaa_register) $ node generate_register_inputs.js --rounds=100 --workers=8
```

```bash
$ cd circuit/zkaa_publish
(zkaa_publish) $ node generate_publish_inputs.js --rounds=100 --workers=8
```
