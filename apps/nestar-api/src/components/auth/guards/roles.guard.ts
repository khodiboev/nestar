import { BadRequestException, CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { Message } from 'apps/nestar-api/src/libs/enums/common.enum';

/**
 * RolesGuard — foydalanuvchining rolini tekshiruvchi Guard (himoyachi).
 *
 * @Roles('ADMIN', 'AGENT') dekorator bilan belgilangan endpoint'larga
 * faqat shu rollardagi foydalanuvchilar kirishi mumkin.
 *
 * Qanday ishlaydi:
 *  1. Reflector orqali handler'ga qo'yilgan @Roles() meta-ma'lumotni o'qiydi.
 *  2. Agar @Roles() umuman qo'yilmagan bo'lsa — hamma o'ta oladi (ochiq route).
 *  3. GraphQL kontekstida:
 *     a) request header'idan "Authorization: Bearer <token>" ni oladi.
 *     b) AuthService.verifyToken() orqali JWT tokenni tekshiradi va
 *        foydalanuvchi (authMember) ma'lumotini qaytaradi.
 *     c) authMember.memberType allowed rollar ichida bo'lsa — ruxsat beradi,
 *        aks holda ForbiddenException otadi.
 *     d) Tasdiqlangan authMember ni request.body'ga qo'shib keyingi
 *        resolver'lar uni ishlatishi uchun uzatadi.
 *  4. HTTP / RPC / gRPC kabi boshqa kontekstlar hozircha o'tkazib yuboriladi.
 */
@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		// Reflector — dekorator meta-ma'lumotlarini (masalan @Roles()) o'qiydi
		private reflector: Reflector,
		// AuthService — JWT tokenni verify qilish uchun ishlatiladi
		private authService: AuthService,
	) {}

	async canActivate(context: ExecutionContext | any): Promise<boolean> {
		// Handler'ga @Roles(...) dekorator qo'yilgan bo'lsa, shu rollar massivini oladi.
		// Qo'yilmagan bo'lsa — roles = undefined, route ochiq deb hisoblanadi.
		const roles = this.reflector.get<string[]>('roles', context.getHandler());
		if (!roles) return true;

		console.info(`--- @guard() Authentication [RolesGuard]: ${roles} ---`);

		if (context.contextType === 'graphql') {
			// GraphQL kontekstida 3-argument (index 2) — context ob'ekti, uning ichida req bor
			const request = context.getArgByIndex(2).req;

			// HTTP header'dan "Bearer <token>" formatidagi Authorization qiymatini olamiz
			const bearerToken = request.headers.authorization;
			if (!bearerToken) throw new BadRequestException(Message.TOKEN_NOT_EXIST);

			// "Bearer eyJhbGc..." — bo'sh joy bo'yicha ajratib, faqat tokenni olamiz (index 1)
			const token = bearerToken.split(' ')[1],
				// Tokenni tekshirib, ichidan foydalanuvchi ma'lumotini (authMember) chiqaramiz
				authMember = await this.authService.verifyToken(token),
				// authMember.memberType allowed rollar ro'yxatida bormi?
				hasRole = () => roles.indexOf(authMember.memberType) > -1,
				hasPermission: boolean = hasRole();

			// Foydalanuvchi topilmasa yoki roli mos kelmasa — 403 Forbidden xatosi
			if (!authMember || !hasPermission) throw new ForbiddenException(Message.ONLY_SPECIFIC_ROLES_ALLOWED);

			console.log('memberNick[roles] =>', authMember.memberNick);

			// Keyingi resolver'lar authMember'ga @AuthMember() dekorator orqali
			// kirishlari uchun uni request.body'ga saqlaymiz
			request.body.authMember = authMember;
			return true;
		}

		// HTTP, RPC, gRPC va boshqa kontekstlar hozircha tekshirilmaydi — o'tkazib yuboriladi
		return true;
	}
}
