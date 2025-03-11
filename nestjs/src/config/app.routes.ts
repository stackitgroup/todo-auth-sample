export const routes = {
  v1: {
    version: '1',
    auth: { root: 'auth' },
    realTime: { root: 'real-time' },
    helloWorld: { root: 'hello-world' },
    todo: { 
      root: 'todo',
      findAll: '',
      byId: ':id',
      byUserId: 'user/:userId',
      create: 'create',
    },
    user: { 
      root: 'user',
      login: 'login',
      register: 'signup',
      createTokens: 'create-tokens',
      auth: 'auth',
      logout: 'logout/:id'
    },
  },
  v2: {
    version: '2',
  },
}
