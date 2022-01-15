import React, { useRef, useState } from 'react';
import axios from 'axios';
import * as Chime from 'amazon-chime-sdk-js';
import MeetingScreen from './MeetingScreen';
import { Link } from 'react-router-dom'

function MeetingForm() {
  const [meetingResponse, setMeetingResponse] = useState()
  const [attendeeResponse, setAttendeeResponse] = useState()
  const videoElement = useRef()
  const audioElement = useRef()
  const [disable, setDisable] = useState(false)
  const [title, setTitle] = useState("")
  const [name, setName] = useState("")

  const handleStartMeeting = async () => {
      const response = await axios.get(`/createmetting/${title}/${name}`)
      .then(response => {
          setMeetingResponse(response.data.JoinInfo.Meeting)
          setAttendeeResponse(response.data.JoinInfo.Attendee)
          setDisable(true)
      })
  }

  return (
    <div className="w-100 p-3 text-center col-md-8 offset-md-2">

      <div className="w-25 col-md-8 offset-md-2">
        <div className="mt-5">
          <h1>Join a Meeting</h1>
        </div>
        <audio ref={audioElement}></audio>
      
        <div className="mt-5">
          <form>
            <div className="form-group">
              <label>Enter a title</label>
              <input type="text" className="form-control mt-3" placeholder="enter a title" onChange={(e) => {setTitle(e.target.value)}}></input>
              <small id="emailHelp" className="form-text text-muted mt-3">Anyone with this meeting title can join this meeting</small>
            </div>
            <div className="form-group mt-3">
              <label>Enter your Name</label>
              <input type="text" className="form-control mt-3" placeholder="enter your Name" onChange={(e) => {setName(e.target.value)}}></input>
            </div>
          </form>
        </div>

        <div className="row col-md-8 offset-md-2 mt-5">
          <button className="w-75 " onClick={handleStartMeeting} type="button">Start Meeting</button>
          <nav>
         <Link to="/meetings"><button disabled={!disable} className="w-50 col-md-8 offset-md-2 mt-3">Join</button></Link> 
         </nav>
        </div>
      </div>
    </div>
  )
};

export default MeetingForm;



