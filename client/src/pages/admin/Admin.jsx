import React, { useEffect, useState } from 'react'
import '../../styles/Admin.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const token = localStorage.getItem('token');
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

const Admin = () => {
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [bannerInput, setBannerInput] = useState('');
  const [bannerImages, setBannerImages] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('userType') !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    fetchCountData();
    fetchBanner();
  }, []);

  const fetchCountData = async () => {
    const [users, products, orders] = await Promise.all([
      axios.get('http://localhost:6001/fetch-users', config),
      axios.get('http://localhost:6001/fetch-products', config),
      axios.get('http://localhost:6001/fetch-orders', config)
    ]);
    setUserCount(users.data.filter(user => user.usertype === 'customer').length);
    setProductCount(products.data.length);
    setOrdersCount(orders.data.length);
  };

  const fetchBanner = async () => {
    try {
      const res = await axios.get('http://localhost:6001/fetch-banner', config);
      setBannerImages(res.data); // assuming array of strings
    } catch (err) {
      toast.error("Failed to fetch banners");
    }
  };

  const updateBanner = async () => {
    if (!bannerInput.trim()) return;
    try {
      await axios.post('http://localhost:6001/update-banner', { banner: [...bannerImages, bannerInput] }, config);
      toast.success("Banner added");
      setBannerInput('');
      fetchBanner();
    } catch (err) {
      toast.error("Failed to add banner");
    }
  };

  

  return (
    <div className="admin-page">
      <div className="admin-home-card"><h5>Total users</h5><p>{userCount}</p><button onClick={() => navigate('/all-users')}>View all</button></div>
      <div className="admin-home-card"><h5>All Products</h5><p>{productCount}</p><button onClick={() => navigate('/all-products')}>View all</button></div>
      <div className="admin-home-card"><h5>All Orders</h5><p>{ordersCount}</p><button onClick={() => navigate('/all-orders')}>View all</button></div>
      <div className="admin-home-card"><h5>Add Product</h5><p>(new)</p><button onClick={() => navigate('/new-product')}>Add now</button></div>
      

      <div className="admin-banner-input">
        <h5>Update banner</h5>
        <div className="form-floating">
          <input type="text" className="form-control" id="floatingURLInput" value={bannerInput} onChange={(e) => setBannerInput(e.target.value)} />
          <label htmlFor="floatingURLInput">Banner URL</label>
        </div>
        <button onClick={updateBanner}>Add Banner</button>
      </div>

      
    </div>
  )
}

export default Admin;
