import React from 'react'
import './special.css'
import videoo from '../assets/load.mp4'
import {useNavigate} from 'react-router-dom'

export const Load = () => {
  const navigate = useNavigate()

  setTimeout(() => {
    navigate('/gameroom')
  }, 8000);
  
  return (
    <div id="matchmaking">
      <h1>Wacha<span>macalitt</span></h1>
      <video src={videoo} autoPlay loop muted></video>
      <h1>Waiting for the Opponent...</h1>
    </div>
    )
}
