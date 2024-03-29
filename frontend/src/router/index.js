import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [

    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/signup',
        name: 'Signup',
        component: () => import('../views/Signup.vue'),
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: {requireAuth: true},
        children: [
            // {
            //   path: '/transfer',
            //   name: 'Transfer',
            //   // route level code-splitting
            //   // this generates a separate chunk (about.[hash].js) for this route
            //   // which is lazy-loaded when the route is visited.
            //   component: () => import('../views/Transfer.vue')
            // },

            {
                path: '/deposit',
                name: 'DepositPage',
                component: () => import('../views/Deposit.vue')
            },
            {
                path: '/withdraw',
                name: 'WithdrawPage',
                component: () => import('../views/Withdrawal.vue')
            },
            {
                path: '/explorer',
                //name: 'Explorer',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import('../components/Explorer.vue'),
                children: [
                    {
                        path: '',
                        name: 'Explorer.Home',
                        component: () => import('../views/explorer/Home.vue'),
                        meta: {requireAuth: true},
                    },
                    {
                        path: 'block/:id',
                        name: 'Explorer.BlockDetails',
                        component: () => import('../views/explorer/BlockDetails.vue'),
                        meta: {requireAuth: true},
                    },
                    {
                        path: 'transaction/:id',
                        name: 'Explorer.TxDetails',
                        component: () => import('../views/explorer/TransactionDetails.vue'),
                        meta: {requireAuth: true},
                    },
                ]
            },
            {
                path: '/blockchain/statistic',
                name: 'Statistic',
                component: () => import('../views/Statistic.vue'),
                meta: {requireAuth: true}
            },
            {
                path: '/game',
                name: 'Game',
                component: () => import('../views/Game.vue'),
                meta: {requireAuth: true}
            },
            {
                path: '/shop',
                name: 'Shop',
                component: () => import('../views/Shop.vue'),
                meta: {requireAuth: true}
            },
            {
                path: '/company/register',
                name: 'CompanyRegister',
                component: () => import('../views/CompanyRegister.vue'),
                meta: {requireAuth: true}
            },
            {
                path: '/smartcontract/ethereum',
                name: 'EthereumSmartContract',
                component: () => import('../views/EthereumSmartContract.vue'),
                meta: {requireAuth: true}
            },
            {
                path: '/smartcontract/gamechain',
                name: 'GameChainSmartContract',
                component: () => import('../views/GameChainSmartContract.vue'),
                meta: {requireAuth: true}
            },
            {
                path: '/gamelaunch',
                name: 'GameLaunch',
                component: () => import('../views/GameLaunch.vue'),
                meta: {requireAuth: true}
            },
            {
                path: 'game/gameinfo',
                name: 'GameInfo',
                component: () => import('../views/GameInfo.vue'),
                meta: {requireAuth: true}
            },
            {
                path: '/faucet',
                name: 'Faucet',
                component: () => import('../views/USDTFaucet.vue'),
                meta: {requireAuth: true}
            },
            {
                path: '/wallet/manager',
                name: 'WalletManager',
                component: () => import('../views/WalletManager.vue'),
                meta: {requireAuth: true}
            },
            {
                path: '/gameDemo',
                name: 'GameDemo',
                component: () => import('../views/GameDemo.vue'),
                meta: {requireAuth: true}
            }
        ]
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        if (Boolean(sessionStorage.getItem("uid"))) {
            next();
        } else {
            next({
                path: '/login',
            })
        }
    } else {
        next();
    }
})

export default router
