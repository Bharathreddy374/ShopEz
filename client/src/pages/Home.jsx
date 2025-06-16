import React, { useEffect, useState } from 'react'
import '../styles/Home.css'
import HomeBanner from '../images/home-banner1.png'
import Products from '../components/Products'
import Footer from '../components/Footer'
import FlashSale from '../components/FlashSale'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const token = localStorage.getItem("token"); // read from storage
const config = {
  headers: {
    Authorization: `Bearer ${token}` // token goes here
  }
};

const Home = () => {

  const navigate = useNavigate();

  const [bannerImg, setBannerImg] = useState([]);


  const fetchBanner = async () => {
  try {
    const res = await axios.get('http://localhost:6001/fetch-banner', config);
    const bannerData = res.data;

    // If your backend sends a single image string, convert to array
    const banners = Array.isArray(bannerData) ? bannerData : [bannerData];
    setBannerImg(banners);
  } catch (error) {
    console.error("Failed to fetch banner:", error);
  }
};
const [categoryPreviews, setCategoryPreviews] = useState([]);

const fetchCategoryPreviews = async () => {
  try {
    const res = await axios.get('http://localhost:6001/category-preview', config);
    setCategoryPreviews(res.data);
  } catch (err) {
    console.error("Error fetching category previews", err);
  }
};

useEffect(() => {
  fetchBanner();
  fetchCategoryPreviews();
}, []);



  return (
    <div className="HomePage">
      <div className="carousel">
        {bannerImg.length > 0 ? (
  <div id="homeBannerCarousel" className="carousel slide" data-bs-ride="carousel">
    <div className="carousel-indicators">
      {bannerImg.map((_, idx) => (
        <button
          key={idx}
          type="button"
          data-bs-target="#homeBannerCarousel"
          data-bs-slide-to={idx}
          className={idx === 0 ? "active" : ""}
          aria-current={idx === 0 ? "true" : undefined}
          aria-label={`Slide ${idx + 1}`}
        />
      ))}
    </div>
    <div className="carousel-inner">
      {bannerImg.map((img, idx) => (
        <div className={`carousel-item ${idx === 0 ? "active" : ""}`} key={idx}>
          <img src={img} className="d-block w-100" alt={`banner-${idx}`} />
        </div>
      ))}
    </div>
    <button
      className="carousel-control-prev"
      type="button"
      data-bs-target="#homeBannerCarousel"
      data-bs-slide="prev"
    >
      <span className="carousel-control-prev-icon" aria-hidden="true" />
      <span className="visually-hidden">Previous</span>
    </button>
    <button
      className="carousel-control-next"
      type="button"
      data-bs-target="#homeBannerCarousel"
      data-bs-slide="next"
    >
      <span className="carousel-control-next-icon" aria-hidden="true" />
      <span className="visually-hidden">Next</span>
    </button>
  </div>
) : (
  <div className="home-banner">
    <img src={HomeBanner} alt="fallback" />
  </div>
)}

      </div>

      <div className="home-categories-container">

   {categoryPreviews.map((item, idx) => (
    <div key={idx} className="home-category-card" onClick={() => navigate(`/category/${item.category}`)}>
      <img src={item.image} alt={item.category} />
      <h5>{item.category}</h5>
    </div>
  ))}

      </div>


      <div id='products-body'>

      </div>
      <FlashSale/>
      <Products category = 'all'  />


      <Footer />
    </div>
  )
}

export default Home