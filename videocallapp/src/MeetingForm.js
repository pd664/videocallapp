import React, { useRef, useState } from 'react';
import axios from 'axios';
import * as Chime from 'amazon-chime-sdk-js';

function MeetingForm() {
  const [meetingResponse, setMeetingResponse] = useState()
  const [attendeeResponse, setAttendeeResponse] = useState()
  const videoElement = useRef()
  const audioElement = useRef()
  const [disable, setDisable] = useState(false)
  const [title, setTitle] = useState("")
  const [name, setName] = useState("")
  const attendeeVideo = useRef()

  const handleStartMeeting = async () => {
      const response = await axios.get(`http://localhost:4000/createmetting/${title}/${name}`)
      .then(response => {
          setMeetingResponse(response.data.JoinInfo.Meeting)
          setAttendeeResponse(response.data.JoinInfo.Attendee)
          setDisable(true)
      })
  }

  const handleJoinMeeting = async () => {      
      console.log(meetingResponse, attendeeResponse)
      
      const logger = new Chime.ConsoleLogger('SDK', Chime.LogLevel.INFO);
      const deviceController = new Chime.DefaultDeviceController(logger);
      const configuration = new Chime.MeetingSessionConfiguration(meetingResponse, attendeeResponse);
      const meetingSession = new Chime.DefaultMeetingSession(configuration, logger, deviceController);
          
      // console.log(await meetingSession.audioVideo.listAudioInputDevices())
      const firstInputAudioDeviceId = (await meetingSession.audioVideo.listAudioInputDevices())[0].deviceId;
      // console.log(firstInputAudioDeviceId)
      await meetingSession.audioVideo.chooseAudioInputDevice(firstInputAudioDeviceId);

      const firstOutputAudioDeviceId = (await meetingSession.audioVideo.listAudioOutputDevices())[0].deviceId;
      // console.log(firstOutputAudioDeviceId)
      await meetingSession.audioVideo.chooseAudioInputDevice(firstOutputAudioDeviceId);
      
      const firstVideoDeviceId = (await meetingSession.audioVideo.listVideoInputDevices())[0].deviceId;
      // console.log(firstVideoDeviceId)
      await meetingSession.audioVideo.chooseVideoInputDevice(firstVideoDeviceId);

      meetingSession.audioVideo.bindAudioElement(audioElement.current);

      const observer = {
        audioVideoDidStart: () => {
          meetingSession.audioVideo.startLocalVideoTile()
        },
        videoTileDidUpdate: tileState => {
          meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement.current);
        }
      };
        console.log(observer.videoTileDidUpdate)
      meetingSession.audioVideo.addObserver(observer);
      const audioVideo = meetingSession.audioVideo;
      audioVideo.addDeviceChangeObserver(this);
      meetingSession.audioVideo.startLocalVideoTile()
      console.log("meeting started")
      meetingSession.audioVideo.start();
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
          <button disabled={!disable} className="w-50 col-md-8 offset-md-2 mt-3" onClick={handleJoinMeeting} type='button'>Join</button>
        </div>
        <div className="offset-md-2 mt-5">
          <video ref={attendeeVideo}></video>
          <video ref={videoElement}></video>
        </div>
      </div>
    </div>
  )
};

export default MeetingForm;



