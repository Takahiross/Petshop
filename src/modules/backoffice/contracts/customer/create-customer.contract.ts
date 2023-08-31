import { Flunt } from "src/utils/flunt";
import { Contract } from "../contract";
import { Injectable } from "@nestjs/common";
import { CreateCustomerDto } from "src/modules/backoffice/dtos/customer/create-customer.dto";

@Injectable()
export class CreateCustomerContract implements Contract{

    errors: any[];

    validate(model: CreateCustomerDto): boolean {
        const flunt = new Flunt();

        flunt.hasMinLen(model.name, 5, 'Name invalid!');
        flunt.isEmail(model.email, 'Email invalid!');
        flunt.isFixedLen(model.document, 11, 'Document invalid!');
        flunt.hasMinLen(model.password, 6, 'Password invalid!');

        this.errors = flunt.errors;
        return flunt.isValid();
    }

}