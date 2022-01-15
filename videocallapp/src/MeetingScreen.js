import React, { useRef, useState } from 'react'
import * as Chime from 'amazon-chime-sdk-js';
import axios from 'axios';

function MeetingScreen () {
    const videoElement = useRef()
    const videoElement1 = useRef()
    const videoElement2 = useRef() 
    const videoElement3 = useRef()
    const videoElement4 = useRef()
    const videoElement5 = useRef()
    const videoElement6 = useRef()
    const audioElement = useRef()
  
    const handleJoinMeeting = async () => {    
      const response = await axios.get(`/meeting`)
        
      let a = response.data.JoinInfo.Meeting
       let b = (response.data.JoinInfo.Attendee)
        
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
        
        const firstVideoDeviceId = (await meetingSession.audioVideo.listVideoInputDevices())[0].deviceId;
        // console.log(firstVideoDeviceId)
        await meetingSession.audioVideo.chooseVideoInputDevice(firstVideoDeviceId);
  
        meetingSession.audioVideo.bindAudioElement(audioElement.current);
  
        const videoElements = [videoElement.current, videoElement1.current, videoElement2.current, videoElement3.current, videoElement4.current, videoElement5.current, videoElement6.current,]
        const indexMap = {};
        const acquireVideoElement = tileId => {
          for(let i= 0; i < 6; i++) {
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
              <div className="row-gy-4 d-flex flex-wrap contain"style={{height: "100px"}}>
            <video ref={videoElement}></video>
          <video ref={videoElement1} ></video>
          <video ref={videoElement2}></video>
          <video ref={videoElement3}></video>
          <video ref={videoElement4}></video>
          <video ref={videoElement5}></video>
          <video ref={videoElement6}></video>
          </div>
        </div>
        </div>
    )
}

export default MeetingScreen
