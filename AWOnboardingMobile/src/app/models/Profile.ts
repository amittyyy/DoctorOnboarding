export interface Profile {

    name: string;
    employeeNumber: any;
    ssn: number;
    city: string;
    address1: string;
    address2: string;
    cty: string;
    state: string;
    zip: string;
    phone: number;
    cellPhone: number;
    email: string;

    salary: number;
    payFrequency: string;

    hireDate: string;
    vacationPayType: string;
    sickPayType: string;
    personalPayType: string;
    sickAvailable: string;
    personalAvailable: string;
    vacationAvailable: string;
    w4FileDate: string;
    i9FileDate: string;
    directDeposit: string;

    fedFileStatus: string;
    fedExemptions: number;
    stateCode: string;

    isContractor: boolean;
    electronicDistributionConsent: boolean;
    enableUpload: boolean;

    payRates: any[];
    deductions: Deductions[];
}

export interface Deductions {
    title: string;
    value: string;
}
