// The ONLY place the app reads food data from.
// Data now comes from the API. loadData() must finish once (see main.tsx)
// before the app renders, so every function below can stay synchronous.
import restaurantsJson from './restaurants.json'
import type { Dish, Restaurant, LatLng } from './types'

// These are not stored in the database. Copy the real values from the
// "meta" block at the top of restaurants.json.
export const DATA_IS_SAMPLE: boolean = restaurantsJson.meta.sample
export const AREA_NAME: string = restaurantsJson.meta.area
export const AREA_CENTER: LatLng = restaurantsJson.meta.center

let dishes: Dish[] = []
let restaurants: Restaurant[] = []
let dishById = new Map<string, Dish>()
let restaurantById = new Map<string, Restaurant>()

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} returned ${res.status}`)
  return res.json() as Promise<T>
}

export async function loadData(): Promise<void> {
  const [d, r] = await Promise.all([
    fetchJson<Dish[]>('/api/dishes'),
    fetchJson<Restaurant[]>('/api/restaurants'),
  ])
  dishes = d
  restaurants = r
  dishById = new Map(dishes.map((x) => [x.id, x]))
  restaurantById = new Map(restaurants.map((x) => [x.id, x]))
}

export function getDishes(): Dish[] {
  return dishes
}

export function getDish(id: string): Dish | undefined {
  return dishById.get(id)
}

export function getRestaurants(): Restaurant[] {
  return restaurants
}

export function getRestaurant(id: string): Restaurant | undefined {
  return restaurantById.get(id)
}

/** Restaurants that have at least one menu item for this dish, with those items. */
export function whereToEat(dishId: string) {
  return restaurants
    .map((r) => ({ restaurant: r, items: r.menu.filter((m) => m.dishId === dishId) }))
    .filter((x) => x.items.length > 0)
}