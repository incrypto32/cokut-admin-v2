import { fire } from '../firebase_helper';
import { Meal, Order, Restaurant } from '../models/models';

export class ApiHelper {
  // http://192.168.43.64:8080
  // static uri = `http://localhost:4000`
  static uri = `http://ec2-65-0-104-115.ap-south-1.compute.amazonaws.com/a`
  static url = `${ApiHelper.uri}/api/v1`
  static staticUrl = `${ApiHelper.uri}/files`
  static adminUrl = `${ApiHelper.uri}/admin`

  static async postData(body: any, endpoint: string, admin = true): Promise<any> {

    const myHeaders = new Headers();
    const token=await fire.getToken()

    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    body.price = parseFloat(body.price)
    const raw = JSON.stringify(body);


    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    const response = await fetch(`${admin ? this.adminUrl : this.url}${endpoint}`, requestOptions)
    if (response.status != 200) {
      throw "Expectation Failed"
    }

    return response.json()

  }

  static async sendForm(formdata: FormData, endpoint: string, admin = true): Promise<object> {
    const myHeaders = new Headers();

    const token=await fire.getToken()

    myHeaders.append("Authorization", `Bearer ${token}`);


    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };



    const response: Response = await fetch(
      `${admin ? this.adminUrl : this.url}${endpoint}`,
      requestOptions
    );

    if (response.status != 200) {
      throw "";
    }
    const result = await response.json();
    console.log(result);
    return result
  }


  static async getData(endpoint: string, admin = false): Promise<any> {
    const myHeaders: Headers = new Headers();

    const token=await fire.getToken()

    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",

    };

    console.log(this.url);
    const response = await fetch(
      `${admin ? this.adminUrl : this.url}${endpoint}`,
      requestOptions
    )
    if (response.status != 200) {
      throw "Expectation failed"
    }
    const result = await response.json()


    return result;
  }

  static async deleteData(endpoint: string, id: string, admin = true): Promise<any> {
    const myHeaders = new Headers();

    const token=await fire.getToken()
    myHeaders.append("Authorization", `Bearer ${token}`);


    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: myHeaders,

      redirect: 'follow'
    };

    const response = await fetch(`${admin ? this.adminUrl : this.url}${endpoint}?id=${id}`, requestOptions)
    if (response.status != 200) {
      throw "Expectation failed"
    }

    return response.json()

  }

}

export class StoreHelper {

  static async getStores(): Promise<Restaurant[]> {
    const a: Restaurant[] = await ApiHelper.getData('/restaurants')
    console.log(JSON.stringify(a))
    return a
  }

  static canParseLocation(url: string): boolean {
    try {

      const location = url.split("@")[1].split(",");
      const latitude: string = location[0];
      const longitude: string = location[1];
      const a = parseFloat(latitude)
      const b = parseFloat(longitude)
      if (isNaN(a) || isNaN(b)) {
        return false
      }

      return true
    } catch (error) {

      return false
    }
  }

  static async deleteStore(id: string): Promise<void> {
    const resp = await ApiHelper.deleteData('/restaurant', id, true)
    console.log(JSON.stringify(resp))
    if (!resp.success) {
      throw "Delete unsuccessfull"
    }
  }

  static async addStore(restaurant: FormData): Promise<void> {

    const resp: any = await ApiHelper.sendForm(restaurant, "/restaurant")

    if (!resp.success) {
      throw "Failed to add restaurant"
    }
  }

  static async changeStoreStatus(id: string, closed: boolean): Promise<boolean> {

    const resp: any = await ApiHelper.postData(
      { id: id, closed: closed },
      "/restaurant/status",
    );

    if (!resp.success) {
      throw "Failed to change status restaurant"
    }

    const store: Restaurant = resp.restaurant

    return store.closed

  }

}

export class MealHelper {
  static async getMeals(rid: string): Promise<Meal[]> {

    const resp: Meal[] = await ApiHelper.getData(`/meals?rid=${rid}`)

    console.log(JSON.stringify(resp))
    return resp

  }

  static async addMeal(restaurant: FormData): Promise<void> {


    const resp: any = await ApiHelper.sendForm(restaurant, "/meal")

    if (!resp.success) {
      throw "Failed to add restaurant"
    }

  }


  static async deleteMeal(id: string): Promise<void> {
    const resp = await ApiHelper.deleteData('/meal', id, true)
    console.log(JSON.stringify(resp))
    if (!resp.success) {
      throw "Delete unsuccessfull"
    }
  }
}



export class OrderHelper {
  static async getOrders(): Promise<Order[]> {

    const resp: any = await ApiHelper.getData(`/orders`,true)
 
    return resp.orders ?? []
  }

  static async changeStatus(id: string,statusCode: number): Promise<Order> {


    const resp: any = await ApiHelper.postData({id:id,statusCode:statusCode},"/orders/status",true)

    if (!resp.success) {
      throw "Failed to change status"
    }

    return resp.order

  }


  static async deleteMeal(id: string): Promise<void> {
    const resp = await ApiHelper.deleteData('/meal', id, true)
    console.log(JSON.stringify(resp))
    if (!resp.success) {
      throw "Delete unsuccessfull"
    }
  }
}