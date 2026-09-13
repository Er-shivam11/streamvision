import React, { useState } from 'react';
// import './App.css';



function Sam() {
  const [image, setImage] = useState(null);
  const [clarity, setClarity] = useState('');
  const [resolution, setResolution] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [aspectRatio, setAspectRatio] = useState('');
  const [format, setFormat] = useState('');
  const [count1, setCount1] = useState(70); // Counter initialized at 70
  // const [count2, setCount2] = useState(70); // Counter initialized at 70

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        setResolution(`${width} x ${height}`);
        const ratio = (width / height).toFixed(2);
        setAspectRatio(ratio);
        setFileSize((file.size / 1024).toFixed(2) + ' KB');
        const clarityScore = calculateClarityScore(width, height);
        setClarity(clarityScore);
        setFormat(file.type);
      };
      setImage(img);
    }
  };

  const calculateClarityScore = (width, height) => {
    const totalPixels = width * height;
    if (totalPixels > 2000000) return 'High Clarity';
    if (totalPixels > 1000000) return 'Medium Clarity';
    return 'Low Clarity';
  };

  return (
    <div className="layout">
      {/* Left Section */}
      <div className="left-section">
        <label className="label">
          Choose File
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>
        {image && (
          <img
            src={image.src}
            alt="Uploaded"
            style={{ maxWidth: '300px', marginTop: '20px' }}
          />
        )}

        {/* Counter Example */}
        <div className="w-full h-screen bg-zinc-900 text-white p-5 flex flex-col items-center justify-center">
        <h1>{count1}</h1>
          <div className="flex space-x-2"> {/* Use space-x-2 to add equal spacing between buttons */}
            <button 
              onClick={() => setCount1(count1 - 1)} 
              className="px-3 py-1 bg-green-500 rounded">
              Decrement
            </button>
            <button 
              onClick={() => setCount1(count1 + 1)} 
              className="px-3 py-1 bg-green-500 rounded">
              Increment
            </button>
          </div>
        </div>

        
      </div>

      {/* Right Section: Results Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Resolution</td>
              <td>{resolution}</td>
            </tr>
            <tr>
              <td>Clarity</td>
              <td>{clarity}</td>
            </tr>
            <tr>
              <td>File Size</td>
              <td>{fileSize}</td>
            </tr>
            <tr>
              <td>Aspect Ratio</td>
              <td>{aspectRatio}</td>
            </tr>
            <tr>
              <td>Format</td>
              <td>{format}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Sam;
