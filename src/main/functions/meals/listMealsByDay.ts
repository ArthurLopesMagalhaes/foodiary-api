import 'reflect-metadata';

import { ListMealsByDayController } from '@application/controllers/meals/ListMealByDayController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(ListMealsByDayController);

export const handler = lambdaHttpAdapter(controller);
