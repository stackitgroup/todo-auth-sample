import { SocketsView } from '@/contexts/components/sockets/sockets'
import { Route, Switch } from 'wouter'
import { HelloWorldView } from '../contexts/components/hello-world/hello-world'
import { ToasterProvider } from '../contexts/components/providers/toaster-provider'
import { LoginView } from './pages/login/page'

const App = () => {
  return (
    <>
      <ToasterProvider />
      <Switch>
        <Route path="/">
          <HelloWorldView />
        </Route>
        {/* #region Zustand */}
        <Route path="/login">
          <LoginView />
        </Route>
        {/* #endregion Zustand */}
        {/* #region Sockets */}
        <Route path="/sockets">
          <SocketsView />
        </Route>
        {/* #endregion Sockets */}
      </Switch>
    </>
  )
}

export default App
