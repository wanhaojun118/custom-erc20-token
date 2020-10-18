let state = {
   currentRoute: null as any,
   currentView: null as any,
   web3: {
     address: null as any,
     coinbase: null as any,
     error: null as any,
     instance: null as any,
     isInjected: false as any,
     networkId: null as any,
     balance: null as any
   },
   user: {
     balance: '0.00',
     coinbase: '',
     email: '',
     firstName: '',
     gravatar: '',
     hasCoinbase: false,
     hasWeb3InjectedBrowser: false,
     isConnectedToApprovedNetwork: false,
     isLoggedIn: false,
     lastName: ''
   },
   isDAppReady: false,
   isValidUserBut: '0',
   originalIsValidUserBut: '0'
 }
 export default state