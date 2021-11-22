console.log("app.js has started!");

//Contract info
const DR_ABI = [
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
  ];
const DR_Addr = '0x0Ee0C3ccF1DF2DCafB7021eeeB45d570ba8748A9';

//On Page load
window.addEventListener('load', function () {
    //Check if there is a wallet available
    if(typeof window.ethereum != 'undefined')
    {
        console.log("Wallet detecetd.");
        let mmDetected = this.document.getElementById('mm-detected');
        mmDetected.innerHTML = "Wallet has been detected."
    }
    else
    {
        console.log("Wallet not found!");
        document.getElementById('mm-connect').disabled = true;
        this.alert("MetaMask or another wallet must be installed to run this application!");
        mmDetected.innerHTML = "Wallet not found."
    }

    //Instantiate connection to deployed contract (maybe)

});

//Connect to MetaMask
const mmEnable = document.getElementById('mm-connect');
mmEnable.onclick = async() =>
{
    mmEnable.disabled = true;
    console.log("Requesting Accounts from Wallet.");
    const addr = await ethereum.request({method: 'eth_requestAccounts'});
    let mmDetected = this.document.getElementById('mm-detected');
    let mmAccount = this.document.getElementById('mm-currentAccount');


    if(addr == "")
    {
        console.log("Wallet connection has failed!");
        mmEnable.disabled = false;
    }
    else
    {
        console.log("Wallet connection established!");
        mmDetected.innerHTML = "Wallet is connected!";
        mmAccount.innerHTML = "Selected Account:" + addr;
    }
 
};