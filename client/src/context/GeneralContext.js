import React, { createContext, useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export const GeneralContext = createContext();

const GeneralContextProvider = ({children}) => {


  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');


  const [productSearch, setProductSearch] = useState('');

  const [cartCount, setCartCount] = useState(0);


  useEffect(()=>{
    fetchCartCount();
  }, [])

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}, []);


  const fetchCartCount = async() =>{
    const userId = localStorage.getItem('userId');
    if(userId){
      await axios.get('http://localhost:6001/fetch-cart').then(
        (response)=>{
          setCartCount(response.data.filter(item=> item.userId === userId).length);
        }
      )
    }
  }

  const handleSearch = () =>{
    navigate('#products-body')
  }


  
  
  
  const login = async () => {
  try {
    const loginInputs = { email, password };
    const res = await axios.post("http://localhost:6001/login", loginInputs);

    localStorage.setItem("token", res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    localStorage.setItem("userId", res.data.user._id);
    localStorage.setItem("userType", res.data.user.usertype);
    localStorage.setItem("username", res.data.user.username);
    localStorage.setItem("email", res.data.user.email);

    navigate(res.data.user.usertype === 'admin' ? '/admin' : '/');
    toast.success('Login successful!');
  } catch (err) {
    toast.error('Login failed. Check credentials.');
    console.error(err);
  }
};

      
  const inputs = {username, email, usertype, password};

  const register = async () =>{
    try{
        await axios.post('http://localhost:6001/register', inputs)
        .then( async (res)=>{
            localStorage.setItem('userId', res.data._id);
            localStorage.setItem('userType', res.data.usertype);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('email', res.data.email);
toast.success('Login successful!');

            if(res.data.usertype === 'customer'){
                navigate('/');
            } else if(res.data.usertype === 'admin'){
                navigate('/admin');
            }

        }).catch((err) =>{
toast.error(' failed. Check credentials.');
            console.log(err);
        });
    }catch(err){
        console.log(err);
    }
  }



  const logout = async () =>{
    
    localStorage.clear();
    toast.success('Logout successful!');

    navigate('/auth');
  }



  return (
    <GeneralContext.Provider value={{login, register, logout, username, setUsername, email, setEmail, password, setPassword, usertype, setUsertype, productSearch, setProductSearch, handleSearch, cartCount}} >{children}</GeneralContext.Provider>
  )
}

export default GeneralContextProvider