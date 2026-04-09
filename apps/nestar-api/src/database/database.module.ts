import { Module } from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

/**
 * DATABASE nima?
 * --------------
 * Ma'lumotlar bazasi — bu dasturning "xotirasi".
 * Foydalanuvchilar, e'lonlar, izohlar — hammasi shu yerda saqlanadi.
 * Dastur o'chirilib yonsa ham, ma'lumotlar yo'qolmaydi.
 *
 * Biz MongoDB ishlatamiz — bu ma'lumotlarni "papka ichidagi papka" kabi
 * qulay va moslashuvchan tarzda saqlaydi.
 *
 * NIMA UCHUN ALOHIDA MODUL?
 * -------------------------
 * Ma'lumotlar bazasiga ulanish — bu alohida mas'uliyat.
 * Uni boshqa modullardan ajratib bu yerga yozdik,
 * shunda istalgan modul bu ulanishdan foydalana oladi.
 */
@Module({
	imports: [
		// MongoDB ga ulanish — manzil (URI) .env fayldan olinadi:
		// ishlab chiqishda (development) — test bazasi
		// nashrda (production) — haqiqiy baza
		MongooseModule.forRootAsync({
			useFactory: () => ({
				uri: process.env.NODE_ENV == 'production' ? process.env.MONGO_PROD : process.env.MONGO_DEV,
			}),
		}),
	],

	// Boshqa modullar ham bazadan foydalana olishi uchun "eksport" qilamiz
	exports: [MongooseModule],
})
export class DatabaseModule {
	// Modul ishga tushganda baza bilan bog'lanish tekshiriladi
	constructor(@InjectConnection() private readonly connection: Connection) {
		// readyState === 1 degani: ulanish muvaffaqiyatli
		if (connection.readyState === 1) {
			console.log(
				`MongoDB is connected into ${process.env.NODE_ENV == 'production' ? 'production' : 'development'} db`,
			);
		} else {
			// Ulanish muvaffaqiyatsiz bo'lsa xato xabar chiqaradi
			console.error('Failed to connect to MongoDB');
		}
	}
}
