export class Subfields {
    id: 0;
    productFieldId:any ={
        id: null,
        isCoApplicant:null,
        isApplicant:null
    };
    subFieldId:any= {
        id: null
    };
    minValue: 0;
    maxValue: 0;
   
}

export class Fields{
   
        id: number;
        product:any= {
          id: 0,
        };
        isMandatory: Boolean;
        isCoApplicant: Boolean;
        isApplicant: Boolean;
        isConsidered:Boolean;
        fieldResponse: {};
        subFieldResponse: null
     
}