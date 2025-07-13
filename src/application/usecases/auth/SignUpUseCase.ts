import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class SignUpUseCase {
  constructor() {}

  async execute(input: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
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
