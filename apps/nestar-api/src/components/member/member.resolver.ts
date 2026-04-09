import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';

// Qabulxona — foydalanuvchidan kelgan so'rovlarni qabul qilib, Service ga uzatadi
@Resolver()
export class MemberResolver {
	// MemberService ni ishlatish uchun ichiga yuklaymiz
	constructor(private readonly memberService: MemberService) {}

	// Mutation = ma'lumotni O'ZGARTIRUVCHI so'rov (yozish, tahrir, o'chirish)
	// Query   = ma'lumotni FAQAT O'QUVCHI so'rov

	// Yangi foydalanuvchi ro'yxatdan o'tkazadi
	@Mutation(() => Member)
	public async signup(@Args('input') input: MemberInput): Promise<Member> {
		console.log('Mutation: signup');
		return this.memberService.signup(input);
	}

	// Mavjud foydalanuvchini tizimga kiritadi, token qaytaradi
	@Mutation(() => Member)
	public async login(@Args('input') input: LoginInput): Promise<Member> {
		console.log('Mutation: login');
		return this.memberService.login(input);
	}

	// Foydalanuvchi ma'lumotlarini yangilaydi (hali to'liq yozilmagan)
	// Authonticated
	@UseGuards(AuthGuard)
	@Mutation(() => String)
	public async updateMember(@AuthMember("_id") memberId: ObjectId): Promise<String> {
		console.log('Mutation: updateMember');
		return this.memberService.updateMember();
	}


		@UseGuards(AuthGuard)
	@Query(() => String)
	public async checkAuth(@AuthMember("memberNick") memberNick: string): Promise<String> {
		console.log('Mutation: checkAuth');
		console.log('Authenticated memberNick:', memberNick);
		return `Hi ${memberNick}`;
	}



	// Bitta foydalanuvchi ma'lumotlarini qaytaradi (hali to'liq yozilmagan)
	@Query(() => String)
	public async getMember(): Promise<String> {
		console.log('Query: getMember');
		return this.memberService.getMember();
	}

	/** ADMIN */

	// Authorization: ADMIN
	@Mutation(() => String)
	public async getAllMembersByAdmin(): Promise<String> {
		return '';
	}

	// Authorization: ADMIN
	@Mutation(() => String)
	public async updateMemberByAdmin(): Promise<String> {
		return '';
	}
}
