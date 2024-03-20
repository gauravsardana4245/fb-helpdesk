import React, { useState, useEffect, useRef} from 'react';
import { Link, useLocation} from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FacebookConnection.css'
import { BeatLoader, PulseLoader } from 'react-spinners';

const FacebookConnection = () => {
  const override = {
    display: "block",
    margin: "0 auto",
  };
  const linkRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectedPages, setConnectedPages] = useState([]);
  const [notConnectedPages, setNotConnectedPages] = useState([]);
  const [selectedPageIds, setSelectedPageIds] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [action, setAction] = useState("Action");
  const backendHost = "https://fb-helpdesk-richpanel.onrender.com";
  // const backendHost = "http://localhost:5000"


  useEffect(() => {
    if(!localStorage.getItem("token") || location.state==null) {
      navigate('/login');
    }
  },[])
  const [userAccessToken, setUserAccessToken] = useState("")
  const [userFacebookId, setUserFacebookId] = useState("")

  useEffect(() => {
    console.log('location.state:', location.state);
    if (location.state) {
      setUserAccessToken(location.state.userAccessToken);
      setUserFacebookId(location.state.userFacebookId);
      console.log('userAccessToken: ', userAccessToken);
      console.log('userFacebookId: ', userFacebookId);
    }
  }, [location.state]);

  useEffect(() => {
    setLoading(true);
    setAction("Fetching Pages");
    const fetchPages = async () => {
      try {
        const response = await axios.get(
          `https://graph.facebook.com/v10.0/me/accounts?access_token=${userAccessToken}`
        );
        setPages(response.data.data);
        console.log("pages12345: ", response.data.data);
        fetchConnectedPages();
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pages:', error);
        setLoading(false);
      }
    };

    fetchPages();
  }, [userAccessToken]);

  useEffect(() => {
    setLoading(true);
    setAction("Fetching Pages");
    const notConnectedPagesList = pages.filter((page) => !connectedPages.some((connectedPage) => connectedPage.pageId === page.id));
    setNotConnectedPages(notConnectedPagesList);
    console.log("notConnectedPages: ", notConnectedPages);
    console.log("connectedPages: ", connectedPages);
    setLoading(false);
  }, [pages, connectedPages]);

  const fetchConnectedPages = async () => {
    try {
      const response = await fetch(`${backendHost}/api/facebook/get-connected-pages?userFacebookId=${userFacebookId}`,
      {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      });
      const data = await response.json();
      console.log("data1234: ",  data);
      setConnectedPages(data);
    } catch (error) {
      console.error('Error fetching connected pages:', error);
    }
  };

  useEffect(()=> {
    setLoading(true);
    setAction("Fetching Pages");
    fetchConnectedPages();
    setLoading(false);
  },[])

  useEffect(()=> {
    console.log("selectedPages: ", selectedPages)
    console.log("selectedPageIds: ", selectedPageIds)
  },[selectedPages]);


  const handlePageConnect = async (page) => {
    try {
      console.log("page to be connected: ", page);
    const res = await fetch(`${backendHost}/api/facebook/connect-page`, 
      { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
        },

        body: JSON.stringify({
          page : page,
        })
      }
    );
    const data = await res.json();
    console.log("data: ", data);

    if(data.success==false) {
      alert("Could not connect the page right now. Please try again after some time!");
      return;
    }
    else {
      alert("Page Connected Succesfully!");
    }

    setLoading(false);
    fetchConnectedPages();
    }
    catch (error) {
      console.log(error);
    }
}

const disconnectPage = async (pageId)=> {
  console.log("pageId123: ", pageId);
  try {
    const res = await fetch(`${backendHost}/api/facebook/disconnect-page`, 
      { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
        },

        body: JSON.stringify({
          pageId : pageId,
        })
      }
    );
    const data = await res.json();
    setLoading(false);
    fetchConnectedPages();
    setConnectedPages((prev) => prev.filter((connectedPage) => connectedPage.id !== pageId));
    alert("Page Disconnected Succesfully!");
    }
    catch (error) {
      console.log(error);
      alert("Could not disconnect the page right now. Please try again after some time!");
    }
}

const navigateToConversations = (page)=> {
  console.log("accessToken: ", page.accessToken)

  navigate("/main", {state: {page: page, userFacebookId:userFacebookId}})
}

  return (
    <div className={`my-component ${loading ? 'loading' : ''}`}>
    <div className={`facebookConnectionScreen container mt-5 content`}>

    {loading && (
        <div className="loading-overlay">
         <div className='actionText'> {action} </div>
          {/* <div className="circular-loader"></div> */}
          
        <BeatLoader color="#004e96" />
        </div>
      )}
    
      <div className='availablePagesDiv'>
        <div className='headDiv'>Available Pages </div>
      <div className='availablePages'>
        {notConnectedPages.length===0 && <div> No Page Available for Selection </div>}
          {notConnectedPages.map((page) => (
            <div className='pageBox' key={page.id}>
              <div>Page: <span className='pageName'>{page.name} </span></div>
               <div className='btn navigate-btn' onClick={()=> {
                setAction("Connecting Page")
                setLoading(true);
                setTimeout(()=> {
                  handlePageConnect(page)
                },2000);
              }
            }
              >
              Connect Page
        
               </div>
            </div>
          ))}
      </div>
      </div>

      <div className='connectedPagesDiv'>

      <div className='headDiv'>Connected Pages </div>
      <div className='connectedPages'>
      {connectedPages.length===0 && <div> No Page Connected </div>}
        {connectedPages.map((page) => (
          <div key={page.pageId}>
            <div className='pageBox'>
            <div>Integrated Page: <span className='pageName'>{page.name} </span></div>
            <div>
            <div className='btn delete-btn'
              onClick={()=> {
                setAction("Deleting Page")
                setLoading(true);
                setTimeout(()=> {
                  disconnectPage(page.pageId)
                },2000);
              }
            }
            >
               Delete Integration
              
            </div>
            <div className='btn navigate-btn' 
            onClick={()=> {
              setAction("Loading Conversations")
              setLoading(true);
              setTimeout(()=> {
                navigateToConversations(page)
              },2000);
            }
          }
          >
           Reply to Messages
               
          </div>
            </div>
            </div>
          </div>
        ))}
        </div>

      </div>
    </div>
    </div>
  );
};

export default FacebookConnection;
