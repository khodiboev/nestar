import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, Length, IsOptional, IsIn, Min, IsInt } from 'class-validator';
import { PropertyLocation, PropertyType } from '../../enums/property.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class PropertyInput {
	@IsNotEmpty()
	@Field(() => PropertyType)
	propertyType!: PropertyType;

	@IsNotEmpty()
	@Field(() => PropertyLocation)
	propertyLocation!: PropertyLocation;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	propertyAddress!: string;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	propertyTitle!: string;

	@IsNotEmpty()
	@Min(0)
	@Field(() => Number)
	propertyPrice!: number;

	@IsNotEmpty()
	@Min(0)
	@Field(() => Number)
	propertySquare!: number;

	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Field(() => Int)
	propertyBeds!: number;

	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Field(() => Int)
	propertyRooms!: number;

	@IsNotEmpty()
	@Field(() => [String])
	propertyImages!: string[];

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	propertyDesc?: string;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	propertyBarter!: boolean;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	propertyRent!: boolean;

	memberId!: ObjectId;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	constructedAt?: Date;
}
