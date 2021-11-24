let BN = web3.utils.BN;
const DiscrepancyReportManager = artifacts.require("DiscrepancyReportManager");
let { catchRevert, catchValueOutOfBounds } = require("./exceptionsHelpers.js");
const { items: ItemStruct, isDefined, isPayable, isType } = require("./ast-helper");


contract("DiscrepancyReportManager", function (accounts) 
{
  const [stakeholder, alice, bob, jerry, larry] = accounts;
  const emptyAddress = "0x0000000000000000000000000000000000000000";

  let instance;
  beforeEach(async () => { instance = await DiscrepancyReportManager.new();}); 

  describe("Variables and set-up:", () =>
  {
    it("Should have an owner.", async () => {
      assert.equal(typeof instance.approvalAuthority, 'function', "The contract has no Approval Authority!"); 
    });
    it("Should have an DR Count.", async () => {
      assert.equal(typeof instance.DR_Count, 'function', "The contract has no DR Count!"); 
    });

    describe("State enum:", () =>
    {
      let enumState;
      before(() => {
        enumState = DiscrepancyReportManager.enums.State;
        assert(enumState, "The contract should define an Enum called State");
      });
      it("Should define `New`.", () => {
        assert( enumState.hasOwnProperty('New'), "The enum does not have a `New` value.");
      });
      it("Should define `Declined`.", () => {
        assert( enumState.hasOwnProperty('Declined'), "The enum does not have a `Declined` value.");
      });
      it("Should define `Accepted`.", () => {
        assert( enumState.hasOwnProperty('Accepted'), "The enum does not have a `Accepted` value.");
      });
      it("Should define `Resolved`.", () => {
        assert( enumState.hasOwnProperty('Resolved'), "The enum does not have a `Resolved` value.");
      });
      it("Should define `Resolved`.", () => {
        assert( enumState.hasOwnProperty('Resolved'), "The enum does not have a `Resolved` value.");
      });
      it("Should define `Rejected`.", () => {
        assert( enumState.hasOwnProperty('Rejected'), "The enum does not have a `Rejected` value.");
      });
    });

    describe("DiscrepancyReport struct:", () =>
    {
      let structDR;
      before(() => {
        structDR  = ItemStruct(DiscrepancyReportManager);
        assert(structDR !== null, "The contract should define a 'DiscrepancyReport' struct!");
      });
      it("Should have a `submitter`.", () => {
        assert(isDefined(structDR)("submitter"), "Struct DiscrepancyReport should have a `submitter` member!");
        assert(isType(structDR)("submitter")("address"), "`submitter` should be of type `address`!");
      });
      it("Should have a `contentOwner`.", () => {
        assert(isDefined(structDR)("contentOwner"), "Struct DiscrepancyReport should have a `contentOwner` member!");
        assert(isType(structDR)("contentOwner")("address"), "`contentOwner` should be of type `address`!");
      });
      it("Should have a `state`.", () => {
        assert(isDefined(structDR)("state"), "Struct DiscrepancyReport should have a `state` member!");
        assert(isType(structDR)("state")("State"), "`state` should be of type `State`!");
      });
      it("Should have a `discrepancy`.", () => {
        assert(isDefined(structDR)("discrepancy"), "Struct DiscrepancyReport should have a `discrepancy` member!");
        assert(isType(structDR)("discrepancy")("string"), "`discrepancy` should be of type `string`!");
      });
    });
  });

  describe("Nitty-Gritty use cases:", () =>
  {
    describe("DR Submission Testing", () =>
    {
      it("Should add a new DR with given content owner and discprepenacy.", async () => {
        const complaint = "Bob's stuff is shite."
        await instance.submitDR(bob, complaint, {from: alice});
        const result = await instance.fetchDiscrepancyReport(0);

        assert.equal(result[0], alice, "Submitter was not recorded correctly!");
        assert.equal(result[1], bob, "Content Owner was not recorded correctly!");
        assert.equal(result[2], DiscrepancyReportManager.State.New, "State of submitted DR is not 'New'!");
        assert.equal(result[3], complaint, "Discrepancy was not recorded correctly!");
      });
      it("Should emit a LogSubmission event when DR is submitted.", async () => {
        const DRM = await instance.submitDR(bob, "An unkindness.", {from: alice});

        assert.equal(DRM.logs[0].event, "LogSubmission", "'LogSubmission' event not recoreded!");
      });
    });
    describe("DR Validity Determination Testing", () =>
    {
      it("Should allow the content owner to accept or decline the DR.", async () =>
      {
        await instance.submitDR(bob, "error 1", {from: alice});
        await instance.submitDR(bob, "error 2", {from: alice});
        await instance.determineValidity(0, DiscrepancyReportManager.State.Accepted, {from: bob});
        await instance.determineValidity(1, DiscrepancyReportManager.State.Declined, {from: bob});
        const result1 = await instance.fetchDiscrepancyReport(0);
        const result2 = await instance.fetchDiscrepancyReport(1);

        assert.equal(result1[2], DiscrepancyReportManager.State.Accepted, "State of DR is not 'Accepted'!");
        assert.equal(result2[2], DiscrepancyReportManager.State.Declined, "State of DR is not 'Declined'!");
      });
      it("Should error when a not content owner attempts to determine validity.", async () =>
      {
        await instance.submitDR(bob, "error", {from: alice});

        await catchRevert(instance.determineValidity(0, DiscrepancyReportManager.State.Declined, {from: alice}));
        await catchRevert(instance.determineValidity(0, DiscrepancyReportManager.State.Declined, {from: stakeholder}));
        await catchRevert(instance.determineValidity(0, DiscrepancyReportManager.State.Declined, {from: jerry}));
      });
      it("Should error when an invalid DR is given to the function.", async () =>
      {
        await instance.submitDR(bob, "error", {from: alice});

        await catchValueOutOfBounds(instance.determineValidity(-1, DiscrepancyReportManager.State.Declined, {from: bob}),"out-of-bounds");
        await catchRevert(instance.determineValidity(10, DiscrepancyReportManager.State.Declined, {from: bob}),"out-of-bounds");
      });
      it("Should error when DR state is not 'New'.", async () =>
      {
        await instance.submitDR(bob, "error", {from: alice});
        await instance.determineValidity(0, DiscrepancyReportManager.State.Accepted, {from: bob});

        await catchRevert(instance.determineValidity(0, DiscrepancyReportManager.State.Accepted, {from: bob}));
      });
      it("Should error when State chosen is not 'Accepted' or 'Declined'.", async () =>
      {
        await instance.submitDR(bob, "error", {from: alice});
        
        await catchRevert(instance.determineValidity(0, DiscrepancyReportManager.State.New, {from: bob}));
        await catchRevert(instance.determineValidity(0, DiscrepancyReportManager.State.Resolved, {from: bob}));
        await catchRevert(instance.determineValidity(0, DiscrepancyReportManager.State.Rejected, {from: bob}));
        await catchRevert(instance.determineValidity(0, DiscrepancyReportManager.State.Fixed, {from: bob}));
      });
      it("Should emit a LogAcceptance event when DR is accepted.", async () =>
      {
        await instance.submitDR(bob, "An unkindness.", {from: alice});
        const DRM = await instance.determineValidity(0, DiscrepancyReportManager.State.Accepted, {from: bob});

        assert.equal(DRM.logs[0].event, "LogAcceptance", "'LogAcceptance' event not recoreded!");
      });
      it("Should emit a LogDeclination event when DR is declined.", async () =>
      {
        await instance.submitDR(bob, "An unkindness.", {from: alice});
        const DRM = await instance.determineValidity(0, DiscrepancyReportManager.State.Declined, {from: bob});

        assert.equal(DRM.logs[0].event, "LogDeclination", "'LogDeclination' event not recoreded!");
      });
    });
    describe("DR Resolution Testing", () =>
    {
      it("Should set state to 'Resolved'.", async () =>
      {
        await instance.submitDR(bob, "error", {from: alice});
        await instance.determineValidity(0, DiscrepancyReportManager.State.Accepted, {from: bob});
        await instance.resolveDiscrepancyReport(0, {from: bob});
        const result1 = await instance.fetchDiscrepancyReport(0);

        assert.equal(result1[2], DiscrepancyReportManager.State.Resolved, "State of DR is not set 'Resolved' from 'Accepted'!");

        await instance.evaluateResolution(0, DiscrepancyReportManager.State.Rejected, {from: stakeholder});
        await instance.resolveDiscrepancyReport(0, {from: bob});
        const result2 = await instance.fetchDiscrepancyReport(0);

        assert.equal(result2[2], DiscrepancyReportManager.State.Resolved, "State of DR is not set 'Resolved' from 'Rejected'!");
      });
      it("Should error when a not content owner attempts to resolve DR.", async () =>
      {
        await instance.submitDR(bob, "error", {from: alice});
        await instance.determineValidity(0, DiscrepancyReportManager.State.Accepted, {from: bob});

        await catchRevert(instance.resolveDiscrepancyReport(0, {from: alice}));
        await catchRevert(instance.resolveDiscrepancyReport(0, {from: stakeholder}));
        await catchRevert(instance.resolveDiscrepancyReport(0, {from: jerry}));
      });
      it("Should error when an invalid DR is given to the function.", async () =>
      {
        await instance.submitDR(bob, "error", {from: alice});
        await instance.determineValidity(0, DiscrepancyReportManager.State.Accepted, {from: bob});

        await catchValueOutOfBounds(instance.resolveDiscrepancyReport(-1, {from: bob}));
        await catchRevert(instance.resolveDiscrepancyReport(10, {from: bob}));
      });
      it("Should error when state is not 'Accepted' or 'Rejected'.", async () =>
      {
        //Test for State = New
        await instance.submitDR(bob, "error", {from: alice});        
        await catchRevert(instance.resolveDiscrepancyReport(0, {from: bob}));

        //Test for State = Declined
        await instance.determineValidity(0, DiscrepancyReportManager.State.Declined, {from: bob});
        await catchRevert(instance.resolveDiscrepancyReport(0, {from: bob}));

        //Test for State = Resolved
        await instance.submitDR(bob, "error", {from: alice});        
        await instance.determineValidity(1, DiscrepancyReportManager.State.Accepted, {from: bob});
        await instance.resolveDiscrepancyReport(1, {from: bob});
        await catchRevert(instance.resolveDiscrepancyReport(1, {from: bob}));

        //Test for State = Fixed
        await instance.evaluateResolution(1, DiscrepancyReportManager.State.Fixed, {from: stakeholder});
        await catchRevert(instance.resolveDiscrepancyReport(1, {from: bob}));        
      });
      it("Should emit a LogResolved event when DR is resolved.", async () =>
      {
        await instance.submitDR(bob, "An unkindness.", {from: alice});
        await instance.determineValidity(0, DiscrepancyReportManager.State.Accepted, {from: bob});
        const DRM = await instance.resolveDiscrepancyReport(0, {from: bob});

        assert.equal(DRM.logs[0].event, "LogResolved", "'LogResolved' event not recoreded!");
      });
    });
    describe("DR Resolution Evaluation Testing", () =>
    {
      it("Should set state to 'Fixed.", async () =>
      {
        await instance.submitDR(bob, "You suck", {from: alice});
        await instance.determineValidity(0, DiscrepancyReportManager.State.Accepted, {from: bob});
        await instance.resolveDiscrepancyReport(0, {from: bob});
        await instance.evaluateResolution(0, DiscrepancyReportManager.State.Fixed, {from: stakeholder});
        const result = await instance.fetchDiscrepancyReport(0);

        assert.equal(result[2], DiscrepancyReportManager.State.Fixed, "State of DR is not set 'Fixed'!");

      });
      it("Should set state to 'Rejected'.", async () =>
      {
        await instance.submitDR(bob, "You suck", {from: alice});
        await instance.determineValidity(0, DiscrepancyReportManager.State.Accepted, {from: bob});
        await instance.resolveDiscrepancyReport(0, {from: bob});
        await instance.evaluateResolution(0, DiscrepancyReportManager.State.Rejected, {from: stakeholder});
        const result = await instance.fetchDiscrepancyReport(0);

        assert.equal(result[2], DiscrepancyReportManager.State.Rejected, "State of DR is not set 'Rejected'!");
      });
      it("Should error when not approval authority attempts to modify state.", async () =>
      {
        await instance.submitDR(bob, "error", {from: alice});
        await instance.determineValidity(0, DiscrepancyReportManager.State.Accepted, {from: bob});
        await instance.resolveDiscrepancyReport(0, {from: bob})

        await catchRevert(instance.evaluateResolution(0, DiscrepancyReportManager.State.Fixed,{from: alice}));
        await catchRevert(instance.evaluateResolution(0, DiscrepancyReportManager.State.Fixed,{from: bob}));
        await catchRevert(instance.evaluateResolution(0, DiscrepancyReportManager.State.Fixed,{from: jerry}));
      });
      it("Should error when an invalid DR is given to the function.", async () =>
      {
        await instance.submitDR(bob, "error", {from: alice});
        await instance.determineValidity(0, DiscrepancyReportManager.State.Accepted, {from: bob});
        await instance.resolveDiscrepancyReport(0, {from: bob})

        await catchValueOutOfBounds(instance.evaluateResolution(-1, DiscrepancyReportManager.State.Fixed, {from: bob}));
        await catchRevert(instance.evaluateResolution(10, DiscrepancyReportManager.State.Fixed, {from: bob}));
      });
      it("Should error if state is not 'Resolved' upon function entry.", async () =>
      {
        await instance.submitDR(bob, "This is gonna be a long one", {from: alice});
        await instance.submitDR(bob, "Here is another!", {from: alice});

        //Test state 'New'        
        await catchRevert(instance.evaluateResolution(0, DiscrepancyReportManager.State.Fixed,{from: stakeholder}));

        //Test state 'Declined'
        await instance.determineValidity(0, DiscrepancyReportManager.State.Declined, {from: bob});
        await catchRevert(instance.evaluateResolution(0, DiscrepancyReportManager.State.Fixed,{from: stakeholder}));

        //Test state 'Accepted
        await instance.determineValidity(1, DiscrepancyReportManager.State.Accepted, {from: bob});
        await catchRevert(instance.evaluateResolution(1, DiscrepancyReportManager.State.Fixed,{from: stakeholder}));

        //Test state 'Rejected'
        await instance.resolveDiscrepancyReport(1, {from: bob});
        instance.evaluateResolution(1, DiscrepancyReportManager.State.Rejected, {from: stakeholder});
        await catchRevert(instance.evaluateResolution(1, DiscrepancyReportManager.State.Fixed,{from: stakeholder}));

        //Test state 'Fixed'
        await instance.resolveDiscrepancyReport(1, {from: bob});
        instance.evaluateResolution(1, DiscrepancyReportManager.State.Fixed, {from: stakeholder});
        await catchRevert(instance.evaluateResolution(1, DiscrepancyReportManager.State.Fixed,{from: stakeholder}));
      });
      it("Should error if selected state is not 'Rejected' or 'Fixed'.", async () =>
      {
        await instance.submitDR(bob, "An unkindness.", {from: alice});
        await instance.determineValidity(0, DiscrepancyReportManager.State.Accepted, {from: bob});
        await instance.resolveDiscrepancyReport(0, {from: bob});

        await catchRevert(instance.evaluateResolution(0, DiscrepancyReportManager.State.New,{from: stakeholder}));
        await catchRevert(instance.evaluateResolution(0, DiscrepancyReportManager.State.Accepted,{from: stakeholder}));
        await catchRevert(instance.evaluateResolution(0, DiscrepancyReportManager.State.Declined,{from: stakeholder}));
        await catchRevert(instance.evaluateResolution(0, DiscrepancyReportManager.State.Resolved,{from: stakeholder}));
      });
      it("Should emit a LogFixed event when DR is fixed. ", async () =>
      {
        await instance.submitDR(bob, "An unkindness.", {from: alice});
        await instance.determineValidity(0, DiscrepancyReportManager.State.Accepted, {from: bob});
        await instance.resolveDiscrepancyReport(0, {from: bob});
        const DRM = await instance.evaluateResolution(0, DiscrepancyReportManager.State.Fixed, {from: stakeholder});

        assert.equal(DRM.logs[0].event, "LogFixed", "'LogFixed' event not recoreded!");
      });
      it("Should emit a LogRejected event when DR is rejected.", async () =>
      {
        await instance.submitDR(bob, "An unkindness.", {from: alice});
        await instance.determineValidity(0, DiscrepancyReportManager.State.Accepted, {from: bob});
        await instance.resolveDiscrepancyReport(0, {from: bob});
        const DRM = await instance.evaluateResolution(0, DiscrepancyReportManager.State.Rejected, {from: stakeholder});

        assert.equal(DRM.logs[0].event, "LogRejected", "'LogRejected' event not recoreded!");
      });
     });
  })
});
