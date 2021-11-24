// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

/// @title A managment tool to track Discrepancy Report lifecycles
/// @author Nick McNally
/// @notice This contract will basically track the lifecycle of a Sumbitted DR
/// @dev Future implementation should include milti-signature for the content owner and approval autority.
contract DiscrepancyReportManager {

  address public approvalAuthority;
  uint public DR_Count;
  mapping (uint => DiscrepancyReport) discrepancyReports;

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
    string discrepancy;
  }

/******************************/
/*        Modifiers           */
/******************************/
/// @notice Only the owner of the content the DR is written against may access certain functions.
/// @dev There is no modifier like this for the Approval authority as they only have one access restriced function.
/// @param _DR The index of the specified Discrepancy Report
modifier isContentOwner(uint _DR)
{
  require(msg.sender == discrepancyReports[_DR].contentOwner, "Only Content Owner can access this.");
  _;
}
/// @notice DR submitted must be within current DR_Count
/// @param _DR The index of the specified Discrepancy Report
modifier isValidDR(uint _DR)
{
  require(_DR >=0 && _DR <= DR_Count, "Invalid DR reference given.");
  _;
}

/******************************/
/*          Events            */
/******************************/
/// @notice Logs submission of a new Discrepancy Report
/// @param DR_Count The index of the specified Discrepancy Report
event LogSubmission(uint indexed DR_Count);

/// @notice Logs acceptance of Discrepancy Report validity
/// @param DR_Count The index of the specified Discrepancy Report
event LogAcceptance(uint indexed DR_Count);

/// @notice Logs declination of Discrepancy Report validity
/// @param DR_Count The index of the specified Discrepancy Report
event LogDeclination(uint indexed DR_Count);

/// @notice Log that a Discrepancy Report has been resolved by the content owner.
/// @param DR_Count The index of the specified Discrepancy Report
event LogResolved(uint indexed DR_Count);

/// @notice Logs rejection of a Discrepancy Report resolution
/// @param DR_Count The index of the specified Discrepancy Report
event LogRejected(uint indexed DR_Count);

/// @notice Logs acceptance of a Discrepancy Report resolution
/// @param DR_Count The index of the specified Discrepancy Report
event LogFixed(uint indexed DR_Count);

/******************************/
/*    Contract Functions      */
/******************************/
/// @notice Contract constructor
/// @dev The Approval Authority is currently the address that instantiates the contract. Future progress should allow graceful transfer of Approval Authority.
  constructor() {
    approvalAuthority = msg.sender;
    DR_Count = 0;
  }

  /// @notice Submission of a new DR
  /// @dev Sumitter is msg.sender
  /// @param _contentOwner The owner of the content the DR is written against
  /// @param _discrepancy Complaint about the content from the submitter
  function submitDR (address _contentOwner, string memory _discrepancy) public
  {
    discrepancyReports[DR_Count] = DiscrepancyReport({submitter: msg.sender,
                                                      contentOwner: _contentOwner,
                                                      state: State.New,
                                                      discrepancy: _discrepancy });
    assert(discrepancyReports[DR_Count].submitter == msg.sender);                                                    
    emit LogSubmission(DR_Count);
    DR_Count ++;
  } 

  /// @notice Content owner to accept or decline DR
  /// @param _DR The index of the specified Discrepancy Report
  /// @param _state State selection, only accepted or declined are valid
  function determineValidity (uint _DR, State _state) public isValidDR(_DR) isContentOwner(_DR) 
  {
    require(discrepancyReports[_DR].state == State.New, "DR validity as already been determined.");
    require(_state == State.Accepted || _state == State.Declined, "Invalid state selection.");

    discrepancyReports[_DR].state = _state;

    if(_state == State.Accepted)
    {
      assert(discrepancyReports[_DR].state == State.Accepted);
      emit LogAcceptance(_DR);      
    }
    else
    {
      assert(discrepancyReports[_DR].state == State.Declined);
      emit LogDeclination(_DR);
    }

  }

  /// @notice Content owner has resolved DR
  /// @param _DR The index of the specified Discrepancy Report
  function resolveDiscrepancyReport (uint _DR) public isValidDR(_DR) isContentOwner(_DR) 
  {
    require(discrepancyReports[_DR].state == State.Accepted ||
            discrepancyReports[_DR].state == State.Rejected,
            "DR must be of state 'Accepted' or 'Rejected'.");

    discrepancyReports[_DR].state = State.Resolved;
    assert(discrepancyReports[_DR].state == State.Resolved);
    emit LogResolved(DR_Count);
  }

  /// @notice Approval Authority may accept or reject the 'Resolved' DR
  /// @param _DR The index of the specified Discrepancy Report
  /// @param _state State selection, only rejected or fixed are valid
  function evaluateResolution (uint _DR, State _state) public isValidDR(_DR)
  {
    require(msg.sender == approvalAuthority,"Only Approval Authority can evaluate a submitted resolution.");
    require(discrepancyReports[_DR].state == State.Resolved, "DR is not marked 'Resolved'.");
    require(_state == State.Fixed || _state == State.Rejected, "Invalid state selection.");

    discrepancyReports[_DR].state = _state;
    if(_state == State.Fixed)
    {
      assert(discrepancyReports[_DR].state == State.Fixed);
      emit LogFixed(_DR);
    } 
    else 
    {
      assert(discrepancyReports[_DR].state == State.Rejected);
      emit LogRejected(_DR);
    }
  }

  /// @dev This function required for testing
  function fetchDiscrepancyReport(uint _DR) public view 
    returns (address submitter,address contentOwner, State state, string memory discrepancy) 
  { 
    submitter = discrepancyReports[_DR].submitter;
    contentOwner = discrepancyReports[_DR].contentOwner;
    state = discrepancyReports[_DR].state;
    discrepancy = discrepancyReports[_DR].discrepancy;

    return (submitter, contentOwner, state, discrepancy); 
  } 
}
