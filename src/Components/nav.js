
import React from 'react'
import Styled from 'styled-components'

const NavigationContainer = Styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    p {
        margin: 0 0 10px 0;
    }
`

const ButtonsContainer = Styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
`

const NavButton = Styled.button`
    display: flex;
    border: 1px solid white;
    background: white;
    transition: .2s;
    cursor: pointer;
    margin: 0 5px 5px 0;
    padding: 2px 5px;
    :hover {
        background: none;
        border: 1px solid black;
        transition: .2s;
    }
`

const Nav = props => {

    const { exits, movement } = props

    return (
        <NavigationContainer>
            <p>Available Moves:</p>
        <ButtonsContainer>
            {exits.map(exit => (
            <NavButton 
            onClick={() => movement({ exit })} 
            key={exit}
            >
                {exit}
            </NavButton>
            ))}
        </ButtonsContainer>
        </NavigationContainer>
    )
}

export default Nav