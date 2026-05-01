import React from 'react'
import Header from './components/Header/Header'
import SideNavbar from './components/SideNavbar/SideNavbar'

const Wrapper = ({ children }) => {
  return (
    <div className="WrapperContainer">
      <Header />
      <section className='wrapperSection hide-scrollbar'>
        <SideNavbar />
        {children}
      </section>
    </div>
  )
}

export default Wrapper