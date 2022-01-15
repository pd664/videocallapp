import React, { useRef, useState } from 'react'
import * as Chime from 'amazon-chime-sdk-js';

import axios from 'axios';

function MeetingScreen(props) {
    const videoElement = useRef()
    const videoElement1 = useRef()
    const videoElement2 = useRef() 
    const audioElement = useRef()
    const [disable, setDisable] = useState(false)
    const [meetingResponse, setMeetingResponse] = useState()
  const [attendeeResponse, setAttendeeResponse] = useState()
  const [title, setTitle] = useState("")
  const [name, setName] = useState("")

    const handleJoinMeeting = async () => {    
        const response = await axios.get(`/meeting`)
        
           let a = response.data.JoinInfo.Meeting
            let b = (response.data.JoinInfo.Attendee)
            setDisable(true)
        
        // console.log(meetingResponse, attendeeResponse)
        
        const logger = new Chime.ConsoleLogger('SDK', Chime.LogLevel.INFO);
        const deviceController = new Chime.DefaultDeviceController(logger);
        const configuration = new Chime.MeetingSessionConfiguration(a, b);
        const meetingSession = new Chime.DefaultMeetingSession(configuration, logger, deviceController);
            
        // console.log(await meetingSession.audioVideo.listAudioInputDevices())
        const firstInputAudioDeviceId = (await meetingSession.audioVideo.listAudioInputDevices())[0].deviceId;
        // console.log(firstInputAudioDeviceId)
        await meetingSession.audioVideo.chooseAudioInputDevice(firstInputAudioDeviceId);
  
        const firstOutputAudioDeviceId = (await meetingSession.audioVideo.listAudioOutputDevices())[0].deviceId;
        // console.log(firstOutputAudioDeviceId)
        await meetingSession.audioVideo.chooseAudioInputDevice(firstOutputAudioDeviceId);
        console.log("first")
        const firstVideoDeviceId = (await meetingSession.audioVideo.listVideoInputDevices())[0].deviceId;
        // console.log(firstVideoDeviceId)
        await meetingSession.audioVideo.chooseVideoInputDevice(firstVideoDeviceId);
  console.log("any")
        meetingSession.audioVideo.bindAudioElement(audioElement.current);
  console.log("second")
        const videoElements = [videoElement.current, videoElement1.current, videoElement2.current]
        const indexMap = {};
        const acquireVideoElement = tileId => {
          for(let i= 0; i < 25; i++) {
            if (indexMap[i] === tileId) {
              return videoElements[i];
            }
          }
  
          for (let i = 0; i < 25; i += 1) {
            if (!indexMap.hasOwnProperty(i)) {
              indexMap[i] = tileId;
              return videoElements[i];
            }
          }
          throw new Error('no video element is available');
        }
  console.log("third")
        const observer = {
          // audioVideoDidStart: () => {
          //   meetingSession.audioVideo.startLocalVideoTile()
          // },
          videoTileDidUpdate: tileState => {
            meetingSession.audioVideo.bindVideoElement(tileState.tileId, acquireVideoElement(tileState.tileId))
          }
        };
  
  
        const videoSources = meetingSession.audioVideo.getRemoteVideoSources()
        videoSources.forEach(videoSource => {
          const { attendee } = videoSource;
          console.log(`An attendee (${attendee.attendeeId} ${attendee.externalUserId}) is sending video`);
        
        });
          console.log(observer.videoTileDidUpdate)
        meetingSession.audioVideo.addObserver(observer);
        const audioVideo = meetingSession.audioVideo;
        audioVideo.addDeviceChangeObserver(this);
        meetingSession.audioVideo.startLocalVideoTile()
        console.log("meeting started")
        meetingSession.audioVideo.start();
    }

    return (
        <div>
            <audio ref={audioElement}></audio>
           <button  className="w-50 col-md-8 offset-md-2 mt-3" onClick={handleJoinMeeting} type='button'>Click to see Attendees</button>
            <div className="offset-md-2 mt-5">
          <video ref={videoElement1}></video>
          <video ref={videoElement}></video>
          <video ref={videoElement2}></video>
        </div>
        </div>
    )
}

export default MeetingScreen
