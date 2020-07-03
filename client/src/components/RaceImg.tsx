import React from 'react'

type Props = {
    race: "zerg" | "protoss" | "terran",
    width?: number
    height?: number
}

const RaceImage: React.FC<Props> = ({ race, width, height }) => {
    return (
        <img className="race-img" alt={race} src={`https://sc2iq.blob.core.windows.net/sc2icons/race_${race}.png`} width={width} height={height} />
    )
}

RaceImage.defaultProps = {
    width: 80,
    height: 80,
}

export default RaceImage