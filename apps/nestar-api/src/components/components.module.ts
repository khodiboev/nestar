import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { PropertyModule } from './property/property.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { ViewModule } from './view/view.module';
import { FollowModule } from './follow/follow.module';
import { BoardArticleModule } from './board-article/board-article.module';

/**
 * MODULE nima?
 * -----------
 * Modul — bu dasturning bir bo'limi (qismi).
 * Xuddi uyning xonalari kabi: oshxona, yotoqxona, vannaxona —
 * har biri o'z vazifasini bajaradi, lekin hammasi bir uyga tegishli.
 *
 * Masalan:
 *   MemberModule  → foydalanuvchilar bilan bog'liq hamma narsa
 *   PropertyModule → e'lonlar (uy, kvartira) bilan bog'liq hamma narsa
 *   AuthModule    → kirish/chiqish (login/logout) bilan bog'liq hamma narsa
 *
 * NIMA UCHUN AYNAN SHU FAYL?
 * --------------------------
 * app.module.ts — dasturning bosh moduli, u juda katta bo'lib ketmasligi uchun
 * barcha kichik modullar shu ComponentsModule ichiga yig'ilgan,
 * keyin faqat bitta ComponentsModule app.module.ts ga ulanadi.
 * Bu tartib va toza kod uchun qilingan — xona ichidagi narsalarni
 * to'g'ridan-to'g'ri ko'chaga chiqarmasdan, avval xonaga yig'asiz.
 */
@Module({
	imports: [
		MemberModule, // Foydalanuvchilar: ro'yxatdan o'tish, profil
		AuthModule, // Kirish va xavfsizlik: login, token
		PropertyModule, // Ko'chmas mulk e'lonlari
		BoardArticleModule, // Forum / maqolalar
		CommentModule, // Izohlar
		LikeModule, // Yoqtirishlar (like)
		ViewModule, // Ko'rishlar soni
		FollowModule, // Obuna (follow/unfollow)
	],
})
export class ComponentsModule {}
