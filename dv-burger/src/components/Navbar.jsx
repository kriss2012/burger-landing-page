import React from 'react'

const Navbar = () => {
  return (
   <nav className="navbar">
  <div className="nav-logo">BURGER KING</div>

  <div className="nav-center">
    <a href="#">Menu</a>
    <a href="#">Find Us</a>
    <a href="#">Offers</a>
  </div>

  <div className="nav-right">
    <button className="btn order-now">Order Now</button>
  </div>
</nav>

  )
}

export default Navbar