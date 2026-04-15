import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';
import { graphqlUploadExpress } from "graphql-upload";
import * as express from "express";

// Dasturni yoqadigan asosiy funksiya
async function bootstrap() {
	// Butun dasturni yaratamiz (barcha modullar birlashtiriladi)
	const app = await NestFactory.create(AppModule);

	// Foydalanuvchi noto'g'ri ma'lumot yuborganda avtomatik xato qaytarsin
	app.useGlobalPipes(new ValidationPipe());

	// Har bir so'rov kelganda va javob ketganda uni logga yozsin
	app.useGlobalInterceptors(new LoggingInterceptor());

	app.enableCors({origin: true, credentials: true});

	app.use(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 10 }));
	app.use("/uploads", express.static("./uploads"));

	// Server "eshikni ochadi" — PORT_API .env dan olinadi, aks holda 3000-port ishlatiladi
	await app.listen(process.env.PORT_API ?? 3000);
}

// Yoqish funksiyasini chaqiramiz — dastur shu yerdan boshlanadi
bootstrap();
