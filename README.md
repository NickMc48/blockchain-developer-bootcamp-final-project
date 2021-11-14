# blockchain-developer-bootcamp-final-project
My final project proposal is a Discrepancy Reporting (DR) System run by smart contracts on a blockchain.

This will be a chain with priviliged access as items with a DR against them are likely at least Critical Unclassified Information.

A typical work flow should proceed as follows:
1) Any USER may open a DR against an item controlled by a CONTENT OWNER in the form of a smart contract.
2) The CONTENT OWNER of the item will then mark the DR as 'Accepted' if the DR is valid or 'Declined' if invalid.
   1) Accepted: The OWNER will mark the DR as 'Resolved' and will then notify an Approval Authority (AA)
      1) The AA will then accept or decline the ITEM by marking the DR as 'Fixed' or 'Rejected' respectively via smart contract function. Should the ITEM be 'Fixed', both OWNER and USER will be notified of a corrected ITEM available. If the ITEM fix is 'Rejected', the CONTENT OWNER will then be able to make the appropriate changes and change the state to 'Resolved' again for re-submission to the AA.
   2) Declined: USER will be notified the DR they have submitted is invalid and the DR will be closed.