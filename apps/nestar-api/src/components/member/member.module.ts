/**
 * MEMBER modulida 3 ta asosiy fayl ishlaydi — ularning vazifalari:
 *
 * 1. member.resolver.ts  — "QABULXONA"
 *    Foydalanuvchidan so'rov keladi (masalan: "mening profilimni ko'rsat").
 *    Resolver shu so'rovni qabul qilib, Service ga uzatadi.
 *
 * 2. member.service.ts   — "OSHXONA"
 *    Asosiy ish shu yerda bajariladi: ma'lumotlar bazasidan o'qish,
 *    yangi foydalanuvchi qo'shish, tahrirlash va hokazo.
 *
 * 3. member.module.ts    — "BOSHQARUV MARKAZI"
 *    Yuqoridagi ikkalasini bir joyga yig'adi va ularga kerakli
 *    vositalarni (baza, auth) ulaydi.
 *
 * Xulosa: So'rov → Resolver → Service → Baza → Javob
 */
import { Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';
import { AuthModule } from '../auth/auth.module';
import { View } from '../../libs/dto/view/view';
import { ViewModule } from '../view/view.module';

@Module({
	imports: [
		// MongoDB ga "Member" jadvalini (kolleksiyasini) ulaydi — member ma'lumotlari shu yerda saqlanadi
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),

		// Login/token tekshiruvi uchun AuthModule ni ham ulaymiz
		AuthModule,
		ViewModule
	],

	// Resolver va Service ni ro'yxatdan o'tkazamiz — ular birgalikda ishlaydi
	providers: [MemberResolver, MemberService],
	exports: [MemberService] // Agar boshqa modullar ham MemberService ni ishlatmoqchi bo'lsa, uni export qilamiz
})
export class MemberModule {}
