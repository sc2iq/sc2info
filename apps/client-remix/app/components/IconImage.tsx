import React from "react"

type Props = {
    url: string
    width?: number
    height?: number
}

const IconImage: React.FC<Props> = (props) => {
    if (props.url.includes('undefined')) {
        return <div></div>
    }

    return (
        <object data={props.url} type="image/png" width={props.width} height={props.height} >
            <div style={{ width: props.width, height: props.height }}>Image Not Found</div>
        </object>
    )
}

IconImage.defaultProps = {
    width: 80,
    height: 80,
}

export default IconImage