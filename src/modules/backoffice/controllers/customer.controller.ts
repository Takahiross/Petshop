import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { AccountService } from "src/modules/backoffice/services/account.service";
import { CreateCustomerDto } from "src/modules/backoffice/dtos/customer/create-customer.dto";
import { CustomerService } from "src/modules/backoffice/services/customer.service";
import { Result } from "src/modules/backoffice/models/result.model";
import { QueryDto } from "src/modules/backoffice/dtos/query.dto";
import { ValidatorInterceptor } from "src/interceptors/validator.interceptor";
import { CreateCustomerContract } from "../contracts/customer/create-customer.contract";
import { Customer } from "../models/customer.model";
import { User } from "../models/user.model";
import { UpdateCustomerContract } from "../contracts/customer/update-customer.contract";
import { UpdateCustomerDto } from "../dtos/customer/update-customer.dto";
import { CreateCreditCardContract } from "../contracts/customer/create-credit-card.contract";
import { CreditCard } from "../models/credit-card.model";
import { QueryContract } from "../contracts/query.contract";

@Controller('v1/customers')
export class CustomerController {

    constructor(
        private readonly accountService: AccountService, 
        private readonly customerService: CustomerService 
        ) {}

    @Get()
    getAll(){
        const customers = this.customerService.findAll();
        return new Result(null, true, customers, null);
    }

    @Get(':document')
    getById(@Param('document') document){
        const customer = this.customerService.find(document);
        return new Result(null, true, customer, null);
    }

    @Post()
    @UseInterceptors(new ValidatorInterceptor(new CreateCustomerContract()))
    async post(@Body() model: CreateCustomerDto) {
        try {
            const user = await this.accountService.create(new User(model.document, model.password, false));
            const customer = new Customer(model.name, model.document, model.email, [], null, null, null, user);
            await this.customerService.create(customer);
            return new Result(null, true, model, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possível realizar seu cadastro', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Post('query')
    @UseInterceptors(new ValidatorInterceptor(new QueryContract()))
    async query(@Body() model: QueryDto){
        try {
            const customers = await this.customerService.query(model);
            return new Result(null, true, customers, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possivel adicionar seu pet', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Put()
    @UseInterceptors(new ValidatorInterceptor(new UpdateCustomerContract()))
    async update(@Param('document') document, @Body() model: UpdateCustomerDto) {
        try {
            await this.customerService.update(document, model);
            return new Result(null, true, model, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possível realizar atualizar o cliente', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }
    
    @Post(':document/credit-cards')
    @UseInterceptors(new ValidatorInterceptor(new CreateCreditCardContract()))
    async createBilling(@Param('document') document, @Body() model: CreditCard) {
        try {
            await this.customerService.saveOrUpdateCreditCard(document, model);
            return new Result(null, true, model, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possível adicionar seu cartão de crédito', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }
}