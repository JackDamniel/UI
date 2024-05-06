import { createLazyFileRoute } from '@tanstack/react-router'
import Picture from '../Assets/picture'

export const Route = createLazyFileRoute('/')({
  component: Home,
})

export function Home() {
  return (
      <div className="container my-5">
          <h2 className="text-center mb-3">Welcome To The Place Of Miracles</h2>
          <div className="text-center">
              <Picture />
          </div>
      </div>
  )
}