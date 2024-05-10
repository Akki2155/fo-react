import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {PRODAPIHOST as APIHOST, LOCALAPIHOSY} from './constant'

function App() {

  const [statusMessgae, setStatusMessage] = useState('Message')
  const [status, setStatus] = useState(false)
  const [clicked, setClicked] = useState('')
  const [isLoader, setIsLoader] = useState(false)
  const [isRefresh, setIsRefresh] = useState(false)

  useEffect(() => {
      setIsLoader(prevIsLoader => !prevIsLoader);
      axios.get(`${APIHOST}/get_status`).then(res => {
        if(res.data.status){
          setStatusMessage('Process is Running')
        }else{
          setStatusMessage('Process is not Running')
        }
        setIsLoader(prevIsLoader => !prevIsLoader);
        setStatus(res.data.status);
      }).catch(err => {
          console.error(err);
          setStatusMessage(err.response.data.status)
          setIsLoader(prevIsLoader => !prevIsLoader);
          setIsRefresh(true);
      });
  }, [])
  
  useEffect(() => {

    switch(clicked){
      case 'start':
      case 'stop':

        const payload = new URLSearchParams();
        payload.append('status', clicked === 'start');
        setIsLoader(prevIsLoader => !prevIsLoader);
        axios.post(`${APIHOST}/update_status`, payload)
        .then(res => {
          setStatusMessage(res.data.status)
          if(res.data.status === 'Process started.'){
            setStatus(true)
          }else if(res.data.status === 'Process stopped.'){
            setStatus(false)
          }
          setIsLoader(prevIsLoader => !prevIsLoader);
          return res.data
        })
        .catch(err => {
          console.error(err);
          setStatusMessage(err.response.data.status)
          setIsLoader(prevIsLoader => !prevIsLoader);
          setIsRefresh(true);
        });
        break;

      case 'dataUpdate':  

        setIsLoader(prevIsLoader => !prevIsLoader);
        axios.post(`${APIHOST}/update_previous_sheet`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        })
        .then(res => {
          setStatusMessage(res.data.status)
          setIsLoader(prevIsLoader => !prevIsLoader);
          return res.data
        }).catch(err => {
          console.error(err);
          setStatusMessage(err.response.data.status)
          setIsLoader(prevIsLoader => !prevIsLoader);
          setIsRefresh(true);
        });
        break;

      case 'clearHistory':
        setIsLoader(prevIsLoader => !prevIsLoader);
        axios.post(`${APIHOST}/clear_history_log`).then(res => {
            setStatusMessage(res.data.status)
            setIsLoader(prevIsLoader => !prevIsLoader);
            setIsRefresh(true);
          }).catch(err => {
            setStatusMessage(err.response.data.status)
            setIsLoader(prevIsLoader => !prevIsLoader);
            setIsRefresh(true);
          })
        break

      default:
        console.log('default');
        break;  
    }
  },[clicked])


  const btnClick = (e) => {
    setClicked(e.target.name)
  }

  const refreshScreen = () => {
    window.location.reload();
  }


  return (
    <div className="app">
      {
        isLoader ? <div className='loaderContainer'>
                      <div className='loader'></div>
                  </div> 
                  :
        <>
          <div className='headingContainer'>
            <h1>Future And Options Filter</h1>
            <h1>Process</h1>
          </div>
          {
            isRefresh ? <div className='refeshBtnContainer'>
                <button className='btn refreshBtn' onClick={refreshScreen}>Refresh Screen</button>
            </div> :
            <>
              <div className='btnContainer'>
                <div className='btnWrapper'>
                  <button className='btn' name='start' disabled={status} onClick={btnClick}>Start Process</button>
                  <button className='btn' name='stop' disabled={!status} onClick={btnClick}>Stop Process</button>
                </div>
                <div className='btnWrapper'>
                  <button className='btn' name='dataUpdate' onClick={btnClick}>Update R1 and S1 Data</button>
                  <button className='btn' name='clearHistory' onClick={btnClick}>Clear history log</button>
                </div>
              </div>
            </>
          }
          <div className='statusContainer'>
              <p>{statusMessgae}</p>
          </div>
        </>
      }
    </div>
  );
}

export default App;
