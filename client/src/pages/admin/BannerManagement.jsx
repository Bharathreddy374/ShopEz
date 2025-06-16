import React, { useEffect, useState } from 'react'
import '../../styles/BannerManagement.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const token = localStorage.getItem('token');
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};

const BannerManagement = () => {
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
    // let setUserCount =0;
    // let setProductCount =0;
    // let setOrdersCount =0;
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
  const deleteBanner = async (index) => {
    try {
      const newBannerList = bannerImages.filter((_, i) => i !== index);
      await axios.post('http://localhost:6001/update-banner', { banner: newBannerList }, config);
      toast.success("Banner removed");
      fetchBanner();
    } catch (err) {
      toast.error("Failed to remove banner");
    }
  };

  return (
    <div className="admin-page">
      <div className="banner-preview">
        <h5>Current Banners</h5>
        {bannerImages.length === 0 && <p>No banners added yet.</p>}
        <div className="banner-thumbnails">
          {bannerImages.map((url, index) => (
            <div key={index} className="banner-thumbnail">
              <img src={url} alt={`banner-${index}`} />
              <button className="btn btn-sm btn-danger mt-2" onClick={() => deleteBanner(index)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BannerManagement;
