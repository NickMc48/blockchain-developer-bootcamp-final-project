// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract DiscrepencyReportManager {

  address public approvalAuthority;
  uint DR_Count;
  mapping (uint => DiscrepancyReport) discrepencyReports;

  enum State
  {
    New,
    Declined,
    Accepted,
    Resolved,
    Rejected,
    Fixed
  }

  struct DiscrepancyReport
  {
    address submitter;
    address contentOwner;
    State state;
    string discrepency;
  }

/******************************/
/*        Modifiers           */
/******************************/
modifier isContentOwner(uint _DR)
{
  require(msg.sender == discrepencyReports[_DR].contentOwner, "Only Content Owner can access this.");
  _;
}

/******************************/
/*          Events            */
/******************************/
event LogSubmission(uint indexed DR_Count);
event LogAcceptance(uint indexed DR_Count);
event LogDeclination(uint indexed DR_Count);
event LogResolved(uint indexed DR_Count);
event LogRejected(uint indexed DR_Count);
event LogFixed(uint indexed DR_Count);

/******************************/
/*    Contract Functions       */
/******************************/
  constructor() public {
    approvalAuthority = msg.sender;
    DR_Count = 0;
  }

  //Allow submission of a new DR
  function submitDR (address _contentOwner, string memory _discrepency) public
  {
    discrepencyReports[DR_Count] = DiscrepancyReport({submitter: msg.sender,
                                                      contentOwner: _contentOwner,
                                                      state: State.New,
                                                      discrepency: _discrepency });
    DR_Count ++;
    emit LogSubmission(DR_Count);
  }

  // Content owner to accept or decline DR
  function determineValidity (uint _DR, State _state) public isContentOwner(_DR)
  {
    require(discrepencyReports[_DR].state == State.New, "DR validity as already been determined.");
    require(_state == State.Accepted || _state == State.Declined, "Invalid state selection.");

    discrepencyReports[_DR].state = _state;

    if(_state == State.Accepted) emit LogAcceptance(_DR);
    else emit LogDeclination(_DR);
  }

  //Content owner has resolved DR
  function resolveDiscrepencyReport (uint _DR) public isContentOwner(_DR)
  {
    require(discrepencyReports[_DR].state == State.Accepted ||
            discrepencyReports[_DR].state == State.Rejected,
            "DR must be of state 'Accepted' or 'Rejected'.");

    discrepencyReports[_DR].state = State.Resolved;
    emit LogResolved(DR_Count);
  }

  //Approval Authority may accept or decline the 'Resolved' DR
  function evaluateResolution (uint _DR, State _state) public
  {
    require(msg.sender == approvalAuthority,"Only Approval Authority can evaluate a submitted resolution.");
    require(discrepencyReports[_DR].state == State.Resolved, "DR is not marked 'Resolved'.");
    require(_state == State.Fixed || _state == State.Rejected, "Invalid state selection.");

    discrepencyReports[_DR].state = _state;
    if(_state == State.Fixed) emit LogFixed(_DR);
    else emit LogRejected(_DR);
  }
}
