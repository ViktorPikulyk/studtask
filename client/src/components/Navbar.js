import '../styles/Navbar.css'
import edit_0 from '../styles/icons/edit_0.svg'

const Navbar = ({taskListTitle, handleClassesEditModeChange, handleColorChange}) => {
    
  
    return (
      <div className="navbar_main">
        <div className="navbar_top">
          <h1 className="navbar_title">{taskListTitle}</h1>
          <div className="navbar_controls">
                <input type="checkbox" id="nav_edit_button" onChange={handleClassesEditModeChange}></input>
                <label htmlFor="nav_edit_button" className="nav_edit_button_label"><img alt="/" src={edit_0}/></label>

                <div className="navbar_color_change" onChange={handleColorChange}>
                  <input type="radio" value={3} name="color" className="colorRadio" id="colorGreen" defaultChecked={true}/>
                  <label htmlFor="colorGreen"><div></div></label>
                  <input type="radio" value={2} name="color" className="colorRadio" id="colorYellow"/>
                  <label htmlFor="colorYellow"><div></div></label>
                  <input type="radio" value={1} name="color" className="colorRadio" id="colorGrey"/>
                  <label htmlFor="colorGrey"><div></div></label>
                  <input type="radio" value={0} name="color" className="colorRadio" id="colorWhite"/>
                  <label htmlFor="colorWhite"><div></div></label>
                </div>
          </div>
        </div>
        
        <hr className="navbar_line"/> 
      </div>
    );
  }
  
export default Navbar;