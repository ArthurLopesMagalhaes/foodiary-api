import 'reflect-metadata';

import { Registry } from '@kernel/di/Registry';
import { lambdaSQSAdapter } from '@main/adapters/lambdaSQSAdapter';
import { MealsQueueConsumer } from '@application/queues/MealsQueueConsumer';

const consumer = Registry.getInstance().resolve(MealsQueueConsumer);

export const handler = lambdaSQSAdapter(consumer);
