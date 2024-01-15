import { useRef } from 'react';
import { useEffect, useState } from 'react';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

const getRandom = (num) => Math.floor(Math.random() * num);

const formInit = { topText: '', bottomText: '' };

function App() {
  const [memes, setMemes] = useState([]);
  const [memeIndex, setMemeIndex] = useState(0);
  const [currentMeme, setCurrentMeme] = useState(null);
  const [form, setForm] = useState(formInit);
  const [file, setFile] = useState(null);
  const [imgURL, setImgURL] = useState(null);
  const imageRef = useRef(null);

  const loadNewMemes = async () => {
    try {
      const res = await fetch('https://api.imgflip.com/get_memes');
      const data = await res.json();
      if (data.success) {
        // console.log(data.data.memes);
        setMemes(data.data.memes);

        const randomIndex = getRandom(data.data.memes.length);
        setMemeIndex(randomIndex);
        setCurrentMeme(data.data.memes[randomIndex]);
        setForm(formInit);
      } else throw new Error('Something went wrong');
    } catch (err) {
      console.log(err);
    }
  };
  // console.log(currentMeme);

  const setStates = (ind) => {
    setMemeIndex(ind);
    setCurrentMeme(memes[ind]);
    setForm(formInit);
    setFile(null);
    setImgURL(null);
  };

  const handlePrev = () => {
    const prevInd = memeIndex === 0 ? memes.length - 1 : memeIndex - 1;
    setStates(prevInd);
  };

  const handleRandom = () => {
    const randomIndex = getRandom(memes.length);
    setStates(randomIndex);
  };

  const handleNext = () => {
    const nextInd = memeIndex === memes.length - 1 ? 0 : memeIndex + 1;
    setStates(nextInd);
  };

  const handleFile = (e) => {
    console.log(e.target.files);
    setFile(e.target.files[0]);
    const newImgURL = URL.createObjectURL(e.target.files[0]);
    setImgURL(newImgURL);
  };

  const handleDownload = () => {
    domtoimage.toBlob(imageRef.current).then((blob) => {
      saveAs(blob, `${form.topText}-${form.bottomText}.png`);
    });
  };

  useEffect(() => {
    loadNewMemes();
  }, []);

  return (
    <>
      <h1 className='mb-10'>meme generator</h1>

      {/* Meme */}
      {currentMeme && (
        <div className='grid grid-cols-2 gap-5'>
          <div>
            <div
              ref={imageRef}
              className=' relative overflow-hidden break-words'
              style={{
                aspectRatio: imgURL
                  ? 'auto'
                  : `${currentMeme.width}/${currentMeme.height}`,
              }}>
              {imgURL ? (
                <img className='block w-full' src={imgURL} alt={file.name} />
              ) : (
                <img
                  className='block w-full'
                  src={currentMeme.url}
                  alt={currentMeme.name}
                />
              )}
              {/* <img src={currentMeme.url} alt={currentMeme.name} /> */}
              <p
                className='absolute top-2 left-1/2 -translate-x-1/2 text-3xl max-w-full'
                style={{
                  textShadow:
                    '1.25px 1.25px 0 black, -1.25px 1.25px 0 black, -1.25px -1.25px 0 black, 1.25px -1.25px 0 black',
                }}>
                {form.topText}
              </p>
              <p
                className='absolute bottom-2 left-1/2 -translate-x-1/2 text-3xl max-w-full'
                style={{
                  textShadow:
                    '1.25px 1.25px 0 black, -1.25px 1.25px 0 black, -1.25px -1.25px 0 black, 1.25px -1.25px 0 black',
                }}>
                {form.bottomText}
              </p>
            </div>
            <div className='flex mx-auto justify-center mt-2'>
              {imgURL ? (
                <button type='button' onClick={handleRandom}>
                  Reset
                </button>
              ) : (
                <>
                  <button type='button' onClick={handlePrev}>
                    &larr;
                  </button>
                  <button type='button' onClick={handleRandom}>
                    Random
                  </button>
                  <button type='button' onClick={handleNext}>
                    &rarr;
                  </button>
                </>
              )}
            </div>
          </div>
          <form className='flex flex-col items-end gap-4'>
            <label>
              Top Text
              <input
                className='ml-2'
                type='text'
                value={form.topText}
                onChange={(e) =>
                  setForm((prev) => {
                    return { ...prev, topText: e.target.value };
                  })
                }
              />
            </label>
            <label>
              Bottom Text
              <input
                className='ml-2'
                type='text'
                value={form.bottomText}
                onChange={(e) =>
                  setForm((prev) => {
                    return { ...prev, bottomText: e.target.value };
                  })
                }
              />
            </label>
            <label>
              <span className='sr-only'>Your Image</span>
              <input type='file' onChange={(e) => handleFile(e)} />
            </label>
            {imgURL && (
              <button type='button' onClick={handleDownload}>
                Download
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
}

export default App;
