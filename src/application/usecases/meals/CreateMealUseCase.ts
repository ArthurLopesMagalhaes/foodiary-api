import { Meal } from '@application/entities/Meal';
import { MealRepository } from '@infra/database/dynamo/repositories/mealRepository';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class CreateMealUseCase {
  constructor(
    private readonly mealRepository: MealRepository,
  ) {}

  async execute({
    accountId,
    file,
  }: CreateMealUseCase.Input): Promise<CreateMealUseCase.Output> {

    const meal = new Meal({
      accountId,
      inputType: file.inputType,
      status: Meal.Status.UPLOADING,
      inputFileKey: 'q345r6t7y8u9i0o',
    });

    await this.mealRepository.create(meal);

    return {
      mealId: meal.id,
    };
  }
}

export namespace CreateMealUseCase {
  export type Input = {
    accountId: string;
    file: {
      inputType: Meal.InputType;
      size: number;
    };
  };

  export type Output = {
    mealId: string;
  };
}
