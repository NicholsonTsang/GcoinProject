<template>
	<div class="transaction">
		<h1 style="text-align: center">Transaction</h1>
		<Tabs type="card" style="width: 60%; margin: 0 auto;">


		<div v-if="error">
			<Alert type="error" show-icon>
				An error prompt
				<span slot="desc">
					{{errorInfo}}
				</span>
			</Alert>
		</div>
		<div v-else style="margin: 0 auto;">
			<Card class="transaction" v-if="transaction" style="margin-bottom: 2%">
				<List border>
			<ListItem>
				<div class="detail-item">hash:&emsp;</div>
				{{transaction.hash}}
			</ListItem> 
			<ListItem>
				<div class="detail-item">blockNumber: </div>
				<a @click="getInfo(transaction.blockNumber)">{{transaction.blockNumber}}</a>
			</ListItem>
			<ListItem>
				<div class="detail-item">from: </div>
				{{transaction.from}}
			</ListItem>
			<ListItem>
				<div class="detail-item">to: </div>
				{{transaction.to}}
			</ListItem>
			<ListItem>
				<div class="detail-item">value: </div>
				{{transaction.value}}
			</ListItem>
			<ListItem>
				<div class="detail-item">gasPrice: </div>
				{{transaction.gasPrice}}
			</ListItem>
			<ListItem>
				<div class="detail-item">gasUsed: </div>
				{{transaction.gasUsed}}
			</ListItem>
<!--      <ListItem>-->
<!--        <div class="detail-item" style="WORD-WRAP: break-word;TABLE-LAYOUT: fixed;word-break:break-all">input: </div>-->
<!--        {{transaction.input}}-->
<!--      </ListItem>-->
			
				<Collapse simple style="width: 100%;">
				<Panel style="padding-left: 8px;"><Strong>input: </Strong>
				<div slot="content"  style="WORD-WRAP: break-word;TABLE-LAYOUT: fixed;word-break:break-all">
				{{transaction.input}}
				</div>
				</Panel>
				</Collapse>
			
			
			<ListItem>
				<Button @click="getDetailed(transaction)">show more</Button>
			</ListItem>
			<div v-if="detailed">
					<ListItem>
						<div class="detail-item">transactionFee: </div>
						{{transaction.transactionFee}}
					</ListItem>
					<ListItem>
						<div class="detail-item">timestamp: </div>
						{{transaction.timestamp}}
					</ListItem>
					<ListItem>
						<div class="detail-item">status: </div>
						{{transaction.status}}
					</ListItem>
					<ListItem>
						<div class="detail-item">contractAddress: </div>
						{{transaction.contractAddress}}
					</ListItem>
			</div>


		</List>
		</Card>
		</div>
	
</Tabs>
	</div>
</template>

<script>
	import ExplorerCtrl from '@/components/Explorer.vue';
	export default {
		name: 'TransactionInfoCtrl',
		data() {
			return{
				transaction: null,
				error: false,
				errorInfo: "",
				detailed: false,
			}
		},
		methods: {
			

			/* UI Callback  */

			displayTransactionDetails(transaction){
				this.transaction=transaction;
			},


			failureCallback(error) {
				
				this.error=true;
				this.errorInfo=error;
				console.log(error);
			},

			getInfo(height) {
				this.$router.push({
					name: 'Explorer.BlockDetails',
					params: {
						id: height,
					}
				});
			},

			getDetailed(transaction){
				if(transaction){
					this.transactionInfoController.getDetailedTransaction(transaction, this.displayTransactionDetails, this.failureCallback);
					this.detailed=true;
				}
			},

		},

		created(){
			this.transactionInfoController = ExplorerCtrl.transactionInfoController;
			
		},
		
		mounted: function(){
			this.transactionInfoController.getTransaction(this.$route.params.id, this.displayTransactionDetails, this.failureCallback);
		}

	}
</script>