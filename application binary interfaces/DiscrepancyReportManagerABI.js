const abi = [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "DR_Count",
          "type": "uint256"
        }
      ],
      "name": "LogAcceptance",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "DR_Count",
          "type": "uint256"
        }
      ],
      "name": "LogDeclination",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "DR_Count",
          "type": "uint256"
        }
      ],
      "name": "LogFixed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "DR_Count",
          "type": "uint256"
        }
      ],
      "name": "LogRejected",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "DR_Count",
          "type": "uint256"
        }
      ],
      "name": "LogResolved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "DR_Count",
          "type": "uint256"
        }
      ],
      "name": "LogSubmission",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "DR_Count",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "approvalAuthority",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_contentOwner",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_discrepancy",
          "type": "string"
        }
      ],
      "name": "submitDR",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_DR",
          "type": "uint256"
        },
        {
          "internalType": "enum DiscrepancyReportManager.State",
          "name": "_state",
          "type": "uint8"
        }
      ],
      "name": "determineValidity",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_DR",
          "type": "uint256"
        }
      ],
      "name": "resolveDiscrepancyReport",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_DR",
          "type": "uint256"
        },
        {
          "internalType": "enum DiscrepancyReportManager.State",
          "name": "_state",
          "type": "uint8"
        }
      ],
      "name": "evaluateResolution",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_DR",
          "type": "uint256"
        }
      ],
      "name": "fetchDiscrepancyReport",
      "outputs": [
        {
          "internalType": "address",
          "name": "submitter",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "contentOwner",
          "type": "address"
        },
        {
          "internalType": "enum DiscrepancyReportManager.State",
          "name": "state",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "discrepancy",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]
  
module.exports = abi;