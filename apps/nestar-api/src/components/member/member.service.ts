import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Member, Members } from '../../libs/dto/member/member';
import { AgentsInquiry, LoginInput, MemberInput, MembersInquiry } from '../../libs/dto/member/member.input';
import { MemberStatus } from '../../libs/enums/member.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { T } from '../../libs/types/common';
import { ViewService } from '../view/view.service';
import { View } from '../../libs/dto/view/view';
import { ViewGroup } from '../../libs/enums/view.enum';

// Oshxona — asosiy mantiq shu yerda, baza bilan to'g'ridan-to'g'ri ishlaydi
@Injectable()
export class MemberService {
	constructor(
		// MongoDB dagi "Member" jadvaliga ulanish
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		// Parol va token bilan ishlash uchun AuthService
		private authService: AuthService,
		private viewService: ViewService,
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

	public async updateMember(memberId: ObjectId, input: MemberUpdate): Promise<Member> {
		const result: Member | null = await this.memberModel
			.findOneAndUpdate(
				{
					_id: memberId,
					memberStatus: MemberStatus.ACTIVE,
				},
				input,
				{ new: true },
			)
			.exec();
		if (!result) {
			throw new InternalServerErrorException(Message.UPLOAD_FAILED);
		}
		result.accessToken = await this.authService.createToken(result);
		return result;
	}

	public async getMember(memberId: ObjectId, targetId: ObjectId): Promise<Member> {
		const search: T = {
			_id: targetId,
			memberStatus: {
				$in: [MemberStatus.ACTIVE, MemberStatus.BLOCK],
			},
		};
		const targetMember = await this.memberModel.findOne(search).lean().exec();
		if (!targetMember) {
			throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		}

		if (memberId) {
			//record view
			const viewInput = {
				viewGroup: ViewGroup.MEMBER,
				viewRefId: targetId,
				memberId: memberId,
			};
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.memberModel.findOneAndUpdate(search, { $inc: { memberViews: 1 } }, { new: true }).exec();
				targetMember.memberViews++;
			}
			// memberview
			//meliked
			//mefollowed
		}
		return targetMember;
	}

	public async getAgents(input: AgentsInquiry, memberId: ObjectId): Promise<Members> {
		const { text } = input.search;
		const match: T = {
			memberType: 'AGENT',
			memberStatus: MemberStatus.ACTIVE,
		};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (text) match.memberNick = { $regex: new RegExp(text, 'i') };
		console.log('Match object for getAgents:', match);

		const result = await this.memberModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	public async getAllMembersByAdmin(input: MembersInquiry): Promise<Members> {
		const { memberStatus, memberType, text } = input.search;
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (memberStatus) match.memberStatus = memberStatus;
		if (memberType) match.memberType = memberType;
		if (text) match.memberNick = { $regex: new RegExp(text, 'i') };
		console.log('Match object for getAgents:', match);

		const result = await this.memberModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	public async updateMemberByAdmin(input: MemberUpdate): Promise<Member> {
		const result: Member | null = await this.memberModel
			.findOneAndUpdate({ _id: input._id }, input, { new: true })
			.exec();
		if (!result) {
			throw new InternalServerErrorException(Message.UPDATE_FAILED);
		}
		return result;
	}
}
