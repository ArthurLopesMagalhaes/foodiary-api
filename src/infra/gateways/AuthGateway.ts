import { ConfirmForgotPasswordCommand, ForgotPasswordCommand, GetTokensFromRefreshTokenCommand, InitiateAuthCommand, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@infra/clients/cognitoClient';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { createHmac } from 'node:crypto';

@Injectable()
export class AuthGateway {
  constructor(private readonly appConfig: AppConfig) {}

  async signIn({
    email,
    password,
  }: AuthGateway.SignInParams): Promise<AuthGateway.SignInResult> {
    const command = new InitiateAuthCommand(({
      ClientId: this.appConfig.auth.cognito.clientId,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.getSecretHash(email),
      },
    }));

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult?.AccessToken || !AuthenticationResult?.RefreshToken) {
      throw new Error(`Failed to sign in user: ${email}`);
    }

    return {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    };
  }

  async signUp({
    email,
    password,
    internalId,
  }: AuthGateway.SignUpParams): Promise<AuthGateway.SignUpResult> {
    const command = new SignUpCommand(({
      ClientId: this.appConfig.auth.cognito.clientId,
      SecretHash: this.getSecretHash(email),
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'custom:internalId', Value: internalId },
      ],
    }));

    const { UserSub: externalId } = await cognitoClient.send(command);

    if (!externalId) {
      throw new Error(`Failed to sign up user: ${email}`);
    }

    return {
      externalId,
    };
  }

  async refreshToken({ refreshToken }: AuthGateway.RefreshTokenParams): Promise<AuthGateway.RefreshTokenResult> {
    const command = new GetTokensFromRefreshTokenCommand({
      ClientId: this.appConfig.auth.cognito.clientId,
      RefreshToken: refreshToken,
      ClientSecret: this.appConfig.auth.cognito.clientSecret,
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult?.AccessToken || !AuthenticationResult?.RefreshToken) {
      throw new Error('Failed to refresh token');
    }

    return {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    };
  };

  async forgotPassword({ email }: AuthGateway.ForgotPasswordParams): Promise<void> {
    const command = new ForgotPasswordCommand({
      ClientId: this.appConfig.auth.cognito.clientId,
      Username: email,
      SecretHash: this.getSecretHash(email),
    });

    await cognitoClient.send(command);
  }

  async confirmForgotPassword({ email, code, newPassword }: AuthGateway.ConfirmForgotPasswordParams): Promise<void> {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: this.appConfig.auth.cognito.clientId,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
      SecretHash: this.getSecretHash(email),
    });

    await cognitoClient.send(command);
  }

  private getSecretHash(email: string) {
    const { clientId, clientSecret } = this.appConfig.auth.cognito;
    const message = `${email}${clientId}`;

    return createHmac('SHA256', clientSecret).update(message).digest('base64');
  }
}

export namespace AuthGateway {
  export type SignUpParams = {
    email: string;
    password: string;
    internalId: string;
  };

  export type SignUpResult = {
    externalId: string;
  };

  export type SignInParams = {
    email: string;
    password: string;
  };

  export type SignInResult = {
    accessToken: string;
    refreshToken: string;
  };

  export type RefreshTokenParams = {
    refreshToken: string;
  };

  export type RefreshTokenResult = {
    accessToken: string;
    refreshToken: string;
  };

  export type ForgotPasswordParams = {
    email: string;
  };

  export type ConfirmForgotPasswordParams = {
    email: string;
    code: string;
    newPassword: string;
  };
}
