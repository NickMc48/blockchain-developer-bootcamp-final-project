# Design Pattern Decisions

## Inheritance and Interfaces
The Discrepancy Report Manager contract inherits OpenZeppelin's AccessControl.sol, allowing the Approval Authority role to be safely shared in future updates.

## Access Control Design Patterns
The modifier isContentOwner is created to ensure that only the content owner of a specified DR may access certain functionality. In future updates, the Content Owner will be a Role from the AccessControl contract so that there may be multiple Content Owners for a specified DR.

## Optimizing Gas
All 'OR' operations check for a value that is more likely to be true first and all 'AND' operations check for a value that is more likeley to be false first. This contract contains no loops, keeping gas cost lower.