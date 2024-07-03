# Test Env

MacBook Pro 13-inch, M1, 2020
- Chip: Apple M1
- Core: physical 8 / logical 8
- Memory: 16GB
- macOS: Sonoma 14.5

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
Min: 0.096 seconds
Max: 0.10500000000000001 seconds
Average: 0.09882000000000005 seconds
Standard Deviation: 0.0023722563099294303 seconds

# Time: proof
Min: 0.717 seconds
Max: 0.804 seconds
Average: 0.7617100000000003 seconds
Standard Deviation: 0.01642637817657929 second
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
Min: 0.045 seconds
Max: 0.053 seconds
Average: 0.047320000000000036 seconds
Standard Deviation: 0.0012796874618437124 seconds

# Time: proof
Min: 0.437 seconds
Max: 0.512 seconds
Average: 0.4733299999999999 seconds
Standard Deviation: 0.014783135661962916 seconds
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
