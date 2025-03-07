import { HelloWorldRepository } from '../domain/hello-world.repository'
import { useHelloWorldStore } from '../infrastructure/hello-world.store'
import { HttpHelloWorldRepository } from '../infrastructure/http-hello-world.repository'

export const HelloWorldService = (repository: HelloWorldRepository) => {
  if (repository === undefined) {
    throw new Error(
      'Repository is undefined. Please check if the repository is initialized correctly.'
    )
  }

  return {
    updateCounter: (event: 'increase' | 'decrease'): void => {
      // #region Zustand
      const currentCounter = useHelloWorldStore.getState().counter
      const finalResult =
        event === 'increase' ? currentCounter + 1 : currentCounter - 1

      useHelloWorldStore.setState({ counter: finalResult })
      // #endregion Zustand
    },
    ping: async (): Promise<void> => {
      await repository.ping()
      useHelloWorldStore.setState({ counter: Math.random() })
    }
  }
}

export const helloWorldService = HelloWorldService(
  new HttpHelloWorldRepository()
)
