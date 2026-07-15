// MooVee logo op de login- en registerpagina
import logo from '../assets/MooVee-logo.png'

function CowLogo() {
  return (
    <div className="cow-logo">
      <img src={logo} alt="MooVee" className="cow-logo__image" />
    </div>
  )
}

export default CowLogo
