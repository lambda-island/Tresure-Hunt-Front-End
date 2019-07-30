import React from 'react'
// import Styled from 'styled-components'
import { useRef, useEffect } from 'react'


const Graph = props => {
    const ref = useRef()
    const { coordinates } = props;

    useEffect(() => {
        // console.log(coordinates)
        const canvas = ref.current
        canvas.width *=2
        canvas.height *=2
        const context = canvas.getContext('2d')
        const minX = 50
        const minY = 40
        const maxX = 80
        const maxY = 80


        const transX = (x, width) => {
        const newX = ((x-minX)/(maxX - minX))*width
        // console.log('newX', newX)
        return newX
        }

        const transY = (y, height) => {
            const newY = ((y-minY)/(maxY - minY))*height
            // console.log('newY', newY)
            return newY
        }

            // width: 300, height: 150

        for (let room in coordinates){
            console.log(coordinates[room]['x'])
            context.fillRect(transX(coordinates[room]['x'], canvas.width), transY(coordinates[room]['y'], canvas.height), 5, 5)
        }

        // context.lineTo(20, 20)
        // context.stroke()
    }, [coordinates])

    const clear = () => {
        const canvas = ref.current
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, canvas.width, canvas.height)
    }

    return (
        <>
            <canvas ref={ref}></canvas>
            <button onClick={() => clear()}>Test</button>  
        </>
    )

}


export default Graph 