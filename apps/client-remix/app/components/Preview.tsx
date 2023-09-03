import React from 'react'
import IconImage from './IconImage'

type Props = {
    iconUrl: string
    name: string
}

const Preview: React.FC<Props> = ({ iconUrl, name }) => {
    return (
        <>
            <div className="preview">
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


