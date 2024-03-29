import Web3 from "web3";
import {contractAbi} from "@/scripts/web3Util/contractAbi";
import {utilConfig} from "@/scripts/web3Util/config";
import {Message} from 'view-design';

const web3Util = {
    parentChainWeb3: null,
    childChainWeb3: null,

    //todo: write the privateKey and userAddress to local storage instead of hardcode
    userAddress: "0x2f56b78D2d3B5EF6FDf0A6c2415089909496C646",

    homeChainWeb3Initialize: async function () {
        console.log("Initializing home-chain web3...");
        this.parentChainWeb3 = new Web3(new Web3.providers.HttpProvider(utilConfig.networkRPC.parentNetworkRPC));
    },

    childChainWeb3Initialize: async function () {
        console.log("Initializing game-chain web3...");
        this.childChainWeb3 = new Web3(new Web3.providers.HttpProvider(utilConfig.networkRPC.childNetworkRPC));
    },

    //Utilized by the write function to sign the transaction for EVM state update
    signTransactionWithLocalKey: function (web3, tx, resolveCallback, comfirmCallback, errorCallback, confirmation = 0) {
        if (localStorage.getItem('privateKey') == "" || localStorage.getItem('privateKey') == null){
            Message.error("You should first set your key in wallet manager");
            if (errorCallback) {
                errorCallback("Private key not set");
            }
            return;
        }

        this.signTransaction(web3, tx, localStorage.getItem('privateKey'), resolveCallback, comfirmCallback, errorCallback);
    },

    signTransaction: function (web3, tx,privateKey, resolveCallback, comfirmCallback, errorCallback, confirmation = 0) {
        const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);
        signPromise.then((signedTx) => {
            console.log(signedTx);
            const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
            sentTx.then((resolved)=>{
                // console.log(resolved);
                if (resolveCallback) {
                    resolveCallback(resolved);
                }
            })

            var txHash;
            let confirmed = false;
            sentTx.on('transactionHash', hash => {
                txHash = hash;
                // Message.loading(`Transaction Generated: ${hash}`);
                console.log(`Transaction Generated: ${hash}`)
            }).on("receipt", receipt => console.log(receipt)).on("error", error => (error) => {
                // Message.error(`Transaction Fails: ${txHash}`);
                // console.error(`Transaction Fails: ${txHash} ${error}`);
                if (errorCallback) {
                    errorCallback(error);
                }
            }).on("confirmation", (num, obj) => {
                if (!confirmed && num == confirmation) {
                    confirmed = true;
                    // Message.success(`Transaction Confirmed: ${obj.transactionHash}`);
                    console.log(`Transaction Confirmed: ${obj.transactionHash}`);
                    if (comfirmCallback) {
                        comfirmCallback(num, obj);
                    }
                }
            })
        }).catch((err) => {
            console.error(`Fail to Sign Transaction: ${err}`);
        });
    },

    readContract: async function (contractCallPromise, myContract) {
        let resolvedValue = null;
        // const contractCallPromise = myContract.methods.balanceOf(this.userAddress).call();
        await contractCallPromise.then((resolved) => {
            resolvedValue = resolved;
            // console.log(resolved);
        });
        // console.log(resolvedValue);
        return resolvedValue;
    },

    //Eth account creation
    createAcc: async function () {
        if (web3Util.parentChainWeb3 == null) {
            await web3Util.homeChainWeb3Initialize();
        }
        return this.parentChainWeb3.eth.accounts.create();
        // alert("Public Key: \n" + accountInfo.address + "\n" + "Private Key: \n" + accountInfo.privateKey + "\n\n" +
        //     "Please make sure you keep the private key safely, otherwise you are unable to use your account for transaction");
    // .then((resolved) => {
    //         console.log(resolved);
    //     });
    },

    //private key to public key
    privateKeyToPublicKey: async function (privateKey) {
      if (web3Util.parentChainWeb3 == null) {
          await web3Util.homeChainWeb3Initialize();
      }
      return this.parentChainWeb3.eth.accounts.privateKeyToAccount(privateKey);
    },

    checkHomeChainBalance: async function (address) {
        if (web3Util.parentChainWeb3 == null) {
            await web3Util.homeChainWeb3Initialize();
        }
        return this.parentChainWeb3.eth.getBalance(address);
    },

    checkChildChainBalance: async function (address) {
        if (web3Util.childChainWeb3 == null) {
            await web3Util.childChainWeb3Initialize();
        }
        return this.childChainWeb3.eth.getBalance(address);
    },

    /*Read Function*/

    getUserGcoinBalance: async function () {
        if (web3Util.childChainWeb3 == null) {
            await web3Util.childChainWeb3Initialize();
        }

        if (localStorage.getItem('address') == "" || localStorage.getItem('privateKey') == null){
            // console.error("You should first set your key in wallet manager");
        }else{
            const contract = new this.childChainWeb3.eth.Contract(contractAbi.GcoinAbi, utilConfig.childChainContractAddress.Gcoin);
            let contractCallPromise = contract.methods.balanceOf(localStorage.getItem('address')).call();
            return await this.readContract(contractCallPromise, contract);
        }
    },

    getUserUSDTBalance: async function () {

        if (web3Util.parentChainWeb3 == null) {
            await web3Util.homeChainWeb3Initialize();
        }

        if (localStorage.getItem('address') == "" || localStorage.getItem('privateKey') == null){
            // console.error("You should first set your key in wallet manager");
        }else{
            const contract = new this.parentChainWeb3.eth.Contract(contractAbi.USDTAbi, utilConfig.homeChainContractAddress.USDT);
            let contractCallPromise = contract.methods.balanceOf(localStorage.getItem('address')).call();
            return await this.readContract(contractCallPromise, contract);
        }
    },

    getUserParentChainExchangeCoinBalance: async function () {

        if (web3Util.parentChainWeb3 == null) {
            await web3Util.homeChainWeb3Initialize();
        }

        if (localStorage.getItem('address') == "" || localStorage.getItem('privateKey') == null){
            // console.error("You should first set your key in wallet manager");
        }else{
            const contract = new this.parentChainWeb3.eth.Contract(contractAbi.bridgeTokenAbi, utilConfig.homeChainContractAddress.Bridgeable_Token);
            let contractCallPromise = contract.methods.balanceOf(localStorage.getItem('address')).call();
            return await this.readContract(contractCallPromise, contract);
        }


    },

    getUserChildChainExchgCoinBalance: async function () {

        if (web3Util.childChainWeb3 == null) {
            await web3Util.childChainWeb3Initialize();
        }

        if (localStorage.getItem('address') == "" || localStorage.getItem('privateKey') == null){
            // console.error("You should first set your key in wallet manager");
        }else{
            const contract = new this.childChainWeb3.eth.Contract(contractAbi.bridgeTokenAbi, utilConfig.childChainContractAddress.Bridgeable_Token);
            let contractCallPromise = contract.methods.balanceOf(localStorage.getItem('address')).call();
            return await this.readContract(contractCallPromise, contract);
        }


    },

    getSignature: async function(encodedData){

        if (web3Util.parentChainWeb3 == null) {
            await web3Util.homeChainWeb3Initialize();
        }

        if (localStorage.getItem('address') == "" || localStorage.getItem('privateKey') == null){
            Message.error("You Should First Set Your Key In Wallet Manager");
        }else{
            const contract = new this.parentChainWeb3.eth.Contract(contractAbi.AMBBridgeHelperAbi, utilConfig.homeChainContractAddress.AMBBridgeHelper);
            let contractCallPromise = contract.methods.getSignatures(encodedData).call();
            return await this.readContract(contractCallPromise, contract);
        }
    },

    checkIsCompanyAddress: async function (address) {

        if (web3Util.childChainWeb3 == null) {
            await web3Util.childChainWeb3Initialize();
        }

        if (address == "" || address == null){
            this.$Message.error("address should be enter")
        }else{
            const contract = new this.childChainWeb3.eth.Contract(contractAbi.GcoinExchcoinExchangeAbi, utilConfig.childChainContractAddress.Gcoin_Exchcoin_Exchange);
            // let contractCallPromise = contract.methods.balanceOf(localStorage.getItem('address')).call();
            let contractCallPromise = contract.methods.companyList(address).call();
            return await this.readContract(contractCallPromise, contract);
        }


    },


}

export {web3Util};