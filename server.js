const express = require('express')
const app = express()
const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');
const cors = require('cors');


app.use(cors())
AWS.config.credentials = new AWS.Credentials("AKIASPQC4ML3JGSD5NHI", "v4qCGJoUozdZL/HK2Y0JgnhCiT65j8b4RM8OOjDN");
const chime = new AWS.Chime({ region: 'us-east-1' });
chime.endpoint = new AWS.Endpoint('https://service.chime.aws.amazon.com/console');

const meetingCache = {}
const attendeeCache = {}
let a = []
let data
app.get('/createmetting/:title/:name',cors(), async (req, res) => {
  console.log("api called")
  const title = req.params.title;
  const name = req.params.name
  const response = {}

  try {
    if (!meetingCache[title]) {
        meetingCache[title] = await chime
          .createMeeting({
            ClientRequestToken: uuid(),
            MediaRegion: "us-west-2"
          })
          .promise();
        attendeeCache[title] = {};
        console.log("meeting also cretaed")
      }

    const joinInfo = {
      JoinInfo: {
        Title: title,
        Meeting: meetingCache[title].Meeting,
        Attendee: (
          await chime
            .createAttendee({
              MeetingId: meetingCache[title].Meeting.MeetingId,
              ExternalUserId: uuid()
            })
            .promise()
        ).Attendee,
        attendees: a
      }
    }

    console.log(joinInfo.JoinInfo.Meeting ,joinInfo.JoinInfo.Attendee)
    attendeeCache[title][joinInfo.JoinInfo.Attendee.AttendeeId] = name;
    data = joinInfo
    res.send(joinInfo)
}
    catch (err) {
        console.log(err)
    }
    
})

app.get('/meeting', (req, res) => {
  console.log(data)
  res.send(data)
})
const port = process.env.PORT || 4000
if(process.env.NODE_ENV === 'production') {
  app.use(express.static('videocallapp/build'))
}

app.listen(port, () => {console.log(`apps is listening on ${port}`)})

