# Avoiding Common Attacks
Steps taken to avoid common attacks are as follows:

## Use Specific Compiler Pagma 
### SWC-103 Floating Pragma
Reference:
```
https://swcregistry.io/docs/SWC-103
```
Compiler pragma is locked down so that the contract performs as designed and tested.

## Proper Use of require, assert and revert
### SWC-123 Requirement Violation and SWC-110 Assert Violation
Reference:
```
https://swcregistry.io/docs/SWC-123
https://swcregistry.io/docs/SWC-110
```
Require statments are used to check for valid inputs to all functions. Assert statements are used after every state change to ensure the change was carried out properly.

## Use Modifiers Only for Validation
### SWC reference not found.
Modifiers are used only to validate function inputs using require statements.