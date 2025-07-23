import { Meal } from '@application/entities/Meal';

export class MealItem {
  static readonly type = 'Meal';

  private readonly keys: MealItem.Keys;

  constructor(private readonly attrs: MealItem.Attributes) {
    this.keys = {
      PK: MealItem.getPK(this.attrs.id),
      SK: MealItem.getSK(this.attrs.id),
      GSI1PK: MealItem.getGSI1PK({
        accountId: this.attrs.accountId,
        createdAt: new Date(this.attrs.createdAt),
      }),
      GSI1SK: MealItem.getGSI1SK(this.attrs.id),
    };
  }

  toItem(): MealItem.ItemType {
    return {
      ...this.keys,
      ...this.attrs,
      type: MealItem.type,
    };
  }

  static fromEntity(meal: Meal): MealItem {
    return new MealItem({
      ...meal,
      createdAt: meal.createdAt.toISOString(),
    });
  }

  static toEntity(mealItem: MealItem.ItemType): Meal {
    return new Meal({
      id: mealItem.id,
      accountId: mealItem.accountId,
      status: mealItem.status,
      attempts: mealItem.attempts,
      inputType: mealItem.inputType,
      inputFileKey: mealItem.inputFileKey,
      name: mealItem.name,
      icon: mealItem.icon,
      foods: mealItem.foods,
      createdAt: new Date(mealItem.createdAt),
    });
  }

  static getPK(mealId: string): MealItem.Keys['PK'] {
    return `MEAL#${mealId}`;
  }

  static getSK(mealId: string): MealItem.Keys['SK'] {
    return `MEAL#${mealId}`;
  }

  static getGSI1PK({ accountId, createdAt }: MealItem.GSIPKParams): MealItem.Keys['GSI1PK'] {
    const year = createdAt.getFullYear().toString() as Year;
    const month = (createdAt.getMonth() + 1).toString().padStart(2, '0') as Month;
    const day = createdAt.getDate().toString().padStart(2, '0') as Day;

    return `MEALS#${accountId}#${year}-${month}-${day}`;
  }

  static getGSI1SK(mealId: string): MealItem.Keys['GSI1SK'] {
    return `MEAL#${mealId}`;
  }
}

export namespace MealItem {
  export type Keys = {
    PK: `MEAL#${string}`;
    SK: `MEAL#${string}`;
    GSI1PK: `MEALS#${string}#${DateString}`;
    GSI1SK: `MEAL#${string}`;
  };

  export type Attributes = {
    id: string;
    accountId: string;
    status: Meal.Status;
    attempts: number;
    inputType: Meal.InputType;
    inputFileKey: string;
    name: string;
    icon: string;
    foods: Meal.Food[];
    createdAt: string;
  };

  export type ItemType = Keys & Attributes & {
    type: 'Meal';
  };

  export type GSIPKParams = {
    accountId: string;
    createdAt: Date;
  }
}

type Year = `${number}${number}${number}${number}`;
type Month = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `1${0 | 1 | 2}`;
type Day = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `${1 | 2}${number}` | `3${0 | 1}`;

type DateString = `${Year}-${Month}-${Day}`;
