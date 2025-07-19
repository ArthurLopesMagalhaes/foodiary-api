import 'reflect-metadata';

import { ConfirmForgotPasswordController } from '@application/controllers/auth/ConfirmForgotPasswordContoller';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(ConfirmForgotPasswordController);

export const handler = lambdaHttpAdapter(controller);
