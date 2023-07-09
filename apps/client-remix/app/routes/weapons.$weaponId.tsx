import { DataFunctionArgs } from "@remix-run/node"
import { NavLink, useLoaderData } from "@remix-run/react"
import WeaponFull from "~/components/WeaponFull"

export const loader = ({ params }: DataFunctionArgs) => {
  const weaponId = params.weaponId

  return {
    weaponId
  }
}

export default function Unit() {
  const { weaponId } = useLoaderData()

  return <>
    <h1>
      <NavLink to="/browse" >Browse</NavLink> &gt; <NavLink to="/weapons" >Weapons</NavLink> &gt; {weaponId}
    </h1>

    <section>
      {/* <WeaponFull upgrade={response.data.upgrade} /> */}
    </section>
  </>
}
