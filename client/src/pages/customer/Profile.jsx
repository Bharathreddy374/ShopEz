import React, { useContext, useEffect, useState } from 'react'
import '../../styles/Profile.css'
import { GeneralContext } from '../../context/GeneralContext'
import axios from 'axios';
import { toast } from 'react-toastify';
 
const Profile = () => {

  const {logout} = useContext(GeneralContext);
const token = localStorage.getItem("token"); // read from storage
const config = {
  headers: {
    Authorization: `Bearer ${token}` // token goes here
  }
};
  useEffect(() => {
  console.log("TOKEN?", axios.defaults.headers.common['Authorization']); // should print Bearer XYZ
  fetchOrders();
}, []);

  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');

  const [orders, setOrders] = useState([]);


  // useEffect(()=>{
  //   fetchOrders();
  // },[fetchOrders])

  const fetchOrders = async () =>{
    await axios.get(`http://localhost:6001/fetch-orders`,config).then(
      (response)=>{
        setOrders(response.data.filter(order=> order.userId === userId).reverse());
      }
    )
  }


  const  cancelOrder = async(id) =>{
    await axios.put('http://localhost:6001/cancel-order', {id},config).then(
      (response)=>{
        toast.success("Order cancelled!!");
        fetchOrders();
      }
    ).catch((err)=>{
      toast.success("Order cancellation failed!!");
    })
  }
 
  return ( 
    <div className="profilePage">
      
      <div className="profileCard">

          <span>
            <h5>Username: </h5>
            <p>{username}</p>
          </span>
          <span>
            <h5>Email: </h5>
            <p>{email}</p>
          </span>
          <span>
            <h5>Orders: </h5>
            <p>{orders.length}</p>
          </span>
          <button className='btn btn-danger' onClick={logout}>Logout</button>

      </div>

      <div className="profileOrders-container">
        <h3>Orders</h3>
        <div className="profileOrders">

          {orders.map((order)=>{
            return(
              <div className="profileOrder" key={order._id}>
                <img src={order.mainImg} alt="" />
                <div className="profileOrder-data">
                  <h4>{order.title}</h4>
                  <p>{order.description}</p>
                  <div>
                    <span><p><b>Size: </b> {order.size}</p></span>
                    <span><p><b>Quantity: </b> {order.quantity}</p></span>
                    <span><p><b>Price: </b> &#8377; {parseInt(order.price - (order.price * order.discount)/100) * order.quantity}</p></span>
                    <span><p><b>Payment method: </b> {order.paymentMethod}</p></span>
                  </div>
                  <div>
                    <span><p><b>Address: </b> {order.address}</p></span>
                    <span><p><b>Pincode: </b> {order.pincode}</p></span>
                    <span><p><b>Ordered on: </b> {order.orderDate.slice(0,10)}</p></span>
                   </div>
                  <div>
                    <span><p><b>Order status: </b> {order.orderStatus}</p></span>
                  </div>
                  {order.orderStatus === 'order placed' || order.orderStatus === 'In-transit' ?
                  
                    <button className='btn btn-danger' onClick={()=> cancelOrder(order._id)}>Cancel</button>
                  :
                  ""}
                </div>
              </div>
            )
          })}

            
        </div>
      </div>

    </div>
  )
}

export default Profile