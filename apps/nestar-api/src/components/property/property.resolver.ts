import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PropertyService } from './property.service';
import { Property } from '../../libs/dto/property/property';
import { PropertyInput } from '../../libs/dto/property/property.input';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { RolesGuard } from '../auth/guards/roles.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { PropertyUpdate } from '../../libs/dto/property/property.update';
import { Properties } from '../../libs/dto/property/property';
import { AgentPropertiesInquiry, PropertiesInquiry } from '../../libs/dto/property/property.input';

@Resolver()
export class PropertyResolver {
	constructor(private readonly propertyService: PropertyService) {}

	@Roles(MemberType.AGENT)
	@UseGuards(AuthGuard, RolesGuard)
	@Mutation(() => Property)
	public async createProperty(
		@Args('input') input: PropertyInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Property> {
		console.log('Mutation: createProperty');
		input.memberId = memberId;

		return await this.propertyService.createProperty(input);
	}

	@UseGuards(WithoutGuard)
	@Query(() => Property)
	public async getProperty(
		@Args('propertyId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Property> {
		console.log('Query: getProperty');
		const propertyId = shapeIntoMongoObjectId(input);
		return await this.propertyService.getProperty(propertyId, memberId);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Property)
	public async updateProperty(
		@Args('input') input: PropertyUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Property> {
		console.log('Mutation: updateProperty');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.propertyService.updateProperty(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query(() => Properties)
	public async getProperties(
		@Args('input') input: PropertiesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Properties> {
		console.log('Query: getProperties');
		return await this.propertyService.getProperties(memberId, input);
	}


	@Roles(MemberType.AGENT)
@UseGuards(RolesGuard)
@Query(() => Properties)
public async getAgentProperties(
    @Args('input') input: AgentPropertiesInquiry,
    @AuthMember('_id') memberId: ObjectId,
): Promise<Properties> {
    console.log('Query: getAgentProperties');
    return await this.propertyService.getAgentProperties(memberId, input);
}
}
