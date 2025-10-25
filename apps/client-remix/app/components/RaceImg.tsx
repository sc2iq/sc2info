import { useOutletContext } from '@remix-run/react'
import React from 'react'
import type { loader as rootLoader } from "~/root"

type Props = {
    race: "zerg" | "protoss" | "terran",
    width?: number
    height?: number
}

const RaceImage: React.FC<Props> = ({ race, width, height }) => {
    const context = useOutletContext<Awaited<ReturnType<typeof rootLoader>>>()
    const iconUrl = `${context.iconsContainerUrl}/${race}.png`

    return (
        <img className="race-img" alt={race} src={iconUrl} width={width} height={height} />
    )
}

RaceImage.defaultProps = {
    width: 80,
    height: 80,
}

export default RaceImage
