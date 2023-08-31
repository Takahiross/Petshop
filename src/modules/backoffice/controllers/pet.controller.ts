import { Body, Controller, HttpException, HttpStatus, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { ValidatorInterceptor } from "src/interceptors/validator.interceptor";
import { Result } from "src/modules/backoffice/models/result.model";
import { CreatePetContract } from "src/modules/backoffice/contracts/pet/create-pet.contract";
import { Pet } from "src/modules/backoffice/models/pet.model";
import { PetService } from "../services/pet.service";

@Controller('v1/pets')
export class PetController {

    constructor(
        private readonly petService: PetService, 
        ) {}

    @Post(':document')
    @UseInterceptors(new ValidatorInterceptor(new CreatePetContract()))
    async createPet(@Param('document') document, @Body() model: Pet){
        try {
            const result = await this.petService.create(document, model);
            return result;
        } catch (error) {
            throw new HttpException(new Result('Não foi possivel adicionar seu pet', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':document/:id')
    @UseInterceptors(new ValidatorInterceptor(new CreatePetContract()))
    async updatePet(@Param('document') document, @Param('id') id,@Body() model: Pet){
        try {
            const result = await this.petService.update(document, id, model);
            return result;
        } catch (error) {
            throw new HttpException(new Result('Não foi possivel adicionar seu pet', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }
}