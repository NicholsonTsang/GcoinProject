<template>
  <div >
    <h1 style="text-align: center">Company Register</h1>
    <br>
    <Tabs type="card" class="card-container">
      <TabPane label="Registration">
        <Card style="width:100%">
          <Form  label-position="left" :label-width="70" class="form-container">
            <FormItem label="Address">
              <Input  placeholder="company account address" v-model="registerAddress"></Input>
            </FormItem>
          </Form>
        </Card>
        <Button type="success" class="confirm-btn" @click="register()">Confirm</Button>
      </TabPane>

      <TabPane label="Check Address in the list">
        <Card style="width:100%">
          <Form  label-position="left" :label-width="70" class="form-container">
            <FormItem label="Address">
              <Input  placeholder="company account address" v-model="addressForCheck"></Input>
            </FormItem>
            Is Company Address: {{isCompanyAddress}}
          </Form>
        </Card>
        <Button type="success" class="confirm-btn" @click="checkAddress()">Confirm</Button>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import {web3Util} from "@/scripts/web3Util/web3Util";
import { GcoinExchcoinExchange } from '@/scripts/contracts/GcoinExchcoinExchange'


export default {
  data() {
    return {
      registerAddress: null,
      addressForCheck: null,
      isCompanyAddress: null,
    }
  },
  methods: {
    async register() {
      const privKey = '5163306b4585562200c1102805c215b42fb3fc2863c55c9fe0d0a2bbf18d7f93';

      await GcoinExchcoinExchange.start();
      let tx;
      try {
        tx = {
          to: GcoinExchcoinExchange.contractAddr,
          gas: 1000000,
          gasPrice: 10000000000,
          value: 0,
          data: GcoinExchcoinExchange.meta.methods.registerCompany(this.registerAddress, true).encodeABI()
        }
      } catch (e) {
        this.$Message.error("Invalid Address");
      }

      if (web3Util.childChainWeb3 == null) {
        await web3Util.childChainWeb3Initialize()
      }
      web3Util.signTransaction(web3Util.childChainWeb3, tx, privKey, null, (confirm) => this.$Message.success("Company Register Success"), (error) => this.$Message.error("Invalid Address"));
    },
    checkAddress() {
      let promise = web3Util.checkIsCompanyAddress(this.addressForCheck);
      promise.then(resolve => {
        this.isCompanyAddress = resolve;
      }).catch((err) => {
        this.$Message.error("invalid address");
      })
    },
  }
}
</script>

<style>
/*.page-container {*/
/*  display: flex;*/
/*  flex-direction: column;*/
/*  align-items: center;*/
/*}*/

.card-container {
  margin: auto;
  width: 60%;
  display: flex;
  flex-direction: column;
}

.charging-amount-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.charging-amount {
  font-weight: bold;
  font-size: 15px;
  /*margin: 2%;*/
  width: 25%;
}

.confirm-btn {
  /*margin: 2%;*/
  /*position: relative;*/
  /*left: 25%;*/
  float: right;
  width: 25%;
  height: 40px;
  margin-top: 2%;
  margin-right: 2%;
}


</style>