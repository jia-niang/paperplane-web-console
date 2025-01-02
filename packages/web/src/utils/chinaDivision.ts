import provincesAndCities from 'china-division/dist/pc-code.json'
import { omit } from 'lodash-es'

export type IPosition = TypeofArray<typeof provincesAndCities>

export const provinces = provincesAndCities.map(province => omit(province, 'children'))

export { provincesAndCities }
