import React from 'react'
import IconImage from './IconImage'

type Props = {
    iconUrl: string
    name: string
    isSelected?: boolean
}

const Preview: React.FC<Props> = ({ iconUrl, name, isSelected = false }) => {
    return (
        <>
            <div className={`preview ${isSelected ? 'preview--selected' : ''}`}>
                <div className="preview__picture">
                    <IconImage url={iconUrl} />
                </div>
                <div className="preview__info">
                    {name}
                </div>
            </div>
        </>
    )
}

export default Preview


