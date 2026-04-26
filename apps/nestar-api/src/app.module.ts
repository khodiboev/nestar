import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
import { T } from './libs/types/common';
import { SocketModule } from './socket/socket.module';

// Dasturning bosh moduli — barcha qismlar shu yerda yig'iladi
@Module({
	imports: [
		// .env faylidagi maxfiy sozlamalarni (parollar, portlar) dasturga yuklaydi
		ConfigModule.forRoot(),

		// GraphQL — bu mijoz bilan gaplashish tili (REST o'rniga ishlatiladi)
		GraphQLModule.forRoot({
			driver: ApolloDriver,

			// Brauzerdagi test maydoni — ishlab chiqishda so'rovlarni sinab ko'rish uchun
			playground: true,

			// Fayl yuklash o'chirilgan
			uploads: false,

			// GraphQL sxemasini kod asosida avtomatik yaratadi (qo'lda yozish shart emas)
			autoSchemaFile: true,

			// Xato yuz berganda foydalanuvchiga qulay va tushunarli xabar qaytaradi
			formatError: (error: T) => {
				const graphQLFormattedError = {
					code: error?.extensions.code,
					message:
						error?.extensions?.exception?.response?.message || error?.extensions?.response?.message || error?.message,
				};
				console.log('GraphQLFormattedError:', graphQLFormattedError);
				return graphQLFormattedError;
			},
		}),

		// Dasturning barcha bo'limlari (member, property va h.k.) shu yerdan ulanadi
		ComponentsModule,

		// Ma'lumotlar bazasi bilan bog'lanishni ta'minlaydi
		DatabaseModule,

		SocketModule,
	],

	// So'rovlarni qabul qiluvchi — "qabulxona" vazifasini bajaradi
	controllers: [AppController],

	// Asosiy ishlarni bajaruvchi xizmatlar ro'yxati
	providers: [AppService, AppResolver],
})
export class AppModule {}
