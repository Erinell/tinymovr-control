# Interpreteur

### Variables
```typescript
variable = value: string | number;

variable = variable + value;

```
boolean not supported

### Operators
Only theses operators are supported
```javascript
&& || == != < > <= >= + - * / !
```

### Conditions


#### `if` & `if else`
```javascript
if (expression) {
    ...
}
```
```javascript
if (expression) {
    ...
} else {
    ...
}
```

### Loops
##### /!\ les boucles sont limités à 1000 opérations par sécurité.
#### `while`
```javascript
while (expression) {
    ...
}
```

### Other
#### Comment
There is two way to comment a line
```javascript
// commented
```
or
```python
# commented
```

#### `print`
Trigger a function that send to the console (can be set to an other output).
```typescript
print(value: string);
print(value: string + " " + variable);

```
#### `sleep`
Trigger a function that pause the program for `value` milliseconds.
```typescript
sleep(value: number);
```

#### `send`
Trigger a function that send a request to the device.
```typescript
send(endpoint: string, value: string | number | null);
```

