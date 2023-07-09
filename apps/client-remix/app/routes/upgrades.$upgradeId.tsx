import { DataFunctionArgs } from "@remix-run/node"
import { NavLink, useLoaderData } from "@remix-run/react"
import UpgradeFull from "~/components/UpgradeFull"

export const loader = ({ params }: DataFunctionArgs) => {
  const upgradeId = params.upgradeId

  return {
    upgradeId
  }
}

export default function Unit() {
  const { upgradeId } = useLoaderData()

  return <>
    <h1>
      <NavLink to="/browse" >Browse</NavLink> &gt; <NavLink to="/upgrades" >Upgrades</NavLink> &gt; {upgradeId}
    </h1>

    <section>
      {/* <UpgradeFull upgrade={response.data.upgrade} /> */}
    </section>
  </>
}
