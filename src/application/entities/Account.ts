import KSUID from 'ksuid';

export class Account {
  public readonly id: string;
  public readonly email: string;
  public externalId: string | undefined;
  readonly createdAt: Date;

  constructor(attributes: Account.Attributes) {
    this.id = KSUID.randomSync().string;
    this.email = attributes.email;
    this.externalId = attributes.externalId;
    this.createdAt = new Date();
  }
}

export namespace Account {
  export type Attributes = {
    email: string;
    externalId?: string;
    id?: string;
    createdAt?: Date;
  };
}
