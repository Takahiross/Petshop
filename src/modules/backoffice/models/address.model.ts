export class Address {
    constructor(
        public zipCode: string,
        public street: string,
        public number: string,
        public complement: string,
        public neighborhood: string,
        public state: string,
        public city: string,
        public country: string,
    ) {
    }
}