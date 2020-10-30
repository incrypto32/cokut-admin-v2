export interface Restaurant {
    id: string;
    name: string;
    closed: boolean;
    type: string;
    phone: string;
    locationUrl:string;
    location:any;
    email: string;
    logo: string;
    address: string;

  }
  
  export interface Order {
    id: string;
    rid: string;
    uid:string;
    address: Address;
    items:Map<String,number>;
    meals:Array<Meal>;
    summary:Array<Summary>;
    user:User;
    restaurant:Restaurant;
    time:any;
    price:number;
    total:number;
    deliveryCharge:number;
    status:string;
    statusCode:number;
  }

  export interface User{
    id:string;
    uid:string;
    name:string;
    phone:string;
    email:string;
    address:Map<String,Address>;
  }

  export interface Address{
    place:PlaceInfo;
    title:string;
    zone:string;
    adl2:string;
    adl3:string;
    adl4:string;
  }

  export interface PlaceInfo{
    name:string;
    details:string;
    latitude:number;
    longitude:number;
  }

  export interface Summary{
    meal: Meal;
    count: number;
    price: number;
  }

  export interface Meal {
    id: string;
    rid:string;
    name: string;
    available: boolean;
    spice:boolean,
    special:boolean,
    price: number;
    strikedPrice: number;
    
  }
  

  export type VForm = Vue & any