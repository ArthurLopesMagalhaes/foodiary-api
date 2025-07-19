import { Controller } from '@application/contracts/Controller';
import { BadRequest } from '@application/errors/http/BadRequest';
import { ConfirmForgotPasswordUseCase } from '@application/usecases/auth/ConfirmForgotPasswordUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/Schema';
import { ConfirmForgotPasswordBody, ConfirmForgotPasswordSchema } from './schemas/confirmForgotPasswordSchema';

@Injectable()
@Schema(ConfirmForgotPasswordSchema)
export class ConfirmForgotPasswordController extends Controller<'public', ConfirmForgotPasswordController.Response> {
  constructor(private readonly confirmForgotPasswordUseCase: ConfirmForgotPasswordUseCase) {
    super();
  }

  protected override async handle(
    { body }: Controller.Request<'public', ConfirmForgotPasswordBody>,
  ): Promise<Controller.Response<ConfirmForgotPasswordController.Response>> {
    try {
      const { email, code, newPassword  } = body;

      await this.confirmForgotPasswordUseCase.execute({ email, code, newPassword });
    } catch {
      throw new BadRequest('Failed. Try again.');
    }

    return {
      statusCode: 204,
    };
  }
}

export namespace ConfirmForgotPasswordController {
  export type Response = null;
}
