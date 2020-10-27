// https://stackoverflow.com/questions/62429754/how-to-upload-a-file-to-s3-bucket-with-axios-using-react-and-a-presigned-using-a
// https://medium.com/@diego.f.rodriguezh/direct-image-upload-to-aws-s3-with-react-and-express-2f063bc15430

// https://sanderknape.com/2017/08/using-pre-signed-urls-upload-file-private-s3-bucket/
// This^^

import React, { useState } from 'react'
import ImageUploader from 'react-images-upload'
import Axios from 'axios'

import './App.css'

const UploadComponent = (props) => (
  <form>
    <label>
      File Upload URL:
      <input
        id="urlInput"
        type="text"
        onChange={props.onUrlChange}
        value={props.url}
      ></input>
    </label>
    <ImageUploader
      key="image-uploader"
      withIcon={true}
      singleImage={true}
      withPreview={true}
      label="Max file size:30MB"
      buttonText="Choose an image"
      onChange={props.onImage}
      imgExtension={['.jpg', '.png', 'jpeg']}
      maxFileSize={31457280}
    ></ImageUploader>
  </form>
)

function App() {
  const [progress, setProgress] = useState('getUpload')
  const [url, setImageUrl] = useState('')
  const { errorMessage, setErrorMessage } = useState('')
  console.log('The progress is: ', progress)

  const onUrlChange = (e) => {
    setImageUrl(e.target.value)
  }
  const onImage = async (failedImages, successImages) => {
    if (!url) {
      console.log('missing url')
      setErrorMessage('Missing url to upload')
      setProgress('uploadError')
      return
    }

    setProgress('uploading')

    try {
      console.log('Success Images:', successImages)
      const imageParts = successImages[0].split(';')
      const mime = imageParts[0].split(':')[1]
      const name = imageParts[1].split('=')[1]
      const data = imageParts[2]
      const res = await Axios.post(url, { mime, name, image: data })

      setImageUrl(res.data.imageUrl)
      setProgress('uploaded')
    } catch (error) {
      console.log('Error upload:', error)
      setErrorMessage(error.message)
      setProgress('uploadError')
    }
  }
  const content = () => {
    switch (progress) {
      case 'uploading':
        return <h2>Loading...</h2>
      case 'uploaded':
        return <img src={url} alt="Uploaded" />
      case 'uploadError':
        return (
          <>
            <div>Err Message = {errorMessage}</div>
            <div>Please upload an image</div>
          </>
        )
      default:
        return (
          <>
            <UploadComponent
              onUrlChange={onUrlChange}
              onImage={onImage}
              url={url}
            />
          </>
        )
    }
  }

  return (
    <div className="App">
      <h1>Image Upload</h1>
      {content()}
    </div>
  )
}

export default App
