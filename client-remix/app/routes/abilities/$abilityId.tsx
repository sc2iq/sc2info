import { DataFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

export const loader = ({ params }: DataFunctionArgs) => {
  const abilityId = params.abilityId

  return {
    abilityId
  }
}

export default function Ability() {
  const { abilityId } = useLoaderData()

  return <>
    <h1>Ability: {abilityId}</h1>
  </>
}
