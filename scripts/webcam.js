

/* request permission to access the media stream */

function webcamAccessAndStream() {
  step1.classList.add('newStep');
  slide1.classList.add('none');
  slide2.classList.remove('none');


  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
  })
    .then(stream => {
      video.srcObject = stream;
      video.play();
      pushOldIds()

      comenzar.classList.add('none');

      step1.classList.remove('newStep');
      step2.classList.add('newStep');
      slide2.classList.add('none');
      previewAndVideoBox.classList.remove('none');
      slideWithInstructions.classList.add('none');
      btnRec.classList.remove('none'); 
      
      recorder = new RecordRTCPromisesHandler(stream, {
        type: 'gif',
        mimeType: 'video/webm',
        recorderType: GifRecorder,
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
      
      });
    })
}
//upload gipho endpoint

const uploadToGiphy = async (fileGif) => {
  try {
    let response = await fetch(urlEndpointUpload, {
      method: 'POST',
      body: fileGif,
    });

    console.log(response.status);

    let newGif = response.json();

    newGif.then(newGif => { 
      
      console.log(gifCreatedIds)
      
      

      let idGiphoUploaded = newGif.data.id;

      console.log(idGiphoUploaded);        
      
      gifCreatedIds.push(idGiphoUploaded);


      
      localStorage.setItem('MyGifosIds', JSON.stringify(gifCreatedIds));
      
      overlayBoxPending.classList.add('none');
      overlayBoxOk.classList.remove('none');

    })

  } catch (err) {
    console.log(err)
  }
}

comenzar.addEventListener('click', webcamAccessAndStream);

uploadGiphoButton.addEventListener('click', postGipho => {
  uploadingGifOverlay.classList.remove('none');
  overlayBoxPending.classList.remove('none');
  uploadToGiphy(fileToUpload)
})

btnRec.addEventListener('click', rec => {
  recorder.startRecording()
  btnRec.classList.add('none')
  btnStop.classList.remove('none');
})

btnStop.addEventListener('click', stop => {
  recorder.stopRecording();
  let blobUrl = recorder.getBlob();
  blobUrl.then(blob => {
    let urlGiphoForUpload = URL.createObjectURL(blob)
    fileToUpload = new FormData();
    fileToUpload.append('file', blob, "myGif.gif");
    console.log(fileToUpload.get('file'));
    btnStop.classList.add('none');
    video.classList.add('none');
    uploadGiphoButton.classList.remove('none');
    uploadGipho.classList.remove('none');
    uploadGipho.src = urlGiphoForUpload;
  })
})


recordAgain.addEventListener('click', recordAgain => {
  recorder.reset();
  uploadGiphoButton.classList.add('none');
  btnRec.classList.remove('none');
  uploadGipho.classList.add('none');
  video.classList.remove('none');
  uploadingGifOverlay.classList.add('none');

})



