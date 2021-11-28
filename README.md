# Discrepancy Report Manager
My final project proposal is a Discrepancy Report (DR) Managementn System run by smart a contract on a blockchain.

In a truly fielded version, this would be on a chain with priviliged access as items with a DR against them are likely at least Critical Unclassified Information.

A typical work flow should proceed as follows:
1) Any SUBMITTER may open a DR against an item controlled by a CONTENT OWNER in the form of a smart contract submission.
2) The CONTENT OWNER of the item will then mark the DR as 'Accepted' if the DR is valid or 'Declined' if invalid.
   1) Accepted: The OWNER will mark the DR as 'Resolved' and will then notify the SUBMITTER.
      1) The SUBMITTER will then accept or decline the resolution by marking the DR as 'Fixed' or 'Rejected' respectively via smart contract function. If the resolution is 'Rejected', the CONTENT OWNER will then be able to make the appropriate changes and change the state to 'Resolved' again for re-submission to the SUBMITTER.
   2) Declined: SUBMITTER can then be notified the DR they have submitted is invalid per the   CONTENT OWNER.

## Folder Structure

## Public Ethereum Account
```
0x881B7cF77e36BF15164FBD35be71B174FD2621bE
```

## Front-end location
```
http://NickMc48.github.io
```

## Installing Dependencies

## 