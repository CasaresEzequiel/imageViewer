import { Fragment, useState, useEffect } from "react";
import Modal from "react-modal"

function App() {

  Modal.setAppElement('body')

  const [file, setFile] = useState(null)
  const [imgList, setImageList] = useState([])
  const [listUpdated, setListUpdated] = useState(false)

  const [imagenActual, setImagenActual] = useState(null)

  const [modalStatus, setModalStatus] = useState(false)

  useEffect(() =>{
    fetch('http://localhost:9000/images/get')
    .then(res => res.json())
    .then(res => setImageList(res))
    .catch(err => {
      console.error(err)
    })
    setListUpdated(false)
  }, [listUpdated])

  const selectedHandler = e =>{
    setFile(e.target.files[0])
  }

  const sendHandler = () => {
    if(!file){
      alert('Se debe elegir un archivo para cargar')
      return
    }

    const formdata = new FormData()
    formdata.append('image', file)

    fetch('http://localhost:9000/images/post',{
      method:'POST',
      body: formdata
    })
    .then(res => res.text())
    .then(res => {
      console.log(res)
      setListUpdated(true)
    })
    .catch(err => {
      console.error(err)
    })

    document.getElementById('fileInput').value = null

    setFile(null)
  }

  const modalHandler = (isOpen, image)=>{
    setModalStatus(isOpen)
    setImagenActual(image)
  }

  const deleteHandler = () =>{
    
    let imgId = imagenActual.split('-')
    imgId = parseInt(imgId[0])

    fetch('http://localhost:9000/images/delete/' + imgId,{
      method:'DELETE',
    })
    .then(res => res.text())
    .then(res => console.log(res))

    setModalStatus(false)
    setListUpdated(true)
  }
  return (
    <Fragment>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <a href="#!" className="navbar-brand">Image app</a>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="card p-3">
          <div className="row">
            <div className="col-10">
              <input id="fileInput" onChange={selectedHandler}className="form-control" type="file" />
            </div>
            <div className="col-2">
              <button onClick={sendHandler} type="button" className="btn btn-primary col-12">Cargar</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-3" style={{display: "flex", flexWrap: "wrap"}}>
        {imgList.map(image => (
          <div key={image} className="card m-2">
            <img src={'http://localhost:9000/' + image} alt="..." className="card-img-top" style={{height:"160px", width:"260px" }}/>
            <div className="card-body">
              <button onClick={() => modalHandler(true, image)} className="btn btn-dark">Ver</button>
            </div>
          </div>
        ))}
      </div>

      <Modal style={{content: {right: "20%", left: "20%"}}}isOpen={modalStatus} onRequestClose={() => modalHandler(false, null)}>
        <div className="card">
          <img src={'http://localhost:9000/' + imagenActual} alt="..."/>
          <div className="card-body">
              <button onClick={()=> deleteHandler()} className="btn btn-danger">Eliminar</button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}

export default App;
