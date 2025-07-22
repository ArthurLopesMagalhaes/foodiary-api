import { Account } from '@application/entities/Account';
import { Goal } from '@application/entities/Goal';
import { Profile } from '@application/entities/Profile';
import { Injectable } from '@kernel/decorators/Injectable';
import { AccountRepository } from '../repositories/accountRepository';
import { GoalRepository } from '../repositories/goalRepository';
import { ProfileRepository } from '../repositories/profileRepository';
import { UnitOfWork } from './UnitOfWork';

@Injectable()
export class SignUpUnitOfWork extends UnitOfWork {
  constructor(
    private accountRepository: AccountRepository,
    private goalRepository: GoalRepository,
    private profileRepository: ProfileRepository,
  ) {
    super();
  }

  async run({ account, profile, goal }: SignUpUnitOfWork.RunParams) {
    this.addPut(this.accountRepository.getPutCommandInput(account));
    this.addPut(this.profileRepository.getPutCommandInput(profile));
    this.addPut(this.goalRepository.getPutCommandInput(goal));

    await this.commit();
  }
}

export namespace SignUpUnitOfWork {
  export type RunParams = {
    account: Account;
    profile: Profile;
    goal: Goal;
  }
}
