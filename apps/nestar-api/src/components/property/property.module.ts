import { Module } from '@nestjs/common';
import { PropertyResolver } from './property.resolver';
import { PropertyService } from './property.service';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { MongooseModule } from '@nestjs/mongoose';
import PropertySchema from '../../schemas/Property.model';
import { Member } from '../../libs/dto/member/member';
import { MemberModule } from '../member/member.module';
import { Like } from '../../libs/dto/like/like';
import { LikeModule } from '../like/like.module';

// bu yerda - > PropertyModule ni yaratamiz, bu modul ichida property bilan bog'liq resolver va service larni joylashtiramiz. Shuningdek, bu modulga kerakli boshqa modullarni import qilamiz, masalan AuthModule, ViewModule, MemberModule va MongooseModule ni Property modelini ro'yxatdan o'tkazish uchun. Bu modul keyinchalik AppModule ga import qilinadi, shunda butun ilovada property bilan bog'liq funksionallik mavjud bo'ladi.
@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Property',
				schema: PropertySchema,
			},
		]),
		AuthModule,
		ViewModule,
		MemberModule,
		LikeModule,
	],
	providers: [PropertyResolver, PropertyService],
	exports: [PropertyService],
})
export class PropertyModule {}
