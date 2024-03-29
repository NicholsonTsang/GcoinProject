import {contractAbi} from "@/scripts/web3Util/contractAbi";
import {utilConfig} from "@/scripts/web3Util/config";
import {web3Util} from "@/scripts/web3Util/web3Util";
import {Message} from 'view-design';

const Gcoin = {
	web3: null,
	meta: null,
	contractAddr: utilConfig.childChainContractAddress.Gcoin, 

	start: async function() {	
		if (this.web3 != null && this.meta != null) {
			return;
		}
				
		if (web3Util.childChainWeb3 == null) {
          	await web3Util.childChainWeb3Initialize();
      	}
		this.web3 = web3Util.childChainWeb3;

		try {
			// get contract instance
			this.meta = new this.web3.eth.Contract(
				contractAbi.GcoinAbi, 
				this.contractAddr
			);
			
			console.log("Connected to contract 'Gcoin' successfully.");
		} catch (error) {
			console.log(error);
			console.error("Could not connect to contract 'Gcoin'.");
		}
	},

	transfer: async function(to, value, confirmCallback, errorCallback) {
		await this.start();

		const tx = {
			to: this.contractAddr,
			gas: 100000,
			gasPrice: 100000000000,
			value: 0,
			data: this.meta.methods.transfer(to, value).encodeABI()
		};

		web3Util.signTransactionWithLocalKey(this.web3, tx, null, confirmCallback, errorCallback);
	},

	approve: async function(spender, value, confirmCallback, errorCallback) {
		await this.start();

		const tx = {
			to: this.contractAddr,
			gas: 100000,
			gasPrice: 10000000000,
			value: 0,
			data: this.meta.methods.approve(spender, value).encodeABI()
		};

		web3Util.signTransactionWithLocalKey(this.web3, tx, null, confirmCallback, errorCallback);
	},

	refreshAllowance: async function(spender, callback) {
		await this.start();

		let owner = localStorage.getItem('address');
		if (owner == null || owner == "") {
			Message.error("You should first set your account in wallet manager");
			return;
		}

		const { allowance } = this.meta.methods;
		await allowance(owner, spender).call(callback);
	},

	refreshBalance: async function(callback) {
		await this.start();

		let owner = localStorage.getItem('address');
		if (owner == null || owner == "") {
			Message.error("You should first set your account in wallet manager");
			return;
		}

		const { balanceOf } = this.meta.methods;
		await balanceOf(owner).call(callback);
	},
}

export { Gcoin }




