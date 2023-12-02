
An improved version of [ArekX](https://github.com/ArekX/javascript-interpreter-example) interpreter used to create macros.
### Variables
```typescript
variable = value: string | number;

variable = variable + value;

```
boolean not supported

### Operators
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
**/!\ Loops are limited to 1000 operations for security reason.**
#### `while`
```javascript
while (expression) {
    ...
}
```

### Other
#### Comments
```javascript
// commented
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

