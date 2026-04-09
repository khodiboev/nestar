import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { MemberStatus } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';

// Oshxona — asosiy mantiq shu yerda, baza bilan to'g'ridan-to'g'ri ishlaydi
@Injectable()
export class MemberService {
	constructor(
		// MongoDB dagi "Member" jadvaliga ulanish
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		// Parol va token bilan ishlash uchun AuthService
		private authService: AuthService,
	) {}

	public async signup(input: MemberInput): Promise<Member> {
		// Parolni ochiq matn sifatida saqlamaslik uchun avval shifrlaymiz
		input.memberPassword = await this.authService.hashPassword(input.memberPassword);
		try {
			// Yangi foydalanuvchini bazaga yozamiz
			const result = await this.memberModel.create(input);
			// Muvaffaqiyatli ro'yxatdan o'tgan foydalanuvchiga token beramiz
			result.accessToken = await this.authService.createToken(result);
			return result;
		} catch (err) {
			// Nick yoki telefon raqam allaqachon mavjud bo'lsa xato qaytaradi
			throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
		}
	}

	public async login(input: LoginInput): Promise<Member> {
		const { memberNick, memberPassword } = input;
		console.log('LoginInput:', input);

		// Bazadan shu nickdagi foydalanuvchini topamiz
		// .select('+memberPassword') — parol odatda yashirin, bu yerda uni ham olamiz
		const response: Member | null = await this.memberModel
			.findOne({ memberNick: memberNick })
			.select('+memberPassword')
			.exec();

		// Foydalanuvchi topilmasa yoki o'chirilgan bo'lsa — xato
		if (!response || response.memberStatus === MemberStatus.DELETE) {
			throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
		} else if (response.memberStatus === MemberStatus.BLOCK) {
			// Bloklangan foydalanuvchi kira olmaydi
			throw new InternalServerErrorException(Message.BLOCKED_USER);
		}

		// Foydalanuvchi kiritgan parolni bazadagi shifrlangan parol bilan taqqoslaymiz
		const isMatch = await this.authService.comparePasswords(input.memberPassword, response.memberPassword as string);
		if (!isMatch) throw new InternalServerErrorException(Message.WRONG_PASSWORD);

		// Parol to'g'ri — token yaratib, foydalanuvchiga beramiz
		response.accessToken = await this.authService.createToken(response);

		return response;
	}

	public async updateMember(): Promise<String> {
		return 'updateMember executed!';
	}

	public async getMember(): Promise<String> {
		return 'getMember executed!';
	}

	public async updateAllMembersByAdmin(): Promise<String> {
		return 'updateAllMembersByAdmin executed!';
	}

	public async updateMemberByAdmin(): Promise<String> {
		return 'updateMemberByAdmin executed!';
	}
}
