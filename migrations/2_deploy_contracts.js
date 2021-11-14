var DiscrepancyReportManager = artifacts.require("./DiscrepancyReportManager.sol");

module.exports = function(deployer) {
  deployer.deploy(DiscrepancyReportManager);
};
