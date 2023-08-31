import { Body, Controller, HttpException, HttpStatus, Param, Post, UseInterceptors } from "@nestjs/common";
import { ValidatorInterceptor } from "src/interceptors/validator.interceptor";
import { CreateAddressContract } from "src/modules/backoffice/contracts/address/create-address.contract";
import { Address } from "src/modules/backoffice/models/address.model";
import { Result } from "src/modules/backoffice/models/result.model";
import { AddressService } from "../services/address.service";
import { AddressType } from "../enum/address-type.enum";

@Controller('v1/addresses')
export class AddressController {

    constructor(
        private readonly addressService: AddressService
        ) {}

    @Post(':document/billing')
    @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
    async addBillingAddress(@Param('document') document, @Body() model: Address){
        try {
            const result = await this.addressService.create(document, model, AddressType.Billing);
            return result;
        } catch (error) {
            throw new HttpException(new Result('Não foi possivel adicionar seu endereço', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Post(':document/shipping')
    @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
    async addShippingAddress(@Param('document') document, @Body() model: Address){
        try {
            const result = await this.addressService.create(document, model, AddressType.Shipping);
            return result;
        } catch (error) {
            throw new HttpException(new Result('Não foi possivel adicionar seu endereço', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }
}