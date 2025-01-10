import { RouterProvider } from 'react-router'

import { browserRouter } from './routes'

export default function RouteEntry(): RC {
  return <RouterProvider router={browserRouter} />
}
