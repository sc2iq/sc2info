import fetch from 'isomorphic-fetch'

const unitQuery = `
query unit($id: String) {
  unit(id: $id) {
      id
      original {
          abilities {
            id
            command {
              id
              meta {
                name
                icon
              }
              misc {
                range
              }
              cost {
                energy
                cooldown
              }
              effect {
                radius
              }
            }
          }
          strengths {
            id
            name
          }
          weaknesses {
            id
            name
          }
          weapons {
            meta {
              name
              icon
            }
            misc {
              range
              speed
              targets
            }
            effect {
              max
              death
              radius
              bonus {
                damage
                max
                type
              }
            }
          }
          upgrades {
            id
            name
            levels {
              id
              index
              meta {
                index
                name
                icon
              }
              cost {
                minerals
                vespene
                time
              }
          } 
        }
      }
      meta {
          name
          icon
          race
      }
      life {
          start
          max
          regenRate
          delay
      }
      armor {
          start
          max
          regenRate
          delay
      }
      shieldArmor {
          start
          max
          regenRate
          delay
      }
      requires
      cost {
          minerals
          vespene
          time
          supply
      }
      movement {
          speed
          acceleration
          deceleration
          turnRate
      }
      score {
          build
          kill
      }
      misc {
          radius
          cargoSize
          footprint
          sightRadius
          supply
          speed
          targets
      }
      producer
      attributes
  }
}
`

const sc2infoApiUrl = "https://sc2info.azurewebsites.net/graphql"

export async function fetchUnitData(unitId: string): Promise<any> {
    const result = await fetch(sc2infoApiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: unitQuery,
            variables: { id: unitId }
        })
    })

    if (result.ok === false) {
        throw new Error(`Request for unit ${unitId} was not successful. ${result.status}:${result.statusText}`)
    }

    const json = await result.json()

    return json
}

const buildingQuery = `
query building($id: String) {
    building(id: $id) {
      id
      index
      meta {
        name
        icon
        race
        hotkey
        source
        index
        tooltip
      }
      life {
        start
        max
        regenRate
        delay
      }
      armor {
        start
        max
        regenRate
        delay
      }
      shieldArmor {
        start
        max
        regenRate
        delay
      }
      requires
      cost {
        minerals
        vespene
        time
        supply
      }
      movement {
        speed
        acceleration
        deceleration
        turnRate
      }
      score {
        build
        kill
      }
      misc {
        radius
        cargoSize
        footprint
        sightRadius
        supply
        speed
        targets
      }
      producer
      attributes
      weaknesses
      weapons
      abilities
      trains
      researches
    }
  }
`

export async function fetchBuildingData(buildingId: string): Promise<any> {
    const result = await fetch(sc2infoApiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: buildingQuery,
            variables: { id: buildingId }
        })
    })

    if (result.ok === false) {
        throw new Error(`Request for building ${buildingId} was not successful. ${result.status}:${result.statusText}`)
    }

    const json = await result.json()

    return json
}

const weaponsQuery = `
query weapon($id: String) {
  weapon(id: $id) {
    id
    index
    meta {
      name
      icon
      race
      hotkey
      source
      index
      tooltip
    }
    misc {
      range
      speed
      targets
    }
    effect {
      id
      index
      radius
      max
      death
      kind
      bonus {
        damage
        max
        type
      }
    }
  }
}
`

export async function fetchWeaponData(weaponId: string): Promise<any> {
    const result = await fetch(sc2infoApiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: weaponsQuery,
            variables: { id: weaponId }
        })
    })

    if (result.ok === false) {
        throw new Error(`Request for weapon ${weaponId} was not successful. ${result.status}:${result.statusText}`)
    }

    const json = await result.json()

    return json
}