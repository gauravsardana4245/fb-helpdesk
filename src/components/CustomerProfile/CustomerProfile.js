import React, { useEffect, useState } from 'react';
import UserProfile from './UserProfile';
import UserDetails from './UserDetails';

const CustomerProfile = ({currentConversation, selectedPage}) => {
  const [customerData, setCustomerData] = useState({name: "user",email: "Not Available", picture: {data: {}}});
  const [customerId, setCustomerId] = useState(null);
  const [firstName,setFirstName] = useState("User");
  const [lastName,setLastName] = useState("");
  const [page, setPage] = useState(null);
  const [onlineStatus,setOnlineStatus] =  useState("offline");

  useEffect(()=> {
    if(selectedPage) {
      setPage(selectedPage);
    }
  },[selectedPage])

  useEffect(()=> {
    if(customerData.name) {
    const nameArr = customerData.name.split(" ");
    setFirstName(nameArr[0]);
    if(nameArr.length>1) {
      setLastName(nameArr[1]);
    }
  }
  },[customerData, currentConversation])

  const fetchUserDetails = async (id) => {
    try {
      const response = await fetch(`https://graph.facebook.com/v10.0/${id}?fields=id,name,email,picture&access_token=${page.access_token}`);
      const data = await response.json();
      console.log("dataUSer: ", data);
      setCustomerData(data);

    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(()=> {
     if(customerId) {
      fetchUserDetails(customerId);
     }
  },[customerId])

  useEffect(()=> {
    if(currentConversation) {
      if(currentConversation.customerId) {
        setCustomerId(currentConversation.customerId);
      }
  }
  },[currentConversation])

  return (
    <div className="customer-profile">

      <UserProfile onlineStatus={onlineStatus} customerData={customerData} />


      <UserDetails customerData={customerData}  firstName={firstName} lastName={lastName} />
    </div>
  );
};

export default CustomerProfile;
