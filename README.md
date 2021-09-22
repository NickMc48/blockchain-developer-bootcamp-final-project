# blockchain-developer-bootcamp-final-project
My final project proposal is a Deficiency Reporting (DR) System run by smart contracts on a blockchain.

This will be a chain with priviliged access as items with a DR against them are likely at least Critical Unclassified Information.

A typical work flow should proceed as follows:
1) Any USER may open a DR against an ITEM in the form of a smart contract.
2) The OWNER of the ITEM will then be able to accept the DR as valid or decline as invalid
   1) Accepted: The OWNER will fix the ITEM and submit the correction to a smart contract that will then notify an Approval Authority (AA)
      1) The AA will then accept or decline the fixed ITEM via smart contract. Should the ITEM be accepted, both OWNER and USER will be notified of a corrected ITEM available. If the ITEM fix is declined, return to step (2).
   2) Declined: USER will be notified the DR they have submitted is invalid and the DR will be closed.
