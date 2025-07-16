import 'reflect-metadata';

import { CreateMealController } from '@application/controllers/auth/meals/CreateMealController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(CreateMealController);

export const handler = lambdaHttpAdapter(controller);
