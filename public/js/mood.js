const video = document.getElementById('video');


//** FACE API START*/
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo);

function startVideo() {
    navigator.mediaDevices.getUserMedia(
        {
            video: {
                width: 720,
                height: 560
            }
        },
        // stream => video.srcObject = stream,
        // err => console.error(err)
    ).then(stream => {
        video.srcObject = stream;
    });
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)

    // variable to contain mood for spotifi api
    var musicMood = "";
    // timer - set for 2secs
    var startTime = new Date().getTime();
    var interval =
        setInterval(async () => {

            // current time minus startTime; if over 2secs, stop interval
            if (new Date().getTime() - startTime > 2500) {
                clearInterval(interval);
                return;
            }

            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
            // capture moods
            var userMoods = detections[0].expressions;
            console.log(userMoods);

            // variable for each mood
            var angryMoodRtg = userMoods.angry;
            var disgustMoodRtg = userMoods.disgusted;
            var fearMoodRtg = userMoods.fearful;
            var happyMoodRtg = userMoods.happy;
            var neutralMoodRtg = userMoods.neutral;
            var sadMoodRtg = userMoods.sad;
            var surpriseMoodRtg = userMoods.surprised;

            // empty moods array
            var moodsArr = [];
            moodsArr.push(angryMoodRtg);
            moodsArr.push(disgustMoodRtg);
            moodsArr.push(fearMoodRtg);
            moodsArr.push(happyMoodRtg);
            moodsArr.push(neutralMoodRtg);
            moodsArr.push(sadMoodRtg);
            moodsArr.push(surpriseMoodRtg);
            // console.log(moodsArr);

            // code to get winning mood
            const goal = 1;
            const winningMood = moodsArr.reduce((a, b) => {
                return Math.abs(b - goal) < Math.abs(a - goal) ? b : a;
            });

            if (winningMood === angryMoodRtg) {
                musicMood = "angry"
            }
            // else if(winningMood === disgustMood){
            //  musicMood = "disgust" 
            // }
            // else if (winningMood === fearMood) {
            //   musicMood = "fear"
            // }
            else if (winningMood === happyMoodRtg) {
                musicMood = "happy"
            }
            else if (winningMood === neutralMoodRtg) {
                musicMood = "neutral"
            }
            else if (winningMood === sadMoodRtg) {
                musicMood = "sad"
            }
            else if (winningMood === surpriseMoodRtg) {
                musicMood = "surprised"
            }
            console.log("WINNER WINNER CHICKEN DINNER - " + musicMood);

            // save to local storage
            // localStorage.setItem("mood", musicMood);

            $.post("/api/mood", {
                userId: localStorage.getItem("userId"),
                mood: musicMood
            })
                .then(function (data) {
                    console.log(data);
                })
                .catch(function (err) {
                    console.log(err);
                });

            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        }, 250)
});
//**  FACE API END*/
