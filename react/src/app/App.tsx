import { Route, Switch } from 'wouter'
import { ToasterProvider } from '../contexts/components/providers/toaster-provider'
import { LoginView } from './pages/login/page'
import { HomeView } from '@/contexts/components/home/home'
import { Layout } from './pages/layout'
import { CreateView } from '@/contexts/components/create/create'

const App = () => {
  return (
    <>
      <ToasterProvider />
      <Layout>
        <Switch>
          <Route path="/">
            <HomeView />
          </Route>
          <Route path="/access">
            <LoginView />
          </Route>
          <Route path="/create">
            <CreateView />
          </Route>
        </Switch>
      </Layout>
    </>
  )
}

export default App
