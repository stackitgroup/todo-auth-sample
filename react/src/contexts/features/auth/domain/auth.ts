export class Auth {
    userId: string
    constructor(attributes: { userId: string }) {
      this.userId = attributes.userId
    }
}  