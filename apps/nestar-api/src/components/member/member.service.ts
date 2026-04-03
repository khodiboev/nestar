import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MemberService {

  constructor(@InjectModel('Member') private readonly memberModel: Model<null>) {}

  public async signup(): Promise<string> {
    return 'Sign up successful';
  }

  public async login(): Promise<string> {
    return 'Login successful';
  }

  public async updateMember(): Promise<string> {
    return 'Member updated successful';
  }

  public async getMember(): Promise<string> {
    return 'Member retrieved successful';
  }
}
