import { Injectable } from '@kernel/decorators/Injectable';
import { AuthGateway } from 'src/infra/gateways/AuthGateway';

@Injectable()
export class SignUpUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute({
    email,
    password,
  }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {

    const { externalId } = await this.authGateway.signUp({
      email,
      password,
    });

    return {
      accessToken: 'mocked-access-token',
      refreshToken: 'mocked-refresh-token',
    };
  }
}

export namespace SignUpUseCase {
  export type Input = {
    email: string;
    password: string;
  }

  export type Output = {
    accessToken: string;
    refreshToken: string;
  };
}
