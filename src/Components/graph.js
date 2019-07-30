import React from 'react'
// import Styled from 'styled-components'
import { useRef, useEffect } from 'react'


const Graph = props => {
    const ref = useRef()
    const { coordinates, neighbors  } = props;

    useEffect(() => {
        // console.log(coordinates)
        const canvas = ref.current
        canvas.width = 900
        canvas.height = 600
        const context = canvas.getContext('2d')
        const minX = 50
        const minY = 40
        const maxX = 80
        const maxY = 80


        const transX = (x, width) => {
            const newX = ((x-minX) * (canvas.width / (maxX - minX)))
            return newX
        }

        const transY = (y, height) => {
            const newY = ((maxY-y) * (canvas.height / (maxY - minY)))
            return newY
        }

            // width: 300, height: 150

        for (let room in coordinates){
            // console.log(coordinates[room]['x'])
            context.fillRect(transX(coordinates[room]['x']), transY(coordinates[room]['y']), 5, 5)

            if (neighbors[room]['n']){
                let direction = neighbors[room]['n']
                context.beginPath()
                context.moveTo(transX(coordinates[room]['x']) + 2.5, transY(coordinates[room]['y']))
                context.lineTo(transX(coordinates[direction]['x']) + 2.5, transY(coordinates[direction]['y']) + 5)
                context.stroke()  
            }
            if (neighbors[room]['s']){
                let direction = neighbors[room]['s']
                context.beginPath()
                context.moveTo(transX(coordinates[room]['x']) + 2.5, transY(coordinates[room]['y']) + 5)
                context.lineTo(transX(coordinates[direction]['x']) + 2.5, transY(coordinates[direction]['y']) + 5)
                context.stroke()  
            }
            if (neighbors[room]['e']){
                let direction = neighbors[room]['e']
                context.beginPath()
                context.moveTo(transX(coordinates[room]['x']) + 5, transY(coordinates[room]['y']) + 2.5)
                context.lineTo(transX(coordinates[direction]['x']), transY(coordinates[direction]['y']) + 2.5)
                context.stroke()  
            }
            if (neighbors[room]['w']){
                let direction = neighbors[room]['w']
                context.beginPath()
                context.moveTo(transX(coordinates[room]['x']), transY(coordinates[room]['y']) + 2.5)
                context.lineTo(transX(coordinates[direction]['x']) + 5, transY(coordinates[direction]['y']) + 2.5)
                context.stroke()  
            }
        }

        // context.lineTo(20, 20)
        // context.stroke()
    }, [coordinates])


    return (
        <>
            <canvas ref={ref}></canvas>
        </>
    )

}


export default Graph 